import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./CartSidebar.css";

function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + (parseInt(item.precio.replace(/[^\d]/g, "")) || 0) * item.cantidad,
    0
  );

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
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.imagen} alt={item.nombre} className="cart-img" />
              <div className="cart-info">
                <h4>{item.nombre}</h4>
                <p>Cantidad: {item.cantidad}</p>
                <p>₡{item.precio}</p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.nombre)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-footer">
          <h3>Total: ₡{total.toLocaleString()}</h3>
          <button className="clear-btn" onClick={clearCart}>Vaciar carrito</button>
          <button className="clear-btn" onClick={clearCart}>Pagar</button>
        </div>
      )}
    </div>
  );
}

export default CartSidebar;