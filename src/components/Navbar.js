import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-6 lg:px-12 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/underc0delogo.png" alt="UNDERCODE Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold">UNDERC0DE</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="hover:text-gray-300">Home</Link>
          <Link to="/listar-partidos" className="hover:text-gray-300">Ver Partidos</Link>
          <Link to="/login" className="hover:text-gray-300">Iniciar Sesión</Link>
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
        <div className="mt-2 md:hidden">
          <Link to="/listar-partidos" className="block py-2 hover:text-gray-300">Ver Partidos</Link>
          <Link to="/preferencias" className="block py-2 hover:text-gray-300">Preferencias</Link>
        </div>
      )}
    </nav>
  );
}