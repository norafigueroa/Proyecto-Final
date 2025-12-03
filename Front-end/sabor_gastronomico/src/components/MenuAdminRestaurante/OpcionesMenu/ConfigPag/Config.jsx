import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Config.css";
import {getRestauranteById , patchRestaurante} from "../../../../../src/services/ServicesRestaurantes"

function Config() {
  const [restaurante, setRestaurante] = useState({
    nombre_restaurante: "",
    descripcion: "",
    historia_negocio: "",
    direccion: "",
    telefono: "",
    sitio_web: "",
    email: "",
    logo: null, 
    foto_portada: null, 
  });

  const [datosOriginales, setDatosOriginales] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewPortada, setPreviewPortada] = useState(null); // Nuevo estado para la portada
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const { id } = useParams();
  console.log(id);
  

  //Cargar configuración del backend 
  useEffect(() => {
    async function cargarConfig() {
      try {
        setCargando(true);
        setMensajeError(null);
        console.log("Cargando configuración del restaurante...");
        const res = await getRestauranteById(id);
        console.log(res);
        
        console.log("Datos recibidos:", res);

        setRestaurante(res);
        setDatosOriginales(res);

        // Inicializar vistas previas con las URLs del backend
        if (res.logo) {
          setPreviewLogo(res.logo);
        }
        if (res.foto_portada) { // Corregido: Inicializar previewPortada
          setPreviewPortada(res.foto_portada);
        }

      } catch (err) {
        console.error("❌ Error cargando config:", err);
        setMensajeError("Error al cargar los datos del restaurante.");
      } finally {
        setCargando(false);
      }
    }

    cargarConfig();
  }, []);


  // --- Manejo de cambios de inputs de texto ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // --- Manejo de cambios de Logo ---
  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setRestaurante((prev) => ({
      ...prev,
      logo: file, // Guarda el objeto File
    }));

    // Muestra la vista previa
    setPreviewLogo(URL.createObjectURL(file));
  };


  // --- Manejo de cambios de Foto de Portada (Nuevo) ---
  const handlePortadaChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setRestaurante((prev) => ({
      ...prev,
      foto_portada: file, // Guarda el objeto File
    }));

    // Muestra la vista previa
    setPreviewPortada(URL.createObjectURL(file));
  };


  // --- Guardar cambios ---
  const guardarCambios = async () => {
    setGuardando(true);
    setMensajeError(null);
    setMensajeExito(null);

    try {
      console.log("Guardando datos:", restaurante);

      // Crear FormData para enviar archivos y texto juntos
          //const formData = new FormData();

      /* for (const [key, value] of Object.entries(restaurante)) {
        // Excluir el campo 'email' si no es editable, o verificar si el valor es null/""
        if (key === 'email') continue;
      */
        // Si el valor es una URL o string, no es un File. 
        // Solo enviamos si es un File, o si es un campo de texto (string).
        // Si el campo de imagen fue actualizado, 'logo' será un objeto File.
        /* if (value instanceof File) {
            formData.append(key, value);
        } else if (value !== null && value !== undefined) {
             // Envía los campos de texto
             formData.append(key, value);
        }
      }
      console.log(formData); */
      
      const res = await patchRestaurante(id, restaurante);

      console.log("Config actualizada:", res);

      // Sincronizar el estado con la respuesta del backend (contiene las nuevas URLs)
      setDatosOriginales(res);
      setRestaurante(res);
      setPreviewLogo(res.logo); // Asegura que se muestre la nueva URL
      setPreviewPortada(res.foto_portada); // Asegura que se muestre la nueva URL

      setMensajeExito("Configuración actualizada correctamente.");
      
    } catch (err) {
      console.error("Error guardando:", err);
      // Asumir que el backend devuelve un objeto de error legible
      const errorMsg = err.response?.message || "Error al guardar cambios. Revisa los datos.";
      setMensajeError(errorMsg);
    } finally {
      setGuardando(false);
      // Limpiar mensajes después de un tiempo
      setTimeout(() => {
          setMensajeExito(null);
          setMensajeError(null);
      }, 5000);
    }
  };

  if (cargando) return <p>Cargando configuración...</p>;

  // --- Renderizado del Componente ---
  return (
    <div className="config-container">
      <h1 className="config-title">Ajustes del Restaurante</h1>

      {mensajeError && <div className="config-message error">{mensajeError}</div>}
      {mensajeExito && <div className="config-message success">{mensajeExito}</div>}

      <div className="config-section">
        <h2>Información General</h2>

        <div className="config-form">
          {/* Nombre */}
          <div className="config-group">
            <label className="config-label">Nombre del Restaurante</label>
            <input
              className="config-input"
              name="nombre_restaurante"
              value={restaurante.nombre_restaurante || ""}
              onChange={handleChange}
            />
            
          </div>

          {/* Descripción */}
          <div className="config-group">
            <label className="config-label">Descripción</label>
            <textarea
              className="config-textarea"
              name="descripcion"
              value={restaurante.descripcion || ""}
              onChange={handleChange}
            />
          </div>

          {/* Historia */}
          <div className="config-group">
            <label className="config-label">Historia del Negocio</label>
            <textarea
              className="config-textarea"
              name="historia_negocio"
              value={restaurante.historia_negocio || ""}
              onChange={handleChange}
            />
          </div>

          {/* Dirección */}
          <div className="config-group">
            <label className="config-label">Dirección</label>
            <input
              className="config-input"
              name="direccion"
              value={restaurante.direccion || ""}
              onChange={handleChange}
            />
          </div>

          {/* Teléfono */}
          <div className="config-group">
            <label className="config-label">Teléfono</label>
            <input
              className="config-input"
              name="telefono"
              value={restaurante.telefono || ""}
              onChange={handleChange}
            />
          </div>

          {/* Sitio Web */}
          <div className="config-group">
            <label className="config-label">Sitio Web</label>
            <input
              className="config-input"
              name="sitio_web"
              value={restaurante.sitio_web || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email (No editable) */}
          <div className="config-group">
            <label className="config-label">Email (no editable)</label>
            <input
              className="config-input-disabled"
              value={restaurante.email || "—"}
              disabled
            />
          </div>

          {/* Logo */}
          <div className="config-group">
            <label className="config-label">Logo</label>
            <input type="file" accept="image/*" onChange={handleLogoChange} />

            {previewLogo && (
              <img src={previewLogo} className="config-logo-preview" alt="Vista previa del logo" />
            )}
          </div>

          {/* Foto de Portada (Corregido: Incluido) */}
          <div className="config-group">
            <label className="config-label">Foto de Portada</label>
            <input type="file" accept="image/*" onChange={handlePortadaChange} />

            {previewPortada && (
              <img src={previewPortada} className="config-portada-preview" alt="Vista previa de portada" />
            )}
          </div>

          <button
            className="config-btn"
            onClick={guardarCambios}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Config;