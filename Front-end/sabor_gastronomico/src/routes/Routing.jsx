import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Restaurantes from '../pages/Restaurantes';

function Routing() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Restaurantes" element={<Restaurantes/>}/>
        </Routes>
      </Router>      
    </div>
  )
}

export default Routing
