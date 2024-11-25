import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavbarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartidosMenuOpen, setIsPartidosMenuOpen] = useState(false);
  const [isJugadoresMenuOpen, setIsJugadoresMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-6 lg:px-12 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/underc0delogo.png" alt="UNDERCODE Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold">ADMIN</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsPartidosMenuOpen(!isPartidosMenuOpen)}
              className="hover:text-gray-300"
            >
              Partidos
            </button>
            {isPartidosMenuOpen && (
              <div className="absolute bg-gray-800 text-white rounded-md shadow-lg mt-2">
                <Link to="/crear-partido" className="block px-4 py-2 hover:bg-gray-700">Crear Partido</Link>
                <Link to="/listar-partidos" className="block px-4 py-2 hover:bg-gray-700">Ver Partidos</Link>
                <Link to="/listar-partidos-por-estado" className="block hover:text-gray-300">Ver Partidos por Estado</Link>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsJugadoresMenuOpen(!isJugadoresMenuOpen)}
              className="hover:text-gray-300"
            >
              Jugadores
            </button>
            {isJugadoresMenuOpen && (
              <div className="absolute bg-gray-800 text-white rounded-md shadow-lg mt-2">
                <Link to="/registrar-jugador" className="block px-4 py-2 hover:bg-gray-700">Registrar Jugador</Link>
                <Link to="/listar-jugadores" className="block px-4 py-2 hover:bg-gray-700">Ver Jugadores</Link>
              </div>
            )}
          </div>
          
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="mt-2 md:hidden space-y-2">
          <div>
            <button
              onClick={() => setIsPartidosMenuOpen(!isPartidosMenuOpen)}
              className="block w-full text-left py-2 hover:text-gray-300"
            >
              Partidos
            </button>
            {isPartidosMenuOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/crear-partido" className="block hover:text-gray-300">Crear Partido</Link>
                <Link to="/listar-partidos" className="block hover:text-gray-300">Ver Partidos</Link>
                <Link to="/listar-partidos-por-estado" className="block hover:text-gray-300">Ver Partidos por Estado</Link>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => setIsJugadoresMenuOpen(!isJugadoresMenuOpen)}
              className="block w-full text-left py-2 hover:text-gray-300"
            >
              Jugadores
            </button>
            {isJugadoresMenuOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/registrar-jugador" className="block hover:text-gray-300">Registrar Jugador</Link>
                <Link to="/listar-jugadores" className="block
                 hover:text-gray-300">Ver Jugadores</Link>
              </div>
            )}
          </div>
          
        </div>
      )}
    </nav>
  );
}
