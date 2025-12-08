import React, { useState, useEffect } from "react";
import "./GestionMenu.css";
import { useParams } from "react-router-dom";
import MenuService from "../../../../services/servicesAdminRest/ServicesMenu";

function GestionMenu() {
  const { id } = useParams();
  const restauranteId = Number(id);

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
    foto: null,
    descuento: 0, 
  });

  const [precioFinal, setPrecioFinal] = useState(0); 

  useEffect(() => {
    cargarCategorias();
    cargarPlatos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await MenuService.obtenerCategorias();
      setCategorias(res.data.results);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const cargarPlatos = async () => {
    try {
      const res = await MenuService.obtenerPlatillos();
      setPlatos(res.data.results);
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
      foto: null,
      descuento: 0, 
    });
    setPrecioFinal(0); 
    setModalAbierto(true);
  };

  const abrirModalEditar = (plato) => {
    setModoEdicion(true);
    setPlatoActual({
      id: plato.id,
      nombre_platillo: plato.nombre_platillo,
      descripcion: plato.descripcion,
      precio: plato.precio,
      categoria_menu: plato.categoria_menu,
      foto: null,
      descuento: plato.descuento ?? 0, 
    });

    setPrecioFinal(
      plato.precio - (plato.precio * (plato.descuento ?? 0)) / 100
    ); 

    setModalAbierto(true);
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setPlatoActual({ ...platoActual, foto: archivo });
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const restId = Number(restauranteId);
    const categoriaId = Number(platoActual.categoria_menu);
    const precioNum = Number(platoActual.precio);
    const descuentoNum = Number(platoActual.descuento); 

    if (isNaN(precioNum) || precioNum <= 0) {
      console.error("Precio inválido");
      return;
    }

    const formData = new FormData();
    formData.append("restaurante", restId);
    formData.append("categoria_menu", categoriaId);
    formData.append("nombre_platillo", platoActual.nombre_platillo);
    formData.append("descripcion", platoActual.descripcion);
    formData.append("precio", precioNum);
    formData.append("promocion", platoActual.descuento > 0);
    formData.append("porcentaje", descuentoNum);

    if (platoActual.foto) {
      formData.append("foto", platoActual.foto);
    }

    try {
      if (modoEdicion) {
        await MenuService.actualizarPlatillo(platoActual.id, formData);
      } else {
        await MenuService.crearPlatillo(formData);
      }

      cargarPlatos();
      setModalAbierto(false);
    } catch (err) {
      console.error("Error guardando:", err.response?.data || err);
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

              {/* BADGE DE DESCUENTO */}
              {p.descuento > 0 && (
                <span className="gm-badge-descuento">-{p.descuento}%</span> // <-- AGREGADO
              )}

              {p.foto && (
                <img src={p.foto} className="gm-card-img" alt="imagen del plato" />
              )}

              <h3 className="gm-card-title">{p.nombre_platillo}</h3>
              <p className="gm-card-desc">{p.descripcion}</p>

              {/* PRECIO MOSTRADO CON DESCUENTO */}
              <p className="gm-card-price">
                ₡{p.precio}{" "}
                {p.descuento > 0 && (
                  <span className="gm-descuento-etiqueta">-{p.descuento}%</span>
                )}
              </p>


              <div className="gm-card-actions">
                <button className="gm-btn-edit" onClick={() => abrirModalEditar(p)}>
                  Editar
                </button>
                <button className="gm-btn-delete" onClick={() => eliminarPlato(p.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalAbierto && (
        <div className="gm-modal-overlay">
          <div className="gm-modal-content">

            <h3>{modoEdicion ? "Editar Platillo" : "Agregar Platillo"}</h3>

            <form className="gm-form" onSubmit={manejarSubmit}>

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
                ></textarea>
              </div>

              <div className="gm-form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  value={platoActual.precio}
                  onChange={(e) => {
                    const precio = Number(e.target.value);
                    setPlatoActual({ ...platoActual, precio });
                    setPrecioFinal(precio - (precio * platoActual.descuento) / 100); 
                  }}
                />
              </div>

              {/* DESCUENTO */}
              <div className="gm-form-group">
                <label>Descuento (%):</label>
                <input
                  type="number"
                  placeholder="Ingrese descuento"
                  value={platoActual.descuento ?? ""}
                  onChange={(e) => {
                    const d = e.target.value === "" ? null : Number(e.target.value);
                    setPlatoActual({ ...platoActual, descuento: d });

                    setPrecioFinal(
                      platoActual.precio - (platoActual.precio * (d || 0)) / 100
                    );
                  }}
                />
              </div>

              {/* PREVIEW DEL PRECIO FINAL */}
              <p className="precio-final-preview">
                Precio final: <strong>₡{precioFinal.toFixed(2)}</strong>
              </p>

              <div className="gm-form-group">
                <label>Categoría:</label>
                <select
                  value={platoActual.categoria_menu}
                  onChange={(e) =>
                    setPlatoActual({ ...platoActual, categoria_menu: e.target.value })
                  }
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className="gm-form-group">
                <label>Imagen:</label>
                <input type="file" accept="image/*" onChange={manejarImagen} />
              </div>

              <div className="gm-modal-actions">
                <button
                  type="button"
                  className="gm-btn-cancel"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="gm-btn-save">
                  {modoEdicion ? "Guardar Cambios" : "Agregar"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default GestionMenu;
