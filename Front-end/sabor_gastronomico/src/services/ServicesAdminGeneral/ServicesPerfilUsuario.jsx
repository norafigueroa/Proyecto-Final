import axiosInstance from '../AxiosConfig';

const API_URL = '/perfiles';

// Obtener perfil del usuario por ID
export const obtenerPerfilUsuario = async (usuarioId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

// Actualizar foto de perfil
export const actualizarFotoPerfil = async (usuarioId, fotoUrl) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${usuarioId}`, {
      foto_perfil: fotoUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar foto de perfil:', error);
    throw error;
  }
};

// Subir imagen a Cloudinary
export const subirImagenCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'el_sabor_de_la_perla');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload',
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};