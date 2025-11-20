import axios from "../AxiosConfig";

const PerfilService = {
  obtenerPerfil: () => axios.get("/perfil/"),
  actualizarPerfil: (data) => axios.put("/perfil/", data),
  cambiarPassword: (data) => axios.post("/cambiar-password/", data),
};

export default PerfilService;
