import React, { useState } from "react";
import "./GestionMenu.css";

function GestionMenu() {

  const [platos, setPlatos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [platoActual, setPlatoActual] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
  });

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setPlatoActual({ id: null, nombre: "", descripcion: "", precio: "", imagen: "" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (plato) => {
    setModoEdicion(true);
    setPlatoActual(plato);
    setModalAbierto(true);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (modoEdicion) {
      setPlatos(platos.map((p) => (p.id === platoActual.id ? platoActual : p)));

    } else{
      setPlatos([...platos, { ...platoActual, id: Date.now() }]);
    }
    setModalAbierto(false);
  };

  const eliminarPlato = (id) => {
    setPlatos(platos.filter((p) => p.id !== id));
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    const lector = new FileReader();
    lector.onloadend = () => {
      setPlatoActual({ ...platoActual, imagen: lector.result });
    };
    lector.readAsDataURL(archivo);
  };


  return (
    <div>
        <div className="gestion-container">
           <h2 className="gestion-title">Gestionar Menú</h2>

          <button className="btn agregar-btn" onClick={abrirModalAgregar}>
            Agregar Plato
          </button>

          <div className="lista-platos">
            {platos.length === 0 ? (
              <p className="no-platos">No hay platillos aún.</p>
            ) : (
              platos.map((plato) => (
                <div key={plato.id} className="plato-card">
                  <h3>{plato.nombre}</h3>
                  <p>{plato.descripcion}</p>
                  <p className="precio">₡{plato.precio}</p>

                  {plato.imagen && <img src={plato.imagen} alt="plato" className="plato-img" />}

                  <div className="btn-group">
                    <button className="btn editar-btn" onClick={() => abrirModalEditar(plato)}>
                      Editar
                    </button>
                    <button className="btn eliminar-btn" onClick={() => eliminarPlato(plato.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {modalAbierto && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{modoEdicion ? "Editar Plato" : "Agregar Nuevo Plato"}</h3>

                <form onSubmit={manejarSubmit} className="formulario">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={platoActual.nombre}
                    onChange={(e) => setPlatoActual({ ...platoActual, nombre: e.target.value })}
                    required
                  />

                  <label>Descripción:</label>
                  <textarea
                    value={platoActual.descripcion}
                    onChange={(e) => setPlatoActual({ ...platoActual, descripcion: e.target.value })}
                    required
                  ></textarea>

                  <label>Precio:</label>
                  <input
                    type="number"
                    value={platoActual.precio}
                    onChange={(e) => setPlatoActual({ ...platoActual, precio: e.target.value })}
                    required
                  />

                  <label>Imagen:</label>
                  <input type="file" accept="image/*" onChange={manejarImagen} />

                  {platoActual.imagen && (
                    <img src={platoActual.imagen} alt="preview" className="preview-img" />
                  )}

                  <div className="btn-group">
                    <button type="submit" className="btn guardar-btn">
                      {modoEdicion ? "Guardar Cambios" : "Agregar"}
                    </button>
                    <button type="button" className="btn cancelar-btn" onClick={() => setModalAbierto(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default GestionMenu
