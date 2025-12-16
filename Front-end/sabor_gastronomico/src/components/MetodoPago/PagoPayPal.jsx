import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { crearPedido } from "../../services/ServicesPedidosCliente";

function PagoPayPal({ restauranteId }) {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { cartItems, clearCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => {
    const precio = item.en_promocion && item.precio_promocional
      ? Number(item.precio_promocional)
      : Number(item.precio);

    return sum + precio * item.cantidad;
  }, 0);

  const crearPedidoBackend = async () => {
    const pedido = {
      cliente: usuario.id,
      restaurante: restauranteId,
      total,
      detalles: cartItems.map(item => ({
        platillo: item.id,
        cantidad: item.cantidad,
        precio: item.en_promocion && item.precio_promocional
          ? item.precio_promocional
          : item.precio,
      })),
    };

    await crearPedido(pedido);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: "TU_CLIENT_ID_DE_PAYPAL",
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          await actions.order.capture();
          await crearPedidoBackend();

          clearCart();
          alert("✅ Pedido realizado con éxito");

          navigate("/");
        }}
        onError={(err) => {
          console.error("❌ Error PayPal:", err);
          alert("Error al procesar el pago");
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PagoPayPal;
