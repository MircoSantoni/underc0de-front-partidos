import './App.css';
import Home from './pages/Home';
import Login from './pages/login';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

=======
import ModificarPartido from './pages/ModificarPartido';
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/modificar-partido" element={<ModificarPartido />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
