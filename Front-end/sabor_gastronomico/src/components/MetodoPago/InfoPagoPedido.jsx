import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { crearPedido } from "../../services/ServicesPedidosCliente";
import Swal from "sweetalert2";
import VisaLogo from "../../assets/VisaLogo.jpg";
import MasterLogo from "../../assets/mastercardLogo.png";
import AmexLogo from "../../assets/americanExpressLogo.png";
import "./InfoPagoPedido.css";

function InfoPagoPedido() {
    const { cartItems, limpiarCarrito } = useContext(CartContext);

    for (let index = 0; index < cartItems.length; index++) {
      const element = cartItems[index];
      console.log(element);
    }
    console.log(cartItems);
    
    const navigate = useNavigate();

    const [titular, setTitular] = useState("");
    const [numTarjeta, setNumTarjeta] = useState("");
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pedidoExitoso, setPedidoExitoso] = useState(null);

    useEffect(() => {
      if (cartItems.length === 0) {
        navigate("/");
      }
    }, [cartItems, navigate]);

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const handlePagoSimulado = async () => {
    if (!titular || !numTarjeta || !mes || !anio || !aceptaTerminos) {
        await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos y acepta los términos",
        });
        return;
    }

    try {
        setLoading(true);

        // 1️⃣ Crear pedido
        const pedido = await crearPedido({
        restaurante: cartItems[0].restaurante,
        subtotal: total,
        total,
        metodo_pago: "efectivo",
        items: cartItems.map(item => ({
                    platillo: item.id,
                    cantidad: item.cantidad,
                    precio_unitario: Number(item.precio)
                  })),
        //email: `${titular.replaceAll(" ", ".").toLowerCase()}@correo.com`,
        });

        console.log(pedido);

        // 3️⃣ Limpiar carrito y guardar datos locales
        limpiarCarrito();
        setPedidoExitoso({
        numero: pedido.id,
        email: pedido.email,
        total,
        });

        // 4️⃣ Mostrar alerta y esperar a que el usuario la cierre
        await Swal.fire({
        icon: "success",
        title: "¡Pedido realizado con éxito!",
        html: `
            Pedido número: <b>${pedido.id}</b><br/>
            Correo: <b>${pedido.email}</b><br/>
            Total: ₡${total.toLocaleString("es-CR")}
        `,
        confirmButtonText: "Aceptar",
        });

        // 5️⃣ Navegar después de cerrar la alerta
        navigate("/");

    } catch (error) {
        console.error(error);
        await Swal.fire({
        icon: "error",
        title: "Error",
        text: "❌ Error al procesar el pago",
        });
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="container-pago">
      <h1>Confirmación de pago</h1>

      <div className="resumen-pedido">
        <h3>Detalle del pedido</h3>
        {cartItems.map((item) => (
          <p key={item.id}>
            {item.nombre} x {item.cantidad} — ₡{(item.precio * item.cantidad).toLocaleString("es-CR")}
          </p>
        ))}
        <h4>Total: ₡{total.toLocaleString("es-CR")}</h4>
      </div>

      <div className="tarjetas">
        <img src={VisaLogo} alt="Visa" />
        <img src={MasterLogo} alt="Mastercard" />
        <img src={AmexLogo} alt="Amex" />
      </div>

      <div className="formulario-pago">
        <label>Titular de la tarjeta</label>
        <input
          type="text"
          placeholder="Nombre completo"
          value={titular}
          onChange={(e) => setTitular(e.target.value)}
        />

        <label>Número de tarjeta</label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          maxLength="16"
          value={numTarjeta}
          onChange={(e) => setNumTarjeta(e.target.value)}
        />

        <div className="vencimiento">
          <select value={mes} onChange={(e) => setMes(e.target.value)}>
            <option value="">MM</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select value={anio} onChange={(e) => setAnio(e.target.value)}>
            <option value="">AA</option>
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() % 100 + i;
              return <option key={i} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <label className="terminos">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          Acepto términos y condiciones
        </label>

        <button onClick={handlePagoSimulado} disabled={loading}>
          {loading ? "Procesando..." : "Confirmar pago"}
        </button>
      </div>
    </div>
  );
}

export default InfoPagoPedido;
