import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePartidoForm from '../components/CreatePartidoForm';

// Componente Button simplificado
const Button = ({ children, ...props }) => (
  <button
    style={{
      padding: '10px 20px',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
    }}
    {...props}
  >
    {children}
  </button>
);

// Componente Card simplificado
const Card = ({ children }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    {children}
  </div>
);

export default function Home() {
  const [mostrarCrearPartido, setMostrarCrearPartido] = useState(false);
  const navigate = useNavigate(); // Hook para navegar

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f3f3' }}>
      <main style={{ flexGrow: 1, padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Organizador de Partidos de Fútbol</h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'stretch',
            height: '300px', // Altura uniforme para las tarjetas
          }}
        >
          <Card>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Crea y Administra Partidos</h2>
              <p style={{ marginTop: '20px' }}>
                En esta aplicación puedes crear nuevos partidos, gestionar 

              </p>
              <p>
              sus detalles y también manejar a los creadores de partidos. 
              </p>
              <p>
               Para ello debes iniciar sesión.
              </p>
            </div>
            <Button
              style={{ backgroundColor: '#007bff', color: 'white' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Card>
          <Card>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Únete a un partido</h2>
              <p style={{ marginBottom: '20px' }}>Únete a un partido existente y registra tu participación.</p>
            </div>
            <Button
              style={{ backgroundColor: '#28a745', color: 'white' }}
              onClick={() => navigate('/listar-partidos-estado')}
            >
              Unirse a Partido
            </Button>
          </Card>
        </div>
      </main>

      {mostrarCrearPartido && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }}
          onClick={() => setMostrarCrearPartido(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CreatePartidoForm onClose={() => setMostrarCrearPartido(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
