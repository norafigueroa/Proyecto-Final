import React, { useState } from "react";
import "./Promos.css";

function Promos() {

  const [promos, setPromos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [promoActual, setPromoActual] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    descuento: "",
    imagen: "",
  });

  // Abrir modal para agregar
  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setPromoActual({ id: null, titulo: "", descripcion: "", descuento: "", imagen: "" });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (promo) => {
    setModoEdicion(true);
    setPromoActual(promo);
    setModalAbierto(true);
  };

  const guardarPromo = () => {
    if (promoActual.titulo.trim() === "" || promoActual.descripcion.trim() === "") {
      alert("Completa todos los campos");
      return;
    }

    if (modoEdicion) {
      setPromos(promos.map((p) => (p.id === promoActual.id ? promoActual : p)));
    } else {
      setPromos([...promos, { ...promoActual, id: Date.now() }]); // agregar
    }

    setModalAbierto(false);
  };

  // Eliminar promoción
  const eliminarPromo = (id) => {
    setPromos(promos.filter((p) => p.id !== id));
  };

  // Manejo de imagen
  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onloadend = () => {
      setPromoActual({ ...promoActual, imagen: lector.result });
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <div>
        <div className="promociones-container">
            <h2 className="promociones-title">Promociones</h2>
            <p className="promociones-descripcion">
              Administra las promociones, descuentos y ofertas especiales.
            </p>

            <button className="btn btn-primario" onClick={abrirModalAgregar}> Agregar Promoción </button>

            <div className="lista-promos">
              {promos.length === 0 ? (
                <p className="no-promos"> No hay promociones registradas.</p>
              ) : ( 
                promos.map((promo) => (
                 <div key={promo.id} className="promo-card">
                  <h3> {promo.titulo} </h3>
                  <p> {promo.descripcion} </p>
                  <p className="descuento"> Descuento: {promo.descuento}% </p>

                  {promo.imagen && (
                    <img src={promo.imagen} alt="promo" className="promo-img"/>
                  )}

                  <div className="btn-group">
                    <button className="btn btn-primario" onClick={() => abrirModalEditar(promo)}> Editar </button>
                    <button className="btn btn-peligro" onClick={() => eliminarPromo(promo.id)}> Eliminar </button>
                  </div>

                 </div> 
                ))
              )}
            </div>

            {/* Modal */}
            {modalAbierto && ( 
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3> {modoEdicion ? "Editar Promoción" : "Agregar Nueva Promoción"} </h3>

                  <div className="formulario">
                    <label> Título: </label>
                    <input type="text" value={promoActual.titulo} onChange={(e) => setPromoActual({ ...promoActual, titulo: e.target.value })} required />

                    <label> Descripción: </label>
                    <textarea value={promoActual.descripcion} onChange={(e) => setPromoActual({ ...promoActual, descripcion: e.target.value})} required />

                    <label>Descuento (%):</label>
                    <input type="number" value={promoActual.descuento} onChange={(e) => setPromoActual({ ...promoActual, descuento: e.target.value })} required />

                    <label> Imagen: </label>
                    <input type="file" accept="image/*" onChange={manejarImagen} />

                    {promoActual.imagen && (
                      <img src={promoActual.imagen} alt="preview" className="preview-img" />
                    )}

                    <div className="btn-group">
                      <button className="btn btn-primario" onClick={guardarPromo}> {modoEdicion ? "Guardar Cambios" : "Agregar"} </button>
                      <button className="btn btn-secundario" onClick={() => setModalAbierto(false)}> Cancelar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>      
    </div>
  )
}

export default Promos
