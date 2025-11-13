import React, { createContext, useState } from "react";

// 🔹 Creamos el contexto
export const CartContext = createContext();

// 🔹 Creamos el proveedor del carrito
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 👉 Agregar un plato al carrito
const addToCart = (plato) => {
  setCartItems((prevCart) => {
    const existente = prevCart.find((item) => item.nombre === plato.nombre);
    const cantidadNueva = plato.cantidad || 1; // por si no se definió

    if (existente) {
      // si ya existe, aumenta la cantidad seleccionada
      return prevCart.map((item) =>
        item.nombre === plato.nombre
          ? { ...item, cantidad: item.cantidad + cantidadNueva }
          : item
      );
    } else {
      // si no existe, se agrega nuevo con la cantidad elegida
      return [...prevCart, { ...plato, cantidad: cantidadNueva }];
    }
  });
};
  // 👉 Quitar un plato del carrito
  const removeFromCart = (nombre) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.nombre !== nombre));
  };

  // 👉 Vaciar el carrito
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
