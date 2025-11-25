import axios from "axios";

const API_URL = "http://127.0.0.1:8000/lugares/";

class TurismoServices {
  obtenerLugares() {
    return axios.get(API_URL);
  }
}

export default new TurismoServices();

