import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Galeria from '../pages/Galeria';
import Restaurantes from '../pages/Restaurantes';
import Cultura from '../pages/Cultura';
import Turismo from '../pages/Turismo';
import Contactanos from '../pages/Contactanos';
import RegisterUsuario from '../pages/RegisterUsuario';
import Beneficios from '../pages/Beneficios';
import Login from '../pages/Login';
import RestauranteRegister from '../pages/RestauranteRegister';

import AdminRestaurante from '../pages/AdminRestaurante';
 

function Routing() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Galeria" element={<Galeria/>}/>
          <Route path="/Restaurantes" element={<Restaurantes/>}/>
          <Route path="/Cultura" element={<Cultura/>}/>
          <Route path="/Turismo" element={<Turismo/>}/>
          <Route path="/Contactanos" element={<Contactanos/>}/>
          <Route path="/RegisterUsuario" element={<RegisterUsuario/>}/>
          <Route path="/Beneficios" element={<Beneficios/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/RestauranteRegister" element={<RestauranteRegister/>}/>

          {/* Rutas para la Pagina Admin de los restaurantes */}
          <Route path="/AdminRestaurante" element={<AdminRestaurante/>}/>
    
        </Routes>
      </Router>      
    </div>
  )
}

export default Routing
