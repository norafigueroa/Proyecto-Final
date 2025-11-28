import axiosInstance from "../AxiosConfig";

// ==================== RESTAURANTES ====================
export const obtenerRestaurantes = async () => {
  try {
    const respuesta = await axiosInstance.get('restaurantes/');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener restaurantes:', error);
    throw error;
  }
};

export const obtenerRestaurantePorId = async (id) => {
  try {
    const respuesta = await axiosInstance.get(`restaurantes/${id}/`);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener restaurante:', error);
    throw error;
  }
};

export const crearRestaurante = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('restaurantes/', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear restaurante:', error);
    throw error;
  }
};

export const actualizarRestaurante = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.put(`restaurantes/${id}/`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar restaurante:', error);
    throw error;
  }
};

export const actualizarParcialRestaurante = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`restaurantes/${id}/`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar parcialmente restaurante:', error);
    throw error;
  }
};

export const eliminarRestaurante = async (id) => {
  try {
    await axiosInstance.delete(`restaurantes/${id}/`);
    return { mensaje: 'Restaurante eliminado correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar restaurante:', error);
    throw error;
  }
};


// ==================== CATEGORÍAS (para restaurantes) ====================
export const obtenerCategorias = async () => {
  try {
    const respuesta = await axiosInstance.get('categorias/');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    throw error;
  }
};

export const crearCategoria = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('categorias/', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    throw error;
  }
};

export const actualizarCategoria = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.put(`categorias/${id}/`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    await axiosInstance.delete(`categorias/${id}/`);
    return { mensaje: 'Categoría eliminada correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    throw error;
  }
};