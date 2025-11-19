import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCategorias } from '../services/ServicesCategorias';

const CategoriasContext = createContext();

export const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Traer categorías al cargar
  useEffect(() => {
    const traerCategorias = async () => {
      try {
        console.log('📖 Trayendo categorías...');
        const respuesta = await getCategorias();
        console.log('Respuesta completa:', respuesta);
        
        const lista = respuesta.results || respuesta;
        setCategorias(Array.isArray(lista) ? lista : []);
        console.log('Categorías cargadas:', lista);
      } catch (error) {
        console.error('Error trayendo categorías:', error);
      } finally {
        setCargando(false);
      }
    };

    traerCategorias();
    
    // Actualizar cada 10 segundos
    const intervalo = setInterval(traerCategorias, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <CategoriasContext.Provider value={{ categorias, cargando }}>
      {children}
    </CategoriasContext.Provider>
  );
};

export const useCategorias = () => {
  const contexto = useContext(CategoriasContext);
  if (!contexto) {
    throw new Error('useCategorias debe ser usado dentro de CategoriasProvider');
  }
  return contexto;
};