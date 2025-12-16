import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./CartSidebar.css";

/**
 * 🔢 Calcula el precio unitario final (con promo si existe)
 */
function obtenerPrecioUnitario(item) {
  const precioBase = Number(
    typeof item.precio === "string"
      ? item.precio.replace(/[₡,]/g, "")
      : item.precio
  ) || 0;

  if (item.en_promocion && item.precio_promocional) {
    return Number(item.precio_promocional);
  }

  return precioBase;
}

function CartSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const {
    cartItems,
    incrementarCantidad,
    disminuirCantidad,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  // 🧮 Total del carrito
  const total = cartItems.reduce((sum, item) => {
    const precioUnitario = obtenerPrecioUnitario(item);
    return sum + precioUnitario * (item.cantidad || 1);
  }, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Tu carrito</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty">Tu carrito está vacío 🛒</p>
        ) : (
          cartItems.map((item) => {
            const precioUnitario = obtenerPrecioUnitario(item);
            const subtotal = precioUnitario * (item.cantidad || 1);

            return (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="cart-img"
                />

                <div className="cart-info">
                  <h4>
                    {item.nombre}
                    {item.en_promocion && (
                      <span className="badge-promo">PROMO</span>
                    )}
                  </h4>

                  {item.en_promocion ? (
                    <>
                      <p className="precio-original">
                        ₡{Number(item.precio).toLocaleString("es-CR")}
                      </p>
                      <p className="precio-promo">
                        ₡{precioUnitario.toLocaleString("es-CR")}
                      </p>
                    </>
                  ) : (
                    <p>
                      ₡{precioUnitario.toLocaleString("es-CR")}
                    </p>
                  )}

                  <div className="cantidad-control">
                    <button onClick={() => disminuirCantidad(item.id)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => incrementarCantidad(item.id)}>+</button>
                  </div>

                  <p className="subtotal">
                    Subtotal: ₡{subtotal.toLocaleString("es-CR")}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-footer">
          <h3>Total: ₡{total.toLocaleString("es-CR")}</h3>

          <button className="clear-btn" onClick={clearCart}>
            Vaciar carrito
          </button>

          <button
            className="pay-btn"
            onClick={() => {
              onClose();
              if (!usuario) {
                navigate("/login", {
                  state: { redirectTo: "/checkout" },
                });
              } else {
                navigate("/checkout");
              }
            }}
          >
            Pagar
          </button>
        </div>
      )}
    </div>
  );
}

export default CartSidebar;
