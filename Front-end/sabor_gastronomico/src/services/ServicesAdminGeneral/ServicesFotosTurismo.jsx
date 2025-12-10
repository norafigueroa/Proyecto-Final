import axiosInstance from "../AxiosConfig";

// ==================== FOTOS SITIOS TURÍSTICOS ====================
export const obtenerFotosSitio = async (sitioId) => {
  try {
    const respuesta = await axiosInstance.get('fotos-lugares');
    
    console.log(respuesta);
    
    // Manejar diferentes estructuras de respuesta
    let fotos = [];
    
    if (Array.isArray(respuesta.data)) {
      // Si respuesta.data es un array directo
      fotos = respuesta.data;
    } else if (respuesta.data.results && Array.isArray(respuesta.data.results)) {
      // Si viene en {results: [...]}
      fotos = respuesta.data.results;
    } else if (respuesta.data.data && Array.isArray(respuesta.data.data)) {
      // Si viene en {data: [...]}
      fotos = respuesta.data.data;
    } else {
      // Si no es un array, retornar vacío
      console.warn('⚠️ Estructura de respuesta no reconocida:', respuesta.data);
      fotos = [];
    }
    
    // Filtrar por sitio y loguear
    const fotosFiltradas = fotos.filter(foto => foto.lugar === sitioId);
    console.log(`✅ Fotos obtenidas para sitio ${sitioId}:`, fotosFiltradas);
    
    return fotosFiltradas;
  } catch (error) {
    console.error('❌ Error al obtener fotos:', error);
    return []; // Retornar array vacío en caso de error
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
    await axiosInstance.delete(`fotos-lugares/${id}`);
    return { mensaje: 'Foto eliminada correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar foto:', error);
    throw error;
  }
};