import axios from 'axios';

const API_URL = 'http://localhost:8000/api/configuracion/';

const getAuthHeaders = () => {
  const token = getCookie('token'); // Obtiene del cookie
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Función para leer cookies
const getCookie = (name) => {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

/**
 * Obtener la configuración de la plataforma
 * Como es un modelo singleton, siempre devuelve la instancia única
 */
export const obtenerConfiguracion = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    throw error;
  }
};

/**
 * Actualizar la configuración de la plataforma (PATCH)
 * Ya NO usa ID, porque tu endpoint no recibe /id/
 */
export const actualizarConfiguracion = async (datos) => {
  try {
    const response = await axios.patch(API_URL, datos, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    throw error;
  }
};

/**
 * Actualización completa de la configuración (PUT)
 * Solo si deseas reemplazar toda la instancia
 */
export const actualizarConfiguracionCompleta = async (datos) => {
  try {
    const response = await axios.put(API_URL, datos, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración completa:', error);
    throw error;
  }
};
