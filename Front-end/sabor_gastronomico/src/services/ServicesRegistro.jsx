import axiosInstance from './AxiosConfig';

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

export { registerCliente };