import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Restaurantes from '../pages/Restaurantes';
import Cultura from '../pages/Cultura';
import Turismo from '../pages/Turismo';
import Contactanos from '../pages/Contactanos';
import Register from '../pages/Register';
import Beneficios from '../pages/Beneficios';

function Routing() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Restaurantes" element={<Restaurantes/>}/>
          <Route path="/Cultura" element={<Cultura/>}/>
          <Route path="/Turismo" element={<Turismo/>}/>
          <Route path="/Contactanos" element={<Contactanos/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Beneficios" element={<Beneficios/>}/>
        </Routes>
      </Router>      
    </div>
  )
}

export default Routing
