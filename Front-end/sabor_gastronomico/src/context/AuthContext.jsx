import React, { createContext, useContext, useState, useEffect } from 'react';
import { postLogout } from '../services/ServicesLogin';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  // Al cargar la app, verificar si hay sesión activa en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      try {
        const datosUsuario = JSON.parse(usuarioGuardado);
        setUsuario(datosUsuario);
        setAutenticado(true);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('usuario');
      }
    }
    
    setCargando(false);
  }, []);

  // Función para loguear
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    setAutenticado(true);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  };

  // Función para desloguear
  const logout = async () => {
    try {
      await postLogout();
      setUsuario(null);
      setAutenticado(false);
      localStorage.removeItem('usuario');
    } catch (error) {
      console.error('Error al desloguear:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado,
        cargando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return contexto;
};