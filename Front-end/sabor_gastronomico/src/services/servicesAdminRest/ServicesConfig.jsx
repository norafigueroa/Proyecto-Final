import axiosInstance from "../AxiosConfig";

const ConfigService = {
  obtenerConfig: () => axiosInstance.get("/restaurante/config/"),

  actualizarConfig: (data) =>
    axiosInstance.put("/restaurante/config/", data),
};

export default ConfigService;
