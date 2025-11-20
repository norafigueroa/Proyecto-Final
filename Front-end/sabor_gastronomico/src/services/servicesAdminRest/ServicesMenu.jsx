import axios from "../AxiosConfig";

const MenuService = {
  obtenerCategorias: () => axios.get("/categorias/"),
  obtenerPlatillos: () => axios.get("/platillos/"),
  crearPlatillo: (data) =>
    axios.post("/platillos/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  actualizarPlatillo: (id, data) =>
    axios.put(`/platillos/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  eliminarPlatillo: (id) => axios.delete(`/platillos/${id}/`),
};

export default MenuService;