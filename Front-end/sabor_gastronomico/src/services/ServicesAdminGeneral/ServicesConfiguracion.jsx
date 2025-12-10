import axios from 'axios';

const API_URL = 'http://localhost:8000/api/configuracion/';

const axiosConfiguracion = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
});

export const obtenerConfiguracion = async () => {
  try {
    const response = await axiosConfiguracion.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    throw error;
  }
};

export const actualizarConfiguracion = async (datos) => {
  try {
    const response = await axiosConfiguracion.patch(API_URL, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    console.log('Respuesta del error:', error.response?.data);
    throw error;
  }
};

export const actualizarConfiguracionCompleta = async (datos) => {
  try {
    const response = await axiosConfiguracion.put(API_URL, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar configuración completa:', error);
    throw error;
  }
};