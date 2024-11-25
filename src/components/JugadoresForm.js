import React, { useState, useEffect } from 'react';
import { FaUsers, FaSpinner, FaTimes } from 'react-icons/fa';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import axios from 'axios';

const JugadoresModal = ({ partido }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  
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
    console.log(partido.idPartido)
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJoinPartido = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const registrationData = {
        idPartido: partido.idPartido,
        numDoc: formData.numDoc,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        asistenciaAfter: formData.asistenciaAfter
      };

      const response = await axios.post(
        'https://underc0departidos.up.railway.app/api/jugadorPartido/inscribir', 
        registrationData
      );

      if (response.status === 200) {
        fetchJugadores(); // Refresh players list
        setMessage({ 
          text: response.data.message || 'Te has unido al partido', 
          type: 'success' 
        });
        // Reset form
        setFormData({
          numDoc: '',
          nombre: '',
          apellido: '',
          telefono: '',
          asistenciaAfter: false
        });
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
                  required
                  placeholder="Ingrese su nombre"
                />
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
                  required
                  placeholder="Ingrese su apellido"
                />
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
                  required
                  placeholder="Ingrese su teléfono"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="asistenciaAfter"
                  name="asistenciaAfter"
                  checked={formData.asistenciaAfter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    asistenciaAfter: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="asistenciaAfter" className="text-sm text-gray-700">
                  Asistencia posterior
                </label>
              </div>

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