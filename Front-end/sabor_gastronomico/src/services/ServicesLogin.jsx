import axiosInstance from './AxiosConfig';

const AUTH_BASE = '/'; // ya apunta a http://127.0.0.1:8000/api/

// ==================== LOGIN ====================
async function postLogin(credenciales) {
  try {
    const response = await axiosInstance.post(`${AUTH_BASE}login/`, credenciales);
    
    // Guardamos SOLO la info del usuario (tokens están en cookies HttpOnly)
    localStorage.setItem('usuario', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    throw error;
  }
}

// ==================== LOGOUT ====================
async function postLogout() {
  try {
    await axiosInstance.post(`${AUTH_BASE}logout/`);
    localStorage.removeItem('usuario');
    return { message: "Logout exitoso" };
  } catch (error) {
    console.error('❌ Error en logout:', error.response?.data || error.message);
    throw error;
  }
}

// ==================== REGISTRO CLIENTE ====================
async function postRegistroCliente(datosCliente) {
  try {
    const respuesta = await axiosInstance.post(`${AUTH_BASE}register-cliente/`, datosCliente);
    
    console.log('✅ Cliente registrado:', respuesta.data);
    return respuesta.data;
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
    throw error;
  }
}

export { postLogin, postLogout, postRegistroCliente  };
