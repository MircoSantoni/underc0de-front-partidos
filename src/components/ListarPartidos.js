// src/components/ListarPartidos.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListarPartidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await axios.get('/api/partidos/obtener');
        setPartidos(response.data.partidos);
      } catch (err) {
        setError('Error al cargar los partidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  if (loading) return <div>Cargando partidos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lista de Partidos</h1>
      <ul>
        {partidos.map(partido => (
          <li key={partido.idPartido}>
            <h2>{partido.fecha} a las {partido.hora}</h2>
            <p>Ubicación: <a href={partido.ubicacion} target="_blank" rel="noopener noreferrer">{partido.ubicacion}</a></p>
            <p>Límite de Jugadores: {partido.limite_jugadores}</p>
            <p>Precio: ${partido.precio}</p>
            <p>Comentario: {partido.comentario}</p>
            <p>Estado: {partido.estado}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarPartidos;
