import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const initialFormData = {
  cancha: '',
  urlMaps: '',
  horario: '',
  monto: '',
  jugadoresPorEquipo: '',
  aliasCuenta: '',
};

const CreatePartidoForm = ({ onClose }) => {
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
      const response = await fetch("https://underc0departidos.up.railway.app/api/partido/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el partido");
      }

      const data = await response.json();
      console.log("Partido creado:", data);
      setMessage({ text: 'Partido creado exitosamente!', type: 'success' });
      setFormData(initialFormData); // Resetear el formulario
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {loading && <p>Cargando...</p>}
      {message.text && (
        <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>
          {message.text}
        </p>
      )}
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <label htmlFor={key} className="block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
          <Input
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            required
            type={key === 'monto' || key === 'jugadoresPorEquipo' ? 'number' : key === 'urlMaps' ? 'url' : 'text'}
          />
        </div>
      ))}
      <Button type="submit" className="w-full">Crear Partido</Button>
    </form>
  );
};

export default CreatePartidoForm;