import axios from "../AxiosConfig";

const PerfilService = {
  obtenerPerfil: (id) => axios.get(`/perfiles/${id}`),
  actualizarPerfil: (id, data) => axios.put(`/perfiles/${id}`, data),
  cambiarPassword: (data) => axios.post("/cambiar-password/", data),
};

export default PerfilService;
