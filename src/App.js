import './App.css';
import Home from './pages/Home';
import HomeAdmin from './pages/HomeAdmin';
import Login from './pages/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListarPartidosEstado from './pages/ListarPartidosEstado';
import ListarPartidos from './pages/ListarPartidos';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminDashboard from './pages/AdminDashboard'; 
import NavbarAdmin from './components/NavbarAdmin';

function App() {
  return (
    <div>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/home" 
          element={
            <>
              <Navbar /> 
              <Home />
            </>
          }
        />
        <Route 
          path="/login" 
          element={
            <>
              <Navbar /> 
              <Login />
            </>
          }
        />
        <Route 
          path="/listar-partidos-estado" 
          element={
            <>
              <Navbar />
              <ListarPartidosEstado />
            </>
          } 
        />

        {/* Rutas protegidas */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <NavbarAdmin /> 
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/homeAdmin" 
          element={
            <ProtectedRoute>
              <NavbarAdmin /> 
              <HomeAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/listar-partidos" 
          element={
            <ProtectedRoute>
              <NavbarAdmin /> 
              <ListarPartidos />
            </ProtectedRoute>
          } 
        />

          <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute>
              <NavbarAdmin/>
              <AdminDashboard/>
            </ProtectedRoute>
          }
          />
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
