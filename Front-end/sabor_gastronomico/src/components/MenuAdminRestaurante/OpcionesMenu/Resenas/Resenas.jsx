import React, { useState, useEffect } from "react";
import ResenaService from "../../../../services/servicesAdminRest/ServicesResena";
import "./Resenas.css";

function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [datos, setDatos] = useState({
    usuario: "",
    restaurante: "",
    calificacion: "",
    comentario: ""
  });

  const cambiarValor = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const enviarResena = async () => {
    if (!datos.usuario || !datos.restaurante || !datos.calificacion) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    try {
      await ResenaService.crearResena(datos);
      obtenerResenas();

      setDatos({
        usuario: "",
        restaurante: "",
        calificacion: "",
        comentario: ""
      });

    } catch (error) {
      console.error("Error al enviar reseña:", error);
    }
  };

  const obtenerResenas = async () => {
    try {
      const respuesta = await ResenaService.obtenerResenas();
      setResenas(respuesta.data);
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    }
  };

  useEffect(() => {
    obtenerResenas();
  }, []);

  return (
    <div className="resena-contenedor">
      <h2 className="titulo">Opiniones y Calificaciones</h2>

      <div className="datos-grid">
        <input type="number" name="usuario" placeholder="ID Usuario" value={datos.usuario} onChange={cambiarValor} />

        <input type="number" name="restaurante" placeholder="ID Restaurante" value={datos.restaurante} onChange={cambiarValor} />

        <input type="number" min="1" max="5" name="calificacion" placeholder="Calificación (1-5)" value={datos.calificacion} onChange={cambiarValor} />

        <input type="text" name="comentario" placeholder="Comentario" value={datos.comentario} onChange={cambiarValor} />
      </div>

      <button className="btn" onClick={enviarResena}> Agregar Reseña </button>

      <h3 className="subtitulo">Reseñas Recientes</h3>

      <ul className="lista-resenas">
        {resenas.map((r) => (
          <li key={r.id} className="item-resena"> ⭐ {r.calificacion} — {r.comentario} </li>
        ))}
      </ul>
    </div>
  );
}

export default Resenas;
