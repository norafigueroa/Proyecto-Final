import { useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
//import PagoPayPal from "./PagoPayPal";

function Checkout() {
  const { cartItems } = useContext(CartContext);
  const { usuario, cargando } = useAuth();
  const navigate = useNavigate();

  console.log("Usuario en Checkout:", usuario);
  console.log(cargando);
  
  

  useEffect(() => {
    if (!cargando && !usuario) {
      navigate("/", { state: { redirectTo: "/checkout" } });
    }
  }, [usuario, cargando, navigate]);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (cartItems.length === 0) {
    return <h2>Tu carrito está vacío</h2>;
  }

  const total = cartItems.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="checkout-container">
      <h2>Resumen del pedido</h2>

      {cartItems.map((item) => (
        <div key={item.id} className="checkout-item">
          <p><strong>{item.nombre}</strong></p>
          <p>Cantidad: {item.cantidad}</p>
          <p>Precio: ₡{item.precio}</p>
          <p>Subtotal: ₡{item.precio * item.cantidad}</p>
          <hr />
        </div>
      ))}

      <h3>Total: ₡{total.toLocaleString("es-CR")}</h3>
    </div>
  );
}

export default Checkout;
