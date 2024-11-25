import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListarPartidos from './pages/ListarPartidos';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listar-partidos" element={<ListarPartidos />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;