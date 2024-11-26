import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapPin } from "react-icons/fa";
import ModificarPartidoModal from "../components/ModificarPartidoForm";
import JugadoresForm from "../components/JugadoresForm";
import ConfirmCancelModal from "../components/ui/ConfirmCancelModal";
import { Button } from "../components/ui/Button";

const ListadoPartidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modificarPartidoId, setModificarPartidoId] = useState(null);
  const [deletePartidoId, setDeletePartidoId] = useState(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          "https://underc0departidos.up.railway.app/api/partido/obtener",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPartidos(response.data.partidos);
        setError(null);
      } catch (err) {
        setError("Error al cargar los partidos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartidos();
  }, []);

  const handleModificarClick = (partidoId) => {
    setModificarPartidoId(partidoId);
  };

  const closeModificarModal = () => {
    setModificarPartidoId(null);
  };

  const handleRefreshPartidos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "https://underc0departidos.up.railway.app/api/partido/obtener",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPartidos(response.data.partidos);
      setError(null);
    } catch (err) {
      setError("Error al recargar los partidos");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (partidoId) => {
    console.log("Intentando eliminar partido con ID:", partidoId);
    setDeletePartidoId(partidoId);
  };

  const confirmDeletePartido = async (partidoId) => {
    try {
      const token = localStorage.getItem("jwt");
      console.log("Eliminando partido con ID:", partidoId);
      await axios.get(
        `https://underc0departidos.up.railway.app/api/partido/eliminar/${partidoId}`,
        
        {
          headers: {
            'Content-Type': 'application/json',

          },
        }
      );  
      setPartidos((prev) =>
        prev.filter((partido) => partido.idPartido !== partidoId)
      );
      setDeletePartidoId(null);
    } catch (err) {
      console.error("Error al eliminar el partido:", err);
    }
  };

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (loading) {
    return <p className="text-center">Cargando partidos...</p>;
  }

  return (
    <div className="pb-16">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancha</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugadores/Equipo</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jugadores Unidos</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partidos.map((partido) => (
              <tr key={partido.idPartido}>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                  <a
                    href={partido.ubicacion}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaMapPin className="mr-1 h-4 w-4" />
                    {partido.cancha || "Cancha"}
                  </a>
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">${partido.precio}</td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">{`${partido.fecha} ${partido.hora}`}</td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">{partido.limite_jugadores}</td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                  <JugadoresForm
                    partido={partido}
                    isOpen={openDropdown === partido.idPartido}
                    onToggle={() => setOpenDropdown(openDropdown === partido.idPartido ? null : partido.idPartido)}
                  />
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button
                    onClick={() => handleModificarClick(partido.idPartido)}
                    className="flex items-center text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600"
                  >
                    Modificar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(partido.idPartido)}
                    className="flex items-center text-xs sm:text-sm bg-red-500 hover:bg-red-600"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modificarPartidoId && (
        <ModificarPartidoModal
          partido={partidos.find((p) => p.idPartido === modificarPartidoId)}
          isOpen={!!modificarPartidoId}
          onClose={closeModificarModal}
          onSuccess={handleRefreshPartidos}
        />
      )}

      <ConfirmCancelModal
        show={!!deletePartidoId}
        onCancel={() => setDeletePartidoId(null)}
        onConfirm={() => confirmDeletePartido(deletePartidoId)}
      />
    </div>
  );
};

export default ListadoPartidos;
