import axiosInstance from "../AxiosConfig";

// ==================== USUARIOS ====================

export const obtenerUsuarios = async () => {
  try {
    const respuesta = await axiosInstance.get('perfiles');
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
};

export const obtenerUsuarioPorId = async (id) => {
  try {
    const respuesta = await axiosInstance.get(`perfiles/${id}`);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    throw error;
  }
};

export const crearUsuario = async (datos) => {
  try {
    const respuesta = await axiosInstance.post('perfiles', datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    throw error;
  }
};

export const actualizarUsuario = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.put(`perfiles/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    throw error;
  }
};

export const actualizarParcialUsuario = async (id, datos) => {
  try {
    const respuesta = await axiosInstance.patch(`perfiles/${id}`, datos);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error al actualizar parcialmente usuario:', error);
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    await axiosInstance.delete(`perfiles/${id}`);
    return { mensaje: 'Usuario eliminado correctamente' };
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    throw error;
  }
};
