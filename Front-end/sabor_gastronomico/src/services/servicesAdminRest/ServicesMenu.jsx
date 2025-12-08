import axios from "../AxiosConfig";

const MenuService = {
  obtenerCategorias: () => axios.get("/categorias-menu/"),
  obtenerPlatillos: (restauranteId) => axios.get(`/platillos/?restaurante=${restauranteId}`),
  
  crearPlatillo: (data) =>
    axios.post("/platillos/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  
  actualizarPlatillo: (id, data) =>
    axios.patch(`/platillos/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  
  eliminarPlatillo: (id) => axios.delete(`/platillos/${id}/`),
};

export default MenuService;
