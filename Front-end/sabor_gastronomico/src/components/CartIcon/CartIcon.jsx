import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import CartSidebar from "../CartSidebar/CartSidebar";
import "./CartIcon.css";

function CartIcon() {
  const { cartItems } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);

  return (
    <>
      <div className="cart-icon-container" onClick={() => setIsOpen(true)}>
        <ShoppingCart className="cart-icon" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>

      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export default CartIcon;