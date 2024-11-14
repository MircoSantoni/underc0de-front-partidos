import React, { useState } from 'react';

const ModificarPartido = () => {
  const [formData, setFormData] = useState({
    id_partido: '',
    fecha: '',
    hora: '',
    nombreCancha: '',
    ubicacion: '',
    limite_jugadores: '',
    precio: '',
    comentario: '',
    estado: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt'); 

    try {
      const response = await fetch('/api/partidos/modificar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Mensaje de éxito
      } else {
        alert(`Error: ${data.message}`); // Mensaje de error
      }
    } catch (error) {
      console.error('Error al modificar el partido:', error);
      alert('Ocurrió un error al modificar el partido.');
    }
  };

  return (
    <div>
      <h2>Modificar Partido</h2>
      <form onSubmit={handleSubmit}>
        <label>
          ID del Partido:
          <input
            type="text"
            name="id_partido"
            value={formData.id_partido}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Hora:
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nombre de la Cancha:
          <input
            type="text"
            name="nombreCancha"
            value={formData.nombreCancha}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ubicación:
          <input
            type="url"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Límite de Jugadores:
          <input
            type="number"
            name="limite_jugadores"
            value={formData.limite_jugadores}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            step="0.01"
          />
        </label>
        <label>
          Comentario:
          <textarea
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
          />
        </label>
        <label>
          Estado:
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un estado</option>
            <option value="reprogramado">Reprogramado</option>
            <option value="cancelado">Cancelado</option>
            <option value="completado">Completado</option>
          </select>
        </label>
        <button type="submit">Modificar Partido</button>
      </form>
    </div>
  );
};

export default ModificarPartido;
