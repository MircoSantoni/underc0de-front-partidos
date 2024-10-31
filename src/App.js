import './App.css';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ListarPartidos from './components/ListarPartidos';
import ModificarPartido from './pages/ModificarPartido';
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/modificar-partido" element={<ModificarPartido />} />
        <Route path="/listar-partidos" element={<ListarPartidos />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
