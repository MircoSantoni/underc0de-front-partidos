import React from 'react';
import './Input.css';

export const Input = ({
  id,
  name,
  type = "text",
  label,
  error,
  required = false,
  disabled = false,
  placeholder = "",
  defaultValue = "",
  value,
  onChange,
  className = ""
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

