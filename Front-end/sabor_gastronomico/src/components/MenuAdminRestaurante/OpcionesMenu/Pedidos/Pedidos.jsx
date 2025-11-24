import React, { useEffect, useState } from "react";
import { obtenerPedidos, actualizarEstadoPedido } from "../../../../services/servicesAdminRest/ServicesPedidos";
import "./Pedidos.css";
function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await obtenerPedidos();
        setPedidos(data);
      } catch (error) {
        setError("Error al cargar los pedidos");
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await actualizarEstadoPedido(id, estado);

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estado_pedido: estado } : p
        )
      );
    } catch (err) {
      console.log("Error actualizando el estado del pedido");
    }
  };

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="pedidos-section">
      <h2>Pedidos Recibidos</h2>

      {pedidos.length === 0 ? (
        <p>No hay pedidos en este momento.</p>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Platos</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.usuario}</td>
                <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>

                <td>
                  {pedido.detalles?.map((item) => (
                    <div key={item.id}>
                      {item.cantidad}x {item.platillo} ₡{item.subtotal}
                    </div>
                  ))}
                </td>

                <td>₡{pedido.total}</td>
                <td>{pedido.metodo_pago}</td>

                <td>{pedido.estado_pedido}</td>

                <td>
                  <select
                    value={pedido.estado_pedido}
                    onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Pedidos;
