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
import AdminGeneral from '../pages/AdminGeneral'; 
import ProtectedRoute from './ProtectedRoute'; 
import InfoRestaurantes from '../components/Restaurantes/InfoRestaurantes';

 
function Routing() {
  return (
    <Router>
      <Routes>
        
        {/* Rutas Públicas */}
        <Route path="/" element={<Home/>}/>
        <Route path="/Galeria" element={<Galeria/>}/>
        <Route path="/Restaurantes" element={<Restaurantes/>}/>
        <Route path="/Restaurante/:id" element={<InfoRestaurantes />} />
        <Route path="/Cultura" element={<Cultura/>}/>
        <Route path="/Turismo" element={<Turismo/>}/>
        <Route path="/Contactanos" element={<Contactanos/>}/>
        <Route path="/RegisterUsuario" element={<RegisterUsuario/>}/>
        <Route path="/Beneficios" element={<Beneficios/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/RestauranteRegister" element={<RestauranteRegister/>}/>

        {/* ---------------------------------------------------- */}
        {/* 🔒 RUTAS PROTEGIDAS POR ROL */}
        {/* ---------------------------------------------------- */}

        {/* 1. Dashboard Admin General (Rol: Admin General) */}
        <Route element={<ProtectedRoute rolesPermitidos={['Admin General']} />}>
            <Route path="/AdminGeneral" element={<AdminGeneral/>}/>
        </Route>

        {/* 2. Dashboard Admin Restaurante (Rol: Admin Restaurante) */}
        <Route element={<ProtectedRoute rolesPermitidos={['Admin Restaurante']} />}>
            <Route path="/AdminRestaurante" element={<AdminRestaurante/>}/>
        </Route>
        
        {/* 3. Rutas para CUALQUIER USUARIO logueado (ej. Mi Perfil) */}
        <Route element={<ProtectedRoute rolesPermitidos={['Cliente', 'Admin Restaurante', 'Admin General']} />}>
            <Route path="/MiCuenta" element={<div>Página de Mi Cuenta</div>}/>
        </Route>
        
        <Route path="*" element={<div>404 | Página no encontrada</div>} />
      </Routes>
    </Router> 
)
}

export default Routing