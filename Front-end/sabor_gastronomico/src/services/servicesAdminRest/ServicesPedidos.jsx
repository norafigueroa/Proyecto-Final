import API from "../AxiosConfig";

// Obtener todos los pedidos
export const obtenerPedidos = async () => {
  try {
    const response = await API.get("pedidos/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }
};

// Obtener pedido por ID
export const obtenerPedidoPorId = async (id) => {
  try {
    const response = await API.get(`pedidos/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener pedido ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo pedido
export const crearPedido = async (pedidoData) => {
  try {
    const response = await API.post("pedidos/", pedidoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
};

// Actualizar un pedido
export const actualizarPedido = async (id, pedidoData) => {
  try {
    const response = await API.patch(`pedidos/${id}/`, pedidoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar pedido ${id}:`, error);
    throw error;
  }
};

// Eliminar un pedido
export const eliminarPedido = async (id) => {
  try {
    await API.delete(`pedidos/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar pedido ${id}:`, error);
    throw error;
  }
};
