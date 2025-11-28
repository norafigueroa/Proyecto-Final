import axiosInstance from "../AxiosConfig";

// ==================== GRUPOS/ROLES ====================
export const obtenerGrupos = async () => {
  try {
    const respuesta = await axiosInstance.get('grupos');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener grupos:', error);
    throw error;
  }
};