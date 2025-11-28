import axios from "../AxiosConfig";

const PerfilService = {
  obtenerPerfil: (id) => axios.get(`/perfiles/${id}`),
  actualizarPerfil: (id, data) => axios.patch(`/perfiles/${id}`, data),
  cambiarPassword: (id, data) => axios.patch(`/perfiles/${id}`, data),
};

export default PerfilService;
