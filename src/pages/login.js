import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email || !password) {
      setMessage('Por favor, complete todos los campos');
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Por favor, ingrese un email válido');
      return;
    }

    // Preparar datos de inicio de sesión
    const requestData = { 
      email, 
      password 
    };
    
    // Iniciar estado de carga
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://underc0departidos.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestData),
      });

      // Parsear la respuesta del servidor
      const data = await response.json();

      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        // Inicio de sesión exitoso
        setMessage(data.message);

        if (data.jwtAdmin) {
          // Guardar token de autenticación con configuraciones de seguridad
          Cookies.set('authToken', data.jwtAdmin, { 
            expires: 1, 
            secure: true,  // Usar solo en HTTPS
            sameSite: 'strict' // Mejora la seguridad
          });
          
          // Redirigir al panel de administración
          navigate('/admin');
        }
      } else {
        // Manejar errores específicos del servidor
        const errorMessage = data.message || 'Error en el inicio de sesión';
        setMessage(errorMessage);
        console.error('Error de inicio de sesión:', errorMessage);
      }
    } catch (error) {
      // Manejar errores de red o del servidor
      console.error('Error de conexión:', error);
      setMessage('No se pudo conectar con el servidor. Verifique su conexión.');
    } finally {
      // Finalizar estado de carga
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;