import React, { useState, useEffect } from "react";
import "./GestionMenu.css";
import MenuService from "../../../../services/servicesAdminRest/ServicesMenu";

function GestionMenu() {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [platoActual, setPlatoActual] = useState({
    id: null,
    nombre_platillo: "",
    descripcion: "",
    precio: "",
    categoria_menu: "",
    foto: "",
  });

  useEffect(() => {
    cargarCategorias();
    cargarPlatos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await MenuService.obtenerCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const cargarPlatos = async () => {
    try {
      const res = await MenuService.obtenerPlatillos();
      setPlatos(res.data);
    } catch (err) {
      console.error("Error cargando platillos:", err);
    }
  };

  const abrirModalAgregar = () => {
    setModoEdicion(false);
    setPlatoActual({
      id: null,
      nombre_platillo: "",
      descripcion: "",
      precio: "",
      categoria_menu: "",
      foto: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (plato) => {
    setModoEdicion(true);
    setPlatoActual(plato);
    setModalAbierto(true);
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onloadend = () => {
      setPlatoActual({ ...platoActual, foto: lector.result });
    };
    lector.readAsDataURL(archivo);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (!platoActual.nombre_platillo || !platoActual.descripcion || !platoActual.precio) {
      alert("Completa todos los campos");
      return;
    }

    const formData = new FormData();
    Object.entries(platoActual).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });

    try {
      if (modoEdicion) {
        await MenuService.actualizarPlatillo(platoActual.id, formData);
      } else {
        await MenuService.crearPlatillo(formData);
      }

      await cargarPlatos();
      setModalAbierto(false);

    } catch (err) {
      console.error("Error guardando:", err);
    }
  };

  const eliminarPlato = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este platillo?")) return;

    try {
      await MenuService.eliminarPlatillo(id);
      cargarPlatos();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  return (
    <div className="gm-container">

      <h2 className="gm-title">Gestión del Menú</h2>
      <p className="gm-subtitle">Administra tus platillos de manera profesional.</p>

      <button className="gm-btn-primary" onClick={abrirModalAgregar}>
        Agregar Platillo
      </button>

      <div className="gm-grid">
        {platos.length === 0 ? (
          <p className="gm-no-items">No hay platillos registrados.</p>
        ) : (
          platos.map((p) => (
            <div className="gm-card" key={p.id}>
              {p.foto && <img src={p.foto} className="gm-card-img" alt="plato" />}

              <h3 className="gm-card-title">{p.nombre_platillo}</h3>
              <p className="gm-card-desc">{p.descripcion}</p>
              <p className="gm-card-price">₡{p.precio}</p>

              <div className="gm-card-actions">
                <button className="gm-btn-edit" onClick={() => abrirModalEditar(p)}>Editar</button>
                <button className="gm-btn-delete" onClick={() => eliminarPlato(p.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalAbierto && (
        <div className="gm-modal-overlay">
          <div className="gm-modal-content">

            <h3>{modoEdicion ? "Editar Platillo" : "Agregar Platillo"}</h3>

            <div className="gm-form">

              <div className="gm-form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={platoActual.nombre_platillo}
                  onChange={(e) =>
                    setPlatoActual({ ...platoActual, nombre_platillo: e.target.value })
                  }
                />
              </div>

              <div className="gm-form-group">
                <label>Descripción:</label>
                <textarea
                  value={platoActual.descripcion}
                  onChange={(e) =>
                    setPlatoActual({ ...platoActual, descripcion: e.target.value })
                  }
                />
              </div>

              <div className="gm-form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  value={platoActual.precio}
                  onChange={(e) =>
                    setPlatoActual({ ...platoActual, precio: e.target.value })
                  }
                />
              </div>

              <div className="gm-form-group">
                <label>Imagen:</label>
                <input type="file" accept="image/*" onChange={manejarImagen} />
              </div>

              {platoActual.foto && (
                <img src={platoActual.foto} className="gm-preview" alt="preview" />
              )}

              <div className="gm-modal-actions">
                <button className="gm-btn-cancel" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>

                <button className="gm-btn-save" onClick={manejarSubmit}>
                  {modoEdicion ? "Guardar Cambios" : "Agregar"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default GestionMenu;
