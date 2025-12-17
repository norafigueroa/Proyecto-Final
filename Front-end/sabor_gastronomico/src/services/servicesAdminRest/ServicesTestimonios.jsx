import axios from "../AxiosConfig";

export const ServicesTestimonios = {
  obtenerTestimonios: (restauranteId) => {
    return axios.get(`testimonios/?restaurante=${restauranteId}`);
  },

  crearTestimonio(data) {
    console.log(data);
    
    return axios.post("/testimonios/", data);
  },

  eliminarTestimonio(id) {
    return axios.delete(`/testimonios/${id}/`);
  }
};
