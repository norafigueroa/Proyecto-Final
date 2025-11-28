import axios from "../AxiosConfig";

const PerfilService = {
  obtenerPerfil: (id) => axios.get(`/perfiles/${id}`),
  actualizarPerfil: (id, data) => axios.patch(`/perfiles/${id}`, data, console.log(data)),
  cambiarPassword: (data) => axios.post("/cambiar-password/", data),
};

export default PerfilService;
