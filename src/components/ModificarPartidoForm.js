import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const ModificarPartidoModal = ({ partido, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_partido: partido.idPartido,
    fecha: partido.fecha,
    hora: partido.hora,
    nombreCancha: partido.cancha,
    ubicacion: partido.ubicacion,
    limite_jugadores: partido.limite_jugadores,
    precio: partido.precio,
    comentario: '',
    estado: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModificarPartido = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('jwt');
      
      const response = await axios.put(
        'https://underc0departidos.up.railway.app/api/partidos/modificar', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setMessage({ 
          text: response.data.message || 'Partido modificado exitosamente', 
          type: 'success' 
        });
        // Trigger parent component to refresh list
        onSuccess();
        // Close modal
        onClose();
      }
    } catch (error) {
      console.error('Error al modificar el partido:', error);
      setMessage({ 
        text: error.response?.data?.message || 'No se pudo modificar el partido', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 shadow-md rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaChevronDown className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaEdit className="mr-2" /> Modificar Partido
        </h2>

        <form onSubmit={handleModificarPartido} className="space-y-4">
          {message.text && (
            <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.text}
            </p>
          )}

          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <Input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <Input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="nombreCancha" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Cancha
            </label>
            <Input
              id="nombreCancha"
              name="nombreCancha"
              value={formData.nombreCancha}
              onChange={handleInputChange}
              required
              placeholder="Ingrese el nombre de la cancha"
            />
          </div>

          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación (URL de Google Maps)
            </label>
            <Input
              type="url"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              required
              placeholder="Ingrese la URL de ubicación"
            />
          </div>

          <div>
            <label htmlFor="limite_jugadores" className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Jugadores
            </label>
            <Input
              type="number"
              id="limite_jugadores"
              name="limite_jugadores"
              value={formData.limite_jugadores}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Número máximo de jugadores"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <Input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              placeholder="Ingrese el precio"
            />
          </div>

          <div>
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
              Comentario
            </label>
            <textarea
              id="comentario"
              name="comentario"
              value={formData.comentario}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Comentarios adicionales (opcional)"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">Seleccione un estado</option>
              <option value="reprogramado">Reprogramado</option>
              <option value="cancelado">Cancelado</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? 'Modificando...' : 'Modificar Partido'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ModificarPartidoModal;