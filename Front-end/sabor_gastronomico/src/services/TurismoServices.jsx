import axios from "axios";

class LugaresServices {
  static async obtenerLugares() {
    try {
      const response = await axios.get(`${API_URL}/lugares-turisticos`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo lugares:", error);
      throw error;
    }
  }
}

export default LugaresServices;
