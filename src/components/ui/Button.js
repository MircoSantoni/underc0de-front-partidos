import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = "button",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "" 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
