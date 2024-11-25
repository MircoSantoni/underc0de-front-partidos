import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const ListarPartidosEstado = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState("activo"); 

  useEffect(() => {
    const fetchPartidos = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3000/api/partido/obtener/${estado}`);
          console.log("Partidos obtenidos:", response.data.Partidos); 
          setPartidos(response.data.Partidos);
          setError(null);
        } catch (err) {
          console.error("Error al cargar los partidos:", err.response?.data || err.message);
          setError(`Error al cargar los partidos: ${err.response?.data?.msg || err.message}`);
        } finally {
          setLoading(false);
        }
      };
      

    fetchPartidos();
  }, [estado]); 

  const handleEstadoChange = (e) => {
    setEstado(e.target.value); 
  };

  if (loading) return <div>Cargando partidos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lista de Partidos</h1>

      <label htmlFor="estado" className="text-lg font-semibold mb-4 block">Filtrar por estado:</label>
      <select
        id="estado"
        value={estado}
        onChange={handleEstadoChange}
        className="mb-6 p-2 rounded border border-gray-300"
      >
        <option value="activo">Activo</option>
        <option value="cancelado">Cancelado</option>
        <option value="reprogramado">Reprogramado</option>
      </select>

      {partidos.length === 0 ? (
        <p className="text-center text-gray-600">No hay partidos disponibles en este estado.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-8">
          {partidos.map((partido) => (
            <Card key={partido.idPartido} className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {partido.comentario}
              </h2>
              <p className="text-gray-700 mb-2">Fecha: {partido.fecha} a las {partido.hora}
              </p>
              <p className="text-gray-700 mb-2">Ubicación: 
                <a
                  href={partido.ubicacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline ml-1"
                >
                  {partido.ubicacion}
                </a>
              </p>
              <p className="text-gray-700 mb-2">Límite de Jugadores: {partido.limite_jugadores}</p>
              <p className="text-gray-700 mb-2">Precio: ${partido.precio}</p>
              <p className="text-gray-700 mb-4">Estado: {partido.estado}</p>
              
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => alert(`Ver detalles del partido ${partido.idPartido}`)}
              >
                Unirse
              </button>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default ListarPartidosEstado;
