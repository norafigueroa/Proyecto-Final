import axios from "../AxiosConfig";

const ConfigService = {
  obtenerConfig: () => axios.get("/restaurante/config/"),

  actualizarConfig: (data) =>
    axios.patch("/restaurante/config/", data),
};

export default ConfigService;
