import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = ({ rolesPermitidos }) => {
    const { autenticado, cargando, usuario } = useAuth();

    if (cargando) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Cargando sesión...</div>; 
    }

    // 1. Redirigir si NO está autenticado
    if (!autenticado) {
        return <Navigate to="/Login" replace />;
    }

    // 2. Verificar Rol si se requieren roles específicos
    if (rolesPermitidos && rolesPermitidos.length > 0) {
        const rolUsuario = usuario?.role;
        
        if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
            // Redirigir a Home si el rol no está permitido
            return <Navigate to="/" replace />; 
        }
    }

    // 3. Acceso Permitido
    return <Outlet />;
};

export default ProtectedRoute;