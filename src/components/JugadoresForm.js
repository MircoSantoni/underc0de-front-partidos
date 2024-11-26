import React, { useState, useEffect } from 'react';
import { FaUsers, FaSpinner, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
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

const JugadoresModal = ({ partido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formErrors, setFormErrors] = useState({});
  
  // Form state for adding new players
  const [formData, setFormData] = useState({
    numDoc: '',
    nombre: '',
    apellido: '',
    telefono: '',
    asistenciaAfter: false
  });

  const [selectedPlayers, setSelectedPlayers] = useState([]);

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

  const addPlayerToList = () => {
    const validationErrors = validateFormData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    // Check if player is already added
    const isDuplicate = selectedPlayers.some(
      player => player.numDoc === formData.numDoc
    );

    if (isDuplicate) {
      setMessage({ 
        text: 'Este jugador ya ha sido añadido', 
        type: 'error' 
      });
      return;
    }

    // Add player to selected players
    setSelectedPlayers([...selectedPlayers, formData]);

    // Reset form
    setFormData({
      numDoc: '',
      nombre: '',
      apellido: '',
      telefono: '',
      asistenciaAfter: false
    });
    setFormErrors({});
    setMessage({ text: '', type: '' });
  };

  const removePlayer = (numDoc) => {
    setSelectedPlayers(selectedPlayers.filter(player => player.numDoc !== numDoc));
  };

  const handlePayForAllPlayers = async () => {
    if (selectedPlayers.length === 0) {
      setMessage({ 
        text: 'Debe añadir al menos un jugador', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const registrationData = {
        title: "Partido Futbol",
        quantity: selectedPlayers.length,
        price: partido.precio || 0,
        jugadores: selectedPlayers.map(player => ({
          numDoc: player.numDoc,
          nombre: player.nombre,
          apellido: player.apellido,
          telefono: player.telefono,
          asistenciaAfter: player.asistenciaAfter || false
        })),
        idPartido: partido.idPartido
      };

      const response = await axios.post(
        'https://underc0departidos.up.railway.app/api/create_preference', 
        registrationData
      );

      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No se recibió una URL de pago");
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

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center text-xs sm:text-sm"
      >
        <FaUsers className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        Añadir Jugadores
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

            <h2 className="text-xl font-semibold mb-4">Añadir Jugadores al Partido</h2>

            {message.text && (
              <p className={`mb-4 text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            {/* Formulario para añadir jugador */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="numDoc" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <Input
                  id="numDoc"
                  name="numDoc"
                  value={formData.numDoc}
                  onChange={handleInputChange}
                  placeholder="Ingrese su documento"
                />
                {formErrors.numDoc && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.numDoc}</p>
                )}
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre"
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                )}
              </div>

              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Ingrese su apellido"
                />
                {formErrors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.apellido}</p>
                )}
              </div>

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
                  placeholder="Ingrese su teléfono"
                />
                {formErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>
                )}
              </div>

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

              <Button 
                onClick={addPlayerToList}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Añadir Jugador
              </Button>
            </div>

            {/* Lista de jugadores seleccionados */}
            {selectedPlayers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Jugadores Añadidos</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {selectedPlayers.map((player, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 p-2 rounded-md flex justify-between items-center"
                    >
                      <span>
                        {player.nombre} {player.apellido} -- {player.telefono}
                      </span>
                      <button 
                        onClick={() => removePlayer(player.numDoc)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPlayers.length} jugador(es) añadidos
                </p>
              </div>
            )}

            {/* Botón de pago */}
            <Button 
              onClick={handlePayForAllPlayers}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || selectedPlayers.length === 0}
            >
              {loading 
                ? 'Procesando...' 
                : `Pagar por ${selectedPlayers.length} jugador(es)`
              }
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default JugadoresModal;