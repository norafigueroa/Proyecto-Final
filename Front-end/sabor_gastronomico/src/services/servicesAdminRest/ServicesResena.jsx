import axios from "../AxiosConfig";

const ResenaService = {
  obtenerResenas() {
    return axios.get("/resenas/");
  },

  crearResena(datos) {
    return axios.post("/resenas/", datos);
  }
};

export default ResenaService;
