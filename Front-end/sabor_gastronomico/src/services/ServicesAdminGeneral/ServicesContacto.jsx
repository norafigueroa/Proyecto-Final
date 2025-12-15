import axios from 'axios';

const API_URL = 'http://localhost:8000/api/mensajes-contacto';

// Obtener todos los mensajes
export const obtenerMensajes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
};

// Obtener un mensaje por ID
export const obtenerMensajeDetalle = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensaje:', error);
    throw error;
  }
};

// Eliminar un mensaje
export const eliminarMensaje = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    throw error;
  }
};

// Marcar mensaje como leído (actualizar)
export const marcarMensajeLeido = async (id, datos) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
    throw error;
  }
};