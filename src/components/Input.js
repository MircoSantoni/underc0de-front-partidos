import React from 'react';

const Input = ({
  id,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder = "",
}) => (
  <input
    id={id}
    name={name}
    type={type}
    required={required}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  />
);

export default Input; 