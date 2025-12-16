import axiosInstance from "./AxiosConfig";

export const crearPedido = async (pedidoData) => {
  const response = await axiosInstance.post("/pedidos", pedidoData);
  return response.data;
};

export const crearDetallePedido = async (detalle) => {
  const response = await axiosInstance.post("/detalles-pedido", detalle);
  return response.data;
};

export const confirmarPagoPayPal = async (orderID, pedido_id) => {
  const response = await axiosInstance.post("/paypal/confirmar/", {
    orderID,
    pedido_id,
  });
  return response.data;
};
