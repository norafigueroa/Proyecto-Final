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
    latitud: "",
    longitud: "", 
    url_facebook: "",
    url_instagram: "",
    url_twitter: "",
    url_tiktok: "",
    url_youtube: "",
    url_whatsapp: "",
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

  //SUBIR LOGO A CLOUDINARY
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "el_sabor_de_la_perla");

    const res = await fetch("https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      setRestaurante((prev) => ({
        ...prev,
        logo: data.secure_url,   // Guardamos la URL FINAL
      }));

      setPreviewLogo(data.secure_url); // Vista previa correcta
    }
  };

  const handleEliminarLogo = () => {
    setPreviewLogo(null);
    console.log(previewLogo);
    

    setRestaurante((prev) => ({
      ...prev,
      logo: null
    }));

    console.log(restaurante.logo);
    

    const input = document.getElementById("logoInput");
    if (input) input.value = "";
  };

  // --- Guardar cambios ---
  const guardarCambios = async () => {
    setGuardando(true);
    setMensajeError(null);
    setMensajeExito(null);

    try {
      console.log("Guardando datos:", restaurante);
      
      const res = await patchRestaurante(id, {
        ...restaurante,
        logo: restaurante.logo === null ? null : restaurante.logo || datosOriginales.logo,
        foto_portada: restaurante.foto_portada || datosOriginales.foto_portada,
      });


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

          {/* Email (No editable) */}
          <div className="config-group">
            <label className="config-label">Email (no editable)</label>
            <input
              className="config-input-disabled"
              value={restaurante.email || "—"}
              disabled
            />
          </div>

          {/* Longitud */}
          <div className="config-group">
            <label className="config-label">Longitud</label>
            <input
              type="number"
              step="any"
              className="config-input"
              name="longitud"
              value={restaurante.longitud || ""}
              onChange={handleChange}
            />
          </div>

          {/* Latitud */}
          <div className="config-group">
            <label className="config-label">Latitud</label>
            <input
              type="number"
              step="any"
              className="config-input"
              name="latitud"
              value={restaurante.latitud || ""}
              onChange={handleChange}
            />
          </div>

          {/* Redes sociales */}
          <h3 style={{ marginTop: "20px" }}>Redes Sociales</h3>

          <div className="config-group">
            <label className="config-label">Facebook</label>
            <input
              type="text"
              className="config-input"
              name="url_facebook"
              value={restaurante.url_facebook || ""}
              onChange={handleChange}
              placeholder="https://facebook.com/tu_pagina"
            />
          </div>

          <div className="config-group">
            <label className="config-label">Instagram</label>
            <input
              type="text"
              className="config-input"
              name="url_instagram"
              value={restaurante.url_instagram || ""}
              onChange={handleChange}
              placeholder="https://instagram.com/tu_pagina"
            />
          </div>

          <div className="config-group">
            <label className="config-label">Twitter</label>
            <input
              type="text"
              className="config-input"
              name="url_twitter"
              value={restaurante.url_twitter || ""}
              onChange={handleChange}
              placeholder="https://twitter.com/tu_pagina"
            />
          </div>

          <div className="config-group">
            <label className="config-label">TikTok</label>
            <input
              type="text"
              className="config-input"
              name="url_tiktok"
              value={restaurante.url_tiktok || ""}
              onChange={handleChange}
              placeholder="https://tiktok.com/@tu_pagina"
            />
          </div>

          <div className="config-group">
            <label className="config-label">YouTube</label>
            <input
              type="text"
              className="config-input"
              name="url_youtube"
              value={restaurante.url_youtube || ""}
              onChange={handleChange}
              placeholder="https://youtube.com/tu_canal"
            />
          </div>

          <div className="config-group">
            <label className="config-label">WhatsApp</label>
            <input
              type="text"
              className="config-input"
              name="url_whatsapp"
              value={restaurante.url_whatsapp || ""}
              onChange={handleChange}
              placeholder="Ej: +50688887777"
            />
          </div>

          {/* Logo */}
          <div className="config-group">
            <label className="config-label">Logo</label>

            {/* INPUT oculto */}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              id="logoInput"
              style={{ display: "none" }}
            />

            {/* PREVIEW */}
            {previewLogo && (
              <img
                src={
                  previewLogo.includes("https://")
                    ? "https://" + previewLogo.split("https://")[1]
                    : previewLogo
                }
                className="config-logo-preview"
                alt="Vista previa del logo"
              />
            )}
          </div>

          {/* BOTONES */}
          <div className="config-buttons">
            <button
              type="button"
              className="btn-editar"
              onClick={() => document.getElementById("logoInput").click()}
            >
              ✏️ 
            </button>

            {previewLogo && (
              <button
                type="button"
                className="btn-eliminar"
                onClick={handleEliminarLogo}
              >
                🗑️ 
              </button>
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