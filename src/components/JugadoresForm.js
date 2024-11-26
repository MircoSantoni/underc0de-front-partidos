import React, { useState, useEffect } from 'react';
import { FaUsers, FaSpinner, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import axios from 'axios';

// Validation function for form data
const validateFormData = (formData) => {
  const errors = {};

  // Document number validation
  if (!formData.numDoc) {
    errors.numDoc = 'El número de documento es requerido';
  } else if (!/^\d+$/.test(formData.numDoc)) {
    errors.numDoc = 'El número de documento debe contener solo números';
  }

  // Name validation
  if (!formData.nombre) {
    errors.nombre = 'El nombre es requerido';
  } else if (formData.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  // Last name validation
  if (!formData.apellido) {
    errors.apellido = 'El apellido es requerido';
  } else if (formData.apellido.length < 2) {
    errors.apellido = 'El apellido debe tener al menos 2 caracteres';
  }

  // Phone number validation
  if (!formData.telefono) {
    errors.telefono = 'El teléfono es requerido';
  } else if (!/^\d{9,10}$/.test(formData.telefono)) {
    errors.telefono = 'El teléfono debe tener 9-10 dígitos';
  }

  return errors;
};

// Helper function to prepare registration data
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
  // State for modal and player management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
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

  // Fetch players for the match
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

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add player to the list
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

  // Remove player from the list
  const removePlayer = (numDoc) => {
    setSelectedPlayers(selectedPlayers.filter(player => player.numDoc !== numDoc));
  };

  // Handle payment for all players
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
      const registrationData = prepareRegistrationData(partido, selectedPlayers);
      
      const response = await axios.post(
        'https://underc0departidos.up.railway.app/api/create_preference', 
        registrationData
      );

      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
        fetchJugadores(); // Refresh players list
      } else {
        throw new Error("No se recibió una URL de pago");
      }
    } catch (error) {
      console.error('Error al unirse al partido:', error);
      setMessage({ 
        text: 'Hubo un error al procesar el pago', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch players when modal is opened
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
        Añadir Jugadores
      </Button>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999 // Extremely high z-index to ensure it's on top
          }}
        >
          <div 
            className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-2xl"
            style={{
              maxWidth: '500px', 
              width: '90%', 
              maxHeight: '90vh',
              margin: 'auto', 
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <FaTimes className="h-6 w-6" />
            </button>


            <h2 className="text-xl font-semibold mb-4">Añadir Jugadores al Partido</h2>

            {/* Existing Players List */}
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
                      {jugador.nombre} {jugador.apellido} -- {jugador.telefono}
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

            {/* Player Registration Form */}
            <div className="space-y-4 mb-6">
              {message.text && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {message.text}
                </p>
              )}

              {/* Document Input */}
              <div>
                <label htmlFor="numDoc" className="block text-sm font-medium text-gray-700 mb-1">
                  Documento
                </label>
                <Input 
                  type="text"
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

              {/* Name Input */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input 
                  type="text"
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

              {/* Last Name Input */}
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <Input 
                  type="text"
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

              {/* Phone Input */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input 
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese su teléfono"
                />
                {formErrors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>
                )}
              </div>

              {/* Attendance Checkbox */}
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
                  Confirmar asistencia posterior
                </label>
              </div>

              {/* Add Player Button */}
              <Button 
                onClick={addPlayerToList}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                disabled={loading || jugadores.length >= partido.limite_jugadores}
              >
                <FaPlus className="mr-2" /> Añadir Jugador
              </Button>
            </div>

            {/* Selected Players List */}
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

            {/* Payment Button */}
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