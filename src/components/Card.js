import React from 'react';

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-lg border border-transparent hover:border-blue-600 transition duration-500 transform hover:scale-105 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
