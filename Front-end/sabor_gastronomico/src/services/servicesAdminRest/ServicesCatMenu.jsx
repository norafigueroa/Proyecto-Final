import axios from "../AxiosConfig";

const ServicesCatMenu = {
  obtenerCategorias() {
    return axios.get("/categorias-menu/");
  },

  crearCategoria(datos) {
    return axios.post("/categorias-menu/", datos);
  },

  actualizarCategoria(id, datos) {
    return axios.patch(`/categorias-menu/${id}/`, datos); 
  },

  eliminarCategoria(id) {
    return axios.delete(`/categorias-menu/${id}/`);
  },
};

export default ServicesCatMenu;
