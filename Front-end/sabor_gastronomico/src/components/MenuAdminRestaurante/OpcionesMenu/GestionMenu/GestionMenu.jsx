import React, { useState, useEffect } from "react";
import "./GestionMenu.css";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
    porcentaje: 0, 
  });

  const [precioFinal, setPrecioFinal] = useState(0); 

  useEffect(() => {
    cargarCategorias();
    cargarPlatos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await MenuService.obtenerCategorias();
      
      // Manejar diferentes estructuras de respuesta
      let categoriasData = [];
      
      if (res.data.results) {
        // Si la respuesta es paginada
        categoriasData = res.data.results;
      } else if (Array.isArray(res.data)) {
        // Si la respuesta es un array directo
        categoriasData = res.data;
      }
      
      console.log("Categorías cargadas:", categoriasData);
      setCategorias(categoriasData);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setCategorias([]);
    }
  };

    const cargarPlatos = async () => {
    try {
      // Obtener TODOS los platillos
      const res = await MenuService.obtenerPlatillos();
      console.log(res.data.results);
      
      
      // Manejar diferentes estructuras de respuesta
      let platillosData = [];
      
      if (res.data.results) {
        // Si la respuesta es paginada
        platillosData = res.data.results;
      } else if (Array.isArray(res.data)) {
        // Si la respuesta es un array directo
        platillosData = res.data;
      }
      
      // Filtrar por restaurante en el frontend
      const platosFiltrados = platillosData.filter(
        p => p.restaurante === restauranteId || p.restaurante_id === restauranteId
      );
      
      console.log("Platillos cargados:", platosFiltrados);
      console.log("RestauranteId buscado:", restauranteId);
      console.log("Todos los platillos:", platillosData);
      setPlatos(platosFiltrados); 
    } catch (err) {
      console.error("Error cargando platillos:", err);
      setPlatos([]); 
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
      porcentaje: 0, 
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
      porcentaje: plato.porcentaje ?? 0, 
    });

    setPrecioFinal(
      plato.precio - (plato.precio * (plato.porcentaje ?? 0)) / 100
    ); 

    setModalAbierto(true);
  };

  const manejarImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", "el_sabor_de_la_perla");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data.secure_url) {
        setPlatoActual({
          ...platoActual,
          foto: data.secure_url
        });

        /* console.log("📸 Imagen subida:", data.secure_url); */

        // Alerta de éxito
        Swal.fire({
          icon: "success",
          title: "Imagen subida correctamente",
          text: "La imagen se ha cargado exitosamente.",
          timer: 1500,
          showConfirmButton: false
        });

      } else {
        Swal.fire({
          icon: "error",
          title: "Error al subir la imagen",
          text: "Cloudinary no devolvió la URL de la imagen.",
        });
      }

    } catch (error) {
      console.error("Error subiendo imagen:", error);

      Swal.fire({
        icon: "error",
        title: "Error al subir la imagen",
        text: "Hubo un problema con la carga. Intenta nuevamente.",
      });
    }
  };


  const manejarSubmit = async (e) => {
  e.preventDefault();

  // Extraer valores
  const nombre = platoActual.nombre_platillo.trim();
  const descripcion = platoActual.descripcion.trim();
  const precio = Number(platoActual.precio);
  const categoria = platoActual.categoria_menu;
  const descuento = Number(platoActual.porcentaje);
  const imagen = platoActual.foto;

  // -------- VALIDACIONES --------

  if (!nombre) {
    Swal.fire("Campo faltante", "Debes ingresar un nombre para el platillo.", "warning");
    return;
  }

  if (!descripcion) {
    Swal.fire("Campo faltante", "Debes ingresar una descripción.", "warning");
    return;
  }

  if (!precio || precio <= 0) {
    Swal.fire("Precio inválido", "Debes ingresar un precio mayor a 0.", "warning");
    return;
  }

  if (!categoria || categoria === "") {
    Swal.fire("Campo faltante", "Debes seleccionar una categoría.", "warning");
    return;
  }

  // Imagen obligatoria solo al agregar
  if (!modoEdicion && !imagen) {
    Swal.fire("Imagen requerida", "Debes subir una imagen del platillo.", "warning");
    return;
  }

  //Descuento válido SOLO si se ingresa (opcional)
  if (descuento !== 0 && (descuento < 0 || descuento > 100)) {
    Swal.fire("Descuento inválido", "El porcentaje debe estar entre 0 y 100.", "warning");
    return;
  }

  // -------- ENVIAR AL BACKEND --------

  const formData = new FormData();
  formData.append("restaurante", Number(restauranteId));
  formData.append("categoria_menu", Number(categoria));
  formData.append("nombre_platillo", nombre);
  formData.append("descripcion", descripcion);
  formData.append("precio", precio);
  formData.append("promocion", descuento > 0);
  formData.append("porcentaje", descuento);

  if (imagen) {
    formData.append("foto", imagen);
  }

  try {
    if (modoEdicion) {
      await MenuService.actualizarPlatillo(platoActual.id, formData);

      Swal.fire({
        icon: "success",
        title: "Platillo actualizado",
        timer: 1500,
        showConfirmButton: false
      });

    } else {
      await MenuService.crearPlatillo(formData);

      Swal.fire({
        icon: "success",
        title: "Platillo agregado",
        timer: 1500,
        showConfirmButton: false
      });
    }

    cargarPlatos();
    setModalAbierto(false);

  } catch (err) {
    console.error("Error guardando:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo guardar el platillo."
    });
  }
};


  const eliminarPlato = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar platillo?",
      text: "Estás seguro de que deseas eliminar este platillo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
      await MenuService.eliminarPlatillo(id);

      Swal.fire({
        icon: "success",
        title: "Platillo eliminado",
        timer: 1500,
        showConfirmButton: false
      });

      cargarPlatos();
    } catch (err) {
      console.error("Error eliminando:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el platillo."
      });
    }
  };

  console.log(platos);
  

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
              {p.porcentaje > 0 && (
                <span className="gm-badge-descuento">-{p.porcentaje}%</span> // <-- AGREGADO
              )}

              {p.foto && (
                <img 
                  src={
                    p.foto.includes("https://")
                      ? p.foto.split("https://")[1] 
                          ? "https://" + p.foto.split("https://")[1]
                          : p.foto
                      : p.foto
                  }
                  className="gm-card-img"
                  alt="imagen del plato"
                />
              )}

              <h3 className="gm-card-title">{p.nombre_platillo}</h3>
              <p className="gm-card-desc">{p.descripcion}</p>

              {/* PRECIO MOSTRADO CON DESCUENTO */}
              <p className="gm-card-price">
                ₡{p.precio}{" "}
                {p.porcentaje > 0 && (
                  <span className="gm-descuento-etiqueta">-{p.porcentaje}%</span>
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
                    setPrecioFinal(precio - (precio * platoActual.porcentaje) / 100); 
                  }}
                />
              </div>

              {/* DESCUENTO */}
              <div className="gm-form-group">
                <label>Descuento (%):</label>
                <input
                  type="number"
                  placeholder="Ingrese descuento"
                  value={platoActual.porcentaje ?? ""}
                  onChange={(e) => {
                    const d = e.target.value === "" ? null : Number(e.target.value);
                    setPlatoActual({ ...platoActual, porcentaje: d });

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
                  {categorias && categorias.map((c) => (
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