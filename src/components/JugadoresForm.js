import React, { useState, useEffect } from 'react';
import { FaUsers, FaSpinner, FaTimes } from 'react-icons/fa';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import axios from 'axios';

const validateFormData = (formData) => {
  const errors = {};

  if (!formData.numDoc) {
    errors.numDoc = 'El documento es requerido';
  } else if (!/^\d+$/.test(formData.numDoc)) {
    errors.numDoc = 'El documento debe contener solo números';
  }

  if (!formData.nombre) {
    errors.nombre = 'El nombre es requerido';
  } else if (formData.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!formData.apellido) {
    errors.apellido = 'El apellido es requerido';
  } else if (formData.apellido.length < 2) {
    errors.apellido = 'El apellido debe tener al menos 2 caracteres';
  }

  if (!formData.telefono) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!/^\d{9,12}$/.test(formData.telefono)) {
    errors.telefono = 'Ingrese un número de teléfono válido';
  }

  return errors;
};

const prepareRegistrationData = (partido, players) => {
  return {
    title: "Partido Futbol",
    quantity: players.length,
    price: partido.precio || 0,
    jugadores: players.map(player => ({
      numDoc: player.numDoc,
      nombre: player.nombre,
      apellido: player.apellido,
      telefono: player.telefono,
      asistenciaAfter: player.asistenciaAfter || false
    })),
    idPartido: partido.idPartido
  };
};

const JugadoresModal = ({ partido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formErrors, setFormErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    numDoc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    asistenciaAfter: false
  });

  const fetchJugadores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://underc0departidos.up.railway.app/api/jugadorPartido/${partido.idPartido}/jugadores`);
      setJugadores(response.data.jugadores || []);
    } catch (err) {
      setError('No se pudieron cargar los jugadores');
      console.error('Error fetching jugadores:', err);
    } finally {
      setLoading(false);
    }
  };
  


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleJoinPartido = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateFormData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Prepare registration data using helper function
      const registrationData = prepareRegistrationData(partido, [formData]);
      console.log(registrationData)

      const response = await axios.post(
        'https://underc0departidos.up.railway.app/api/create_preference', 
        registrationData
      );

      if (response.status === 200) {

        if (response.data.url) {
          window.location.href = response.data.url;
          fetchJugadores();
        } else {
          console.error("No se recibió una URL en la respuesta");
        }        fetchJugadores(); // Refresh players list
        setMessage({ 
          text: response.data.message || 'Te has unido al partido', 
          type: 'success' ,
          
        });
        
        // Reset form
        setFormData({
          numDoc: '',
          nombre: '',
          apellido: '',
          telefono: '',
          asistenciaAfter: false
        });
        setFormErrors({});
      }
    } catch (error) {
      console.error('Error al unirse al partido:', error);
      setMessage({ 
        text: error.response?.data?.message || 'No se pudo unir al partido', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchJugadores();
    }
  }, [isModalOpen]);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center text-xs sm:text-sm"
      >
        <FaUsers className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        Ver jugadores 
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 shadow-md rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Jugadores del Partido</h2>

            {/* Jugadores List Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Lista de Jugadores</h3>
              {loading ? (
                <div className="flex justify-center items-center text-blue-600">
                  <FaSpinner className="animate-spin mr-2" />
                  Cargando jugadores...
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : jugadores.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {jugadores.map((jugador, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-2 rounded-md"
                    >
                      {jugador.nombre} {jugador.apellido} {"--"} {jugador.telefono}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No hay jugadores inscritos</p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                {jugadores.length} / {partido.limite_jugadores} jugadores
              </p>
            </div>

            {/* Inscription Form */}
            <form onSubmit={handleJoinPartido} className="space-y-4">
              {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message.text}
                </p>
              )}

              {/* Documento Input */}
              <div>
                <label htmlFor="numDoc" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <Input
                  id="numDoc"
                  name="numDoc"
                  value={formData.numDoc}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su documento"
                />
                {formErrors.numDoc && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.numDoc}</p>
                )}
              </div>

              {/* Nombre Input */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su nombre"
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                )}
              </div>

              {/* Apellido Input */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su apellido"
                />
                {formErrors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.apellido}</p>
                )}
              </div>

              {/* Teléfono Input */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su teléfono"
                />
                {formErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>
                )}
              </div>

              {/* Asistencia Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="asistenciaAfter"
                  name="asistenciaAfter"
                  checked={formData.asistenciaAfter}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="asistenciaAfter" className="text-sm text-gray-700">
                  Asistencia posterior
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={loading || jugadores.length >= partido.limite_jugadores}
              >
                {loading ? 'Inscribiendo...' : 'Unirme al Partido'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JugadoresModal;