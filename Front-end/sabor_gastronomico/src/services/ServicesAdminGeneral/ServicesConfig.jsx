// src/services/servicesAdminRest/ServicesConfig.js

import axios from "../AxiosConfig";

const ConfigService = {
  obtenerConfig: () => axios.get("configuracion/"),

 // PATCH: Enviamos FormData. Axios establece el Content-Type como multipart/form-data.
 actualizarConfig: (data) =>
    axios.patch("configuracion/", data),
};

export default ConfigService;