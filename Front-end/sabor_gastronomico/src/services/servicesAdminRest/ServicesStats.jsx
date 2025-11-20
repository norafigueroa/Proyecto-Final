import axiosInstance from "../AxiosConfig";

const StatsService = {
  obtenerEstadisticas: () => axiosInstance.get("/stats"), 
};

export default StatsService;
