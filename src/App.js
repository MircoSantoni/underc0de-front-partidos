import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import ListarPartidos from './components/ListarPartidos';
import ModificarPartido from './pages/ModificarPartido';
import ListarPartidosEstado from './components/ListarPartidosEstado';
import NavbarAdmin from './components/NavbarAdmin';

import ListarPartidos from './pages/ListarPartidos';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
      <Route path="/admin" element={<NavbarAdmin/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/modificar-partido" element={<ModificarPartido />} />
        <Route path="/listar-partidos" element={<ListarPartidos />} />
        <Route path="/listar-partidos-estado" element={<ListarPartidosEstado />} />
        <Route path="/listar-partidos" element={<ListarPartidos />} /> 
        <Route path="/listar-partidos-por-estado" element={<ListarPartidosEstado/>} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;