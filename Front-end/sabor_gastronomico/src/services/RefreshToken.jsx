import axios from 'axios';

export async function refreshAccessToken() {
  try {
    console.log('🔄 Renovando token...');

    await axios.post(
      'http://127.0.0.1:8000/api/token/refresh/',
      {},
      { withCredentials: true }
    );

    console.log('✅ Token renovado');
    return true;

  } catch (error) {
    console.error('❌ Error al renovar token:', error.response?.data || error.message);
    return false;
  }
}
