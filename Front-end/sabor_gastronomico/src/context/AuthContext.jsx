import React, { createContext, useContext, useState, useEffect } from 'react';
import { postLogout } from '../services/ServicesLogin';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  // 1. Al cargar la app, verificar si hay sesión guardada
  useEffect(() => {
    const verificarSesion = () => {
      try {
        const usuarioGuardado = localStorage.getItem('usuario');
        
        if (usuarioGuardado) {
          const datosUsuario = JSON.parse(usuarioGuardado);
          
          // Si tenemos usuario en localStorage, restaurarlo
          setUsuario(datosUsuario);
          setAutenticado(true);
          
          console.log('✅ Sesión restaurada desde localStorage');
        } else {
          // Sin usuario guardado
          setAutenticado(false);
          console.log('⚠️ No hay sesión guardada');
        }
      } catch (error) {
        console.error('❌ Error al verificar sesión:', error);
        localStorage.removeItem('usuario');
        setAutenticado(false);
      } finally {
        setCargando(false);
      }
    };

    verificarSesion();
  }, []);

  // 2. Función LOGIN: Actualiza estado y guarda en localStorage
  const login = (datosUsuario) => {
    try {
      setUsuario(datosUsuario);
      setAutenticado(true);
      localStorage.setItem('usuario', JSON.stringify(datosUsuario));
      
      console.log('✅ Usuario logueado:', datosUsuario.username);
    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
    }
  };

  // 3. Función LOGOUT: Llama al servicio, limpia estado y localStorage
  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      
      await postLogout();
      
      setUsuario(null);
      setAutenticado(false);
      localStorage.removeItem('usuario');
      
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('⚠️ Error al cerrar sesión (limpiando de todas formas):', error);
      
      // Limpiar de todas formas, aunque falle
      setUsuario(null);
      setAutenticado(false);
      localStorage.removeItem('usuario');
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