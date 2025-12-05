import axios from "../AxiosConfig";

export const ServicesInicio = {
  obtenerRestaurante(id) {
    return axios.get(`/restaurantes/${id}`);
  },

  actualizarRestaurante(id, datos) {
    return axios.patch(`/restaurantes/${id}`, datos);
  },

  subirFoto(formData) {
    console.log(formData);
    
    return axios.post(`/fotos-restaurante`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },



  actualizarHorario(idResta, data) {
    return axios.patch(`/restaurantes/${idResta}/horarios/`, data);
},

obtenerHorario(idResta) {
    return axios.get(`/restaurantes/${idResta}/horarios/`);
},

  crearHorario(idRestaurante, data) {
    return axios.post(`/restaurantes/${idRestaurante}/horarios/`, data);
  }

};
