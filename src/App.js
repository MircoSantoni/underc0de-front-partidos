import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListarPartidosEstado from './components/ListarPartidosEstado';
import ListarPartidos from './pages/ListarPartidos';
import ProtectedRoute from './components/ProtectedRoute'; // Crea este componente
import AdminDashboard from './pages/AdminDashboard'; // Crea este componente


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/listar-partidos" element={<ListarPartidos />} />
        <Route path="/listar-partidos-estado" element={<ListarPartidosEstado />} />
        

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;