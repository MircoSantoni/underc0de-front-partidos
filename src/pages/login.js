import React, { useState } from 'react';
import Cookies from 'js-cookie';
import '../login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestData = { email, password };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.status === 200) {
        setMessage(data.message);

        if (data.token) {
          Cookies.set('authToken', data.token, { expires: 1 });
        }
      } else {
        setMessage('Error en el inicio de sesión.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hubo un problema con el servidor.');
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
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Iniciar sesión</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
