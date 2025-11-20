import axiosInstance from "../AxiosConfig";

// Obtener todos los pedidos
export const obtenerPedidos = async () => {
  const response = await axiosInstance.get("/pedidos/");
  return response.data;
};

// Cambiar estado del pedido
export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  const response = await axiosInstance.put(`/pedidos/${id}/`, {
    estado_pedido: nuevoEstado,
  });
  return response.data;
};
