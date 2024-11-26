import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePartidoForm from '../components/CreatePartidoForm';

// Componente Button simplificado
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-semibold ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Componente Card simplificado
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mostrarCrearPartido, setMostrarCrearPartido] = useState(false);
  const navigate = useNavigate(); // Hook para navegar

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto py-8 lg:px-12 md:px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Organizador de Partidos de Fútbol</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Crear Partido</h2>
            <p className="mb-4">Organiza un nuevo partido de fútbol y gestiona los jugadores.</p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setMostrarCrearPartido(true)}
            >
              Crear Partido
            </Button>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Únete a un partido</h2>
            <p className="mb-4">Únete a un partido existente y registra tu participación.</p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/listar-partidos')} 
            >
              Unirse a Partido
            </Button>
          </Card>
        </div>
      </main>

      {mostrarCrearPartido && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
          onClick={() => setMostrarCrearPartido(false)} // Cerrar el modal al hacer clic fuera
        >
          <div
            className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el formulario cierre el modal
          >
            <CreatePartidoForm onClose={() => setMostrarCrearPartido(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
