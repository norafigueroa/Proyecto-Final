import axiosInstance from "../AxiosConfig";

// ==================== SITIOS TURÍSTICOS ====================
export const obtenerSitiosTuristicos = async () => {
  try {
    const respuesta = await axiosInstance.get('lugares-turisticos');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener sitios turísticos:', error);
    throw error;
  }
};

export const obtenerSitioTuristicoPorId = async (id) => {
  try {
    const respuesta = await axiosInstance.get(`lugares-turisticos${id}/`);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener sitio turístico:', error);
    throw error;
  }
};

export const crearSitioTuristico = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('lugares-turisticos', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear sitio turístico:', error);
    throw error;
  }
};

export const actualizarSitioTuristico = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.put(`lugares-turisticos${id}/`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar sitio turístico:', error);
    throw error;
  }
};

export const actualizarParcialSitioTuristico = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`lugares-turisticos${id}/`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar parcialmente sitio turístico:', error);
    throw error;
  }
};

export const eliminarSitioTuristico = async (id) => {
  try {
    await axiosInstance.delete(`lugares-turisticos/${id}/`);
    return { mensaje: 'Sitio turístico eliminado correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar sitio turístico:', error);
    throw error;
  }
};