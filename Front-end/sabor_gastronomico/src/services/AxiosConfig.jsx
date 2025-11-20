import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true, // ✅ Envía y recibe cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== INTERCEPTOR DE RESPUESTA ====================
axiosInstance.interceptors.response.use(
  (respuesta) => {
    // Respuesta exitosa, retornar normalmente
    console.log('✅ Respuesta exitosa:', respuesta.status);
    return respuesta;
  },
  async (error) => {
    const solicitudOriginal = error.config;

    // Si es error 401 (token expirado) y NO hemos intentado renovar aún
    if (error.response?.status === 401 && !solicitudOriginal._reintento) {
  solicitudOriginal._reintento = true;

    try {
      console.log('🔄 Token expirado, intentando renovar...');
      
      // NO intentar renovar si ya es una solicitud de refresh
      if (solicitudOriginal.url === 'token/refresh/') {
        throw new Error('No se puede renovar token');
    }
    
    await axiosInstance.post('token/refresh/');
        
        console.log('✅ Token renovado exitosamente');
        
        // Reintentar la solicitud original con el nuevo token
        return axiosInstance(solicitudOriginal);
      } catch (errorRefresh) {
        console.error('❌ No se pudo renovar el token');
        
        // Limpiar localStorage
        localStorage.removeItem('usuario');
        
        // Redirigir a login
        window.location.href = '/Login';
        
        return Promise.reject(errorRefresh);
      }
    }

    // Para otros errores, rechazar normalmente
    console.error('❌ Error en respuesta:', error.response?.status);
    return Promise.reject(error);
  }
);

export default axiosInstance;