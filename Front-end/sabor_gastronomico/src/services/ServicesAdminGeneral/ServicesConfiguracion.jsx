import axiosInstance from "../AxiosConfig";

// ==================== CONFIGURACIÓN ====================
export const obtenerConfiguracion = async () => {
  try {
    const respuesta = await axiosInstance.get('configuracion');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error);
    throw error;
  }
};

export const actualizarConfiguracion = async (datos) => {
  try {
    const respuesta = await axiosInstance.patch('configuracion', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar configuración:', error);
    throw error;
  }
};
