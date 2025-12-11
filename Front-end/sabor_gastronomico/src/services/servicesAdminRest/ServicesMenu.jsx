import axios from "../AxiosConfig";

const MenuService = {
  obtenerCategorias: () => axios.get("/categorias-menu/"),
  
  obtenerPlatillos: () => axios.get("/platillos/"),
  
  crearPlatillo: (data) =>
    axios.post("/platillos/", data),
  
  actualizarPlatillo: (id, data) =>
    axios.patch(`/platillos/${id}/`, data),
  
  eliminarPlatillo: (id) => axios.delete(`/platillos/${id}/`),
};

export default MenuService;