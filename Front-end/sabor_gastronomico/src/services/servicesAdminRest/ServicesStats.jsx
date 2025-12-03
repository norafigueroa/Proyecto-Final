import axios from "../AxiosConfig";

const StatsService = {
  obtenerEstadisticas() {
    return axios.get("/estadisticas/");
  },
};

export default StatsService;
