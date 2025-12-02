import axiosInstance from "../AxiosConfig";

// ==================== ARTÍCULOS DE BLOG ====================
export const obtenerArticulosBlog = async () => {
  try {
    const respuesta = await axiosInstance.get('articulos-blog');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener artículos:', error);
    throw error;
  }
};

export const obtenerArticuloPorId = async (id) => {
  try {
    const respuesta = await axiosInstance.get(`articulos-blog/${id}`);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener artículo:', error);
    throw error;
  }
};

export const crearArticulo = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('articulos-blog', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear artículo:', error);
    throw error;
  }
};

export const actualizarArticulo = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`articulos-blog/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar artículo:', error);
    throw error;
  }
};

export const actualizarParcialArticulo = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`articulos-blog/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar parcialmente artículo:', error);
    throw error;
  }
};

export const eliminarArticulo = async (id) => {
  try {
    await axiosInstance.delete(`articulos-blog/${id}`);
    return { mensaje: 'Artículo eliminado correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar artículo:', error);
    throw error;
  }
};

// ==================== CATEGORÍAS DE BLOG ====================
export const obtenerCategoriasBlog = async () => {
  try {
    const respuesta = await axiosInstance.get('categorias-blog');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    throw error;
  }
};

export const crearCategoriaBlog = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('categorias-blog', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    throw error;
  }
};

export const actualizarCategoriaBlog = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`categorias-blog/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    throw error;
  }
};

export const eliminarCategoriaBlog = async (id) => {
  try {
    await axiosInstance.delete(`categorias-blog/${id}`);
    return { mensaje: 'Categoría eliminada correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    throw error;
  }
};
