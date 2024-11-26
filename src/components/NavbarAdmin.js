import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function NavbarAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartidosMenuOpen, setIsPartidosMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout handler function
  const handleLogout = () => {
    // Remove the authentication token from cookies
    Cookies.remove('authToken');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-6 lg:px-12 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/underc0delogo.png" alt="UNDERCODE Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold">ADMIN</span>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
          {/* Partidos dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPartidosMenuOpen(!isPartidosMenuOpen)}
              className="hover:text-gray-300"
            >
              Partidos
            </button>
            {isPartidosMenuOpen && (
              <div className="absolute bg-gray-800 text-white rounded-md shadow-lg mt-2">
                <Link to="/homeAdmin" className="block hover:text-gray-300 px-4 py-2">Home</Link>
                <Link to="/listar-partidos" className="block hover:text-gray-300 px-4 py-2">Ver Partidos</Link>
                <Link to="/admin-dashboard" className="block hover:text-gray-300 px-4 py-2">Dashboard</Link>
              </div>
            )}
          </div>

          {/* Logout button for desktop */}
          <button 
            onClick={handleLogout}
            className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
          >
            Cerrar Sesión
          </button>
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="mt-2 md:hidden space-y-2">
          {/* Partidos mobile menu */}
          <div>
            <button
              onClick={() => setIsPartidosMenuOpen(!isPartidosMenuOpen)}
              className="block w-full text-left py-2 hover:text-gray-300"
            >
              Partidos
            </button>
            {isPartidosMenuOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/homeAdmin" className="block hover:text-gray-300">Home</Link>
                <Link to="/listar-partidos" className="block hover:text-gray-300">Ver Partidos</Link>
                <Link to="/admin-dashboard" className="block hover:text-gray-300">Dashboard</Link>
              </div>
            )}
          </div>

          {/* Logout button for mobile */}
          <div>
            <button 
              onClick={handleLogout}
              className="block w-full text-left py-2 hover:text-gray-300 bg-red-600 hover:bg-red-700 rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}