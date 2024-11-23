import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import axios from 'axios';

const initialFormData = {
  fecha: '',
  hora: '',
  nombreCancha: '',
  ubicacion: '',
  limite_jugadores: '',
  precio: '',
  comentario: '',
};

const CreatePartidoForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post(
        'https://underc0departidos.up.railway.app/api/partido/crear',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage({ 
          text: response.data.message || 'Partido creado exitosamente', 
          type: 'success' 
        });
        setFormData(initialFormData);
      } else {
        setMessage({ 
          text: response.data.message || 'Error al crear el partido', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error al crear el partido', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative m-auto bg-white p-6 shadow-md rounded-lg" style={{ maxHeight: '400px',
     overflowY: 'scroll'}}>

      <form onSubmit={onSubmit} className="space-y-4">
        {loading && <p className="text-blue-600">Cargando...</p>}
        {message.text && (
          <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>
            {message.text}
          </p>
        )}
        
        {/* Campos del formulario */}
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <Input
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            type="date"
            required
          />
        </div>

        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
            Hora
          </label>
          <Input
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            type="time"
            required
          />
        </div>

        <div>
          <label htmlFor="nombreCancha" className="block text-sm font-medium text-gray-700">
            Nombre de la Cancha
          </label>
          <Input
            id="nombreCancha"
            name="nombreCancha"
            value={formData.nombreCancha}
            onChange={handleChange}
            required
            placeholder="Ingrese el nombre de la cancha"
          />
        </div>

        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
            Ubicación (URL de Maps)
          </label>
          <Input
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            type="url"
            required
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div>
          <label htmlFor="limite_jugadores" className="block text-sm font-medium text-gray-700">
            Límite de Jugadores
          </label>
          <Input
            id="limite_jugadores"
            name="limite_jugadores"
            value={formData.limite_jugadores}
            onChange={handleChange}
            type="number"
            min="1"
            required
            placeholder="Número máximo de jugadores"
          />
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <Input
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="Precio por jugador"
          />
        </div>

        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-gray-700">
            Comentario
          </label>
          <Input
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            placeholder="Información adicional del partido..."
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Partido'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePartidoForm;
