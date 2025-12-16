import axiosInstance from "../AxiosConfig";

export const confirmarPagoPayPal = async (orderID, pedidoId) => {
  const response = await axiosInstance.post("/paypal/confirmar/", {
    orderID,
    pedido_id: pedidoId,
  });
  return response.data;
};