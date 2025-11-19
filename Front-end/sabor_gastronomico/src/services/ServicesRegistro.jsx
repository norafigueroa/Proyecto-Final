import axiosInstance from './AxiosConfig';

// ==================== REGISTRO CLIENTE ====================
async function registerCliente(datosCliente) {
  try {
    console.log('📝 Registrando cliente...');
    
    const response = await axiosInstance.post('register-cliente/', datosCliente);
    
    console.log('✅ Cliente registrado:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
    throw error;
  }
}

// ==================== REGISTRO RESTAURANTE ====================
async function registerRestaurante(datosRestaurante) {
  try {
    console.log('📝 Registrando restaurante y propietario...');
    
    const response = await axiosInstance.post('register-restaurante', datosRestaurante);
    
    console.log('✅ Restaurante registrado:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.data || error.message);
    throw error;
  }
}

export { registerCliente, registerRestaurante };