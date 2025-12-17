import axios from 'axios';
import cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true, // lo dejamos como lo tienes
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERCEPTOR DE REQUEST ====================
axiosInstance.interceptors.request.use(
  (config) => {
    const access = cookies.get('access_token');
    console.log("TOKEN ENVIADO 👉", access);
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
      console.log("AUTH HEADER 👉", config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== INTERCEPTOR DE RESPUESTA ====================
axiosInstance.interceptors.response.use(
  (respuesta) => {
    return respuesta;
  },

  async (error) => {
    const solicitudOriginal = error.config;

    if (
      error.response?.status === 401 &&
      !solicitudOriginal._reintento &&
      !solicitudOriginal.url.includes("pedidos")
    ) {
      solicitudOriginal._reintento = true;

      try {
        console.log('🔄 Intentando renovar el token...');

        if (solicitudOriginal.url.includes("token/refresh")) {
          throw new Error("No se puede renovar desde refresh");
        }

        await axiosInstance.post('token/refresh/');

        return axiosInstance(solicitudOriginal);

      } catch (errorRefresh) {
        console.error('❌ No se pudo renovar el token, cerrando sesión');

        localStorage.removeItem("usuario");
        window.location.href = '/Login';

        return Promise.reject(errorRefresh);
      }
    }

    console.error('❌ Error en respuesta:', error.response?.status);
    return Promise.reject(error);
  }
);

export default axiosInstance;
