import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import Card from '../components/Card';
import JugadoresModal from '../components/JugadoresForm';

const ListarPartidosEstado = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState("activo");
  const [ordenamiento, setOrdenamiento] = useState('fecha');

  useEffect(() => {
    const fetchPartidos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://underc0departidos.up.railway.app/api/partido/obtener/${estado}`);
        
        console.log("Partidos obtenidos:", response.data.Partidos);
        
        // Sort parties in the frontend
        let sortedPartidos = [...response.data.Partidos];
        
        if (ordenamiento === 'precio') {
          sortedPartidos.sort((a, b) => a.precio - b.precio);
        } else {
          // Default sort by fecha
          sortedPartidos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        }
        
        setPartidos(sortedPartidos);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los partidos:", err);
        setError("No se pudieron cargar los partidos. Intente nuevamente.");
        setPartidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, [estado, ordenamiento]);

  const handleEstadoChange = (e) => {
    setEstado(e.target.value);
  };

  const handleOrdenamientoChange = (e) => {
    setOrdenamiento(e.target.value);
  };

  if (loading) return <div className="text-center p-4">Cargando partidos...</div>;
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lista de Partidos</h1>

      <div className="flex justify-between mb-6">
        <div>
          <label htmlFor="estado" className="text-lg font-semibold mr-2">Estado:</label>
          <select
            id="estado"
            value={estado}
            onChange={handleEstadoChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="activo">Activo</option>
            <option value="cancelado">Cancelado</option>
            <option value="reprogramado">Reprogramado</option>
          </select>
        </div>

        <div>
          <label htmlFor="ordenamiento" className="text-lg font-semibold mr-2">Ordenar por:</label>
          <select
            id="ordenamiento"
            value={ordenamiento}
            onChange={handleOrdenamientoChange}
            className="p-2 rounded border border-gray-300"
          >
            <option value="fecha">Fecha</option>
            <option value="precio">Precio</option>
          </select>
        </div>
      </div>

      {partidos.length === 0 ? (
        <p className="text-center text-gray-600">No hay partidos disponibles en este estado.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-40 h-auto">
          {partidos.map((partido) => (
            <Card key={partido.idPartido} className="p-6 ">
              <h2 className="text-xl font-semibold mb-2">{partido.comentario}</h2>
              <p className="text-gray-700 mb-2">Fecha: {partido.fecha} a las {partido.hora}</p>
              <p className="text-gray-700 mb-2">
                Ubicación: 
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

            <div className=''>
              <JugadoresModal partido={partido} />
            </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListarPartidosEstado;
