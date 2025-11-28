import axiosInstance from "../AxiosConfig";

// ==================== FOTOS SITIOS TURÍSTICOS ====================
export const obtenerFotosSitio = async (sitioId) => {
  try {
    const respuesta = await axiosInstance.get('fotos-lugares');
    return respuesta.data.filter(foto => foto.lugar === sitioId);
  } catch (error) {
    console.error('❌ Error al obtener fotos:', error);
    throw error;
  }
};

export const crearFotoSitio = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('fotos-lugares', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear foto:', error);
    throw error;
  }
};

export const eliminarFotoSitio = async (id) => {
  try {
    await axiosInstance.delete(`fotos-lugares${id}/`);
    return { mensaje: 'Foto eliminada correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar foto:', error);
    throw error;
  }
};
