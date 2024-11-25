import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/Button';
import { FaCreditCard } from 'react-icons/fa';

const PagarPartido = ({ partido, jugador }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePagar = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear preferencia de pago
      const preferenceResponse = await axios.post(
        'https://underc0departidos.up.railway.app/api/create-preference', 
        {
          title: `Inscripción Partido ${partido.cancha}`,
          quantity: 1,
          price: partido.precio,
          // Datos adicionales del jugador y partido
          jugadorId: jugador.idJugador,
          partidoId: partido.idPartido
        }
      );

      // Redirigir al checkout de MercadoPago
      if (preferenceResponse.data.init_point) {
        window.location.href = preferenceResponse.data.init_point;
      } else if (preferenceResponse.data.sandbox_init_point) {
        window.location.href = preferenceResponse.data.sandbox_init_point;
      } else {
        throw new Error('No se pudo generar el punto de pago');
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError(error.response?.data?.message || 'No se pudo iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      <Button 
        onClick={handlePagar}
        disabled={loading}
        className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? (
          <>Procesando pago...</>
        ) : (
          <>
            <FaCreditCard className="mr-2" /> 
            Pagar ${partido.precio}
          </>
        )}
      </Button>
    </div>
  );
};

export default PagarPartido;