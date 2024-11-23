import React from 'react';
import { FaUsers, FaChevronDown } from 'react-icons/fa';
import { Button } from './ui/Button';
const JugadoresDropdown = ({ partido, isOpen, onToggle }) => {
  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        className="flex items-center text-xs sm:text-sm"
      >
        <FaUsers className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">
          {partido.jugadores_unidos ? partido.jugadores_unidos.length : 0} Jugadores
        </span>
        <span className="sm:hidden">
          {partido.jugadores_unidos ? partido.jugadores_unidos.length : 0}
        </span>
        <FaChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {partido.jugadores_unidos &&
              partido.jugadores_unidos.map((jugador, index) => (
                <a
                  key={index}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  {jugador}
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JugadoresDropdown;