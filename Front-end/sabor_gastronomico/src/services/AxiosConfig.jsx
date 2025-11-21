import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true, // ✔ Necesario para cookies HttpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERCEPTOR DE RESPUESTA ====================
axiosInstance.interceptors.response.use(
  (respuesta) => {
    console.log('✅ Respuesta exitosa:', respuesta.status);
    return respuesta;
  },

  async (error) => {
    const solicitudOriginal = error.config;

    // ==================== CASO: ERROR 401 ====================
    if (error.response?.status === 401 && !solicitudOriginal._reintento) {
      solicitudOriginal._reintento = true;

      try {
        console.log('🔄 Intentando renovar el token...');

        // Evitar loops: si ya estamos en /token/refresh/ → no renovar
        if (solicitudOriginal.url.includes("token/refresh")) {
          throw new Error("No se puede renovar desde refresh");
        }

        // 🔄 Solicitud para refrescar token (cookie HttpOnly se envía sola)
        await axiosInstance.post('token/refresh/');

        console.log('✅ Token renovado exitosamente, repitiendo solicitud...');

        // Reintentar la solicitud original
        return axiosInstance(solicitudOriginal);

      } catch (errorRefresh) {
        console.error('❌ No se pudo renovar el token, cerrando sesión');

        // Borrar datos locales del usuario (si guardaste algo)
        localStorage.removeItem("usuario");

        // Redirigir al login
        window.location.href = '/Login';

        return Promise.reject(errorRefresh);
      }
    }

    // ==================== OTROS ERRORES ====================
    console.error('❌ Error en respuesta:', error.response?.status);
    return Promise.reject(error);
  }
);

export default axiosInstance;
