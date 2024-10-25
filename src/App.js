import './App.css';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/home" element={<Home/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
