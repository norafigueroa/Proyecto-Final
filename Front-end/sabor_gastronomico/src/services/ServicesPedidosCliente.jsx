import API from "./AxiosConfig";

export const crearPedido = async (data) => {
  const response = await API.post("pedidos/", data, { withCredentials: true });
  return response.data;
};