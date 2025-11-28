import React, { useEffect, useState } from "react";
import "./Config.css";
import ConfigService from "../../../../services/servicesAdminRest/ServicesConfig";

function Config() {
  const [restaurante, setRestaurante] = useState({
    nombre_restaurante: "",
    descripcion: "",
    historia_negocio: "",
    direccion: "",
    telefono: "",
    sitio_web: "",
    email: "",
    horario_apertura: "",
    horario_cierre: "",
    dias_operacion: "",
    logo: null,
    foto_portada: "",
  });

  const [datosOriginales, setDatosOriginales] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

 
  // Cargar configuración del backend

  useEffect(() => {
    async function cargarConfig() {
      try {
        console.log("🔵 Cargando configuración del restaurante...");
        const res = await ConfigService.obtenerConfig();

        console.log("🔵 Datos recibidos:", res.data);

        setRestaurante(res.data);
        setDatosOriginales(res.data);

        if (res.data.logo) {
          setPreviewLogo(res.data.logo);
        }

      } catch (err) {
        console.error("❌ Error cargando config:", err);
      } finally {
        setCargando(false);
      }
    }

    cargarConfig();
  }, []);


  //Manejo de cambios de inputs

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  //Cambiar logo

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setRestaurante((prev) => ({
      ...prev,
      logo: file,
    }));

    setPreviewLogo(URL.createObjectURL(file));
  };


  //Guardar cambios

  const guardarCambios = async () => {
    try {
      setGuardando(true);

      console.log("Guardando datos:", restaurante);

      const formData = new FormData();

      for (const [key, value] of Object.entries(restaurante)) {
        formData.append(key, value);
      }

      const res = await ConfigService.actualizarConfig(formData);

      console.log("Config actualizada:", res.data);

      alert("Configuración actualizada correctamente");

      setDatosOriginales(res.data);
      setRestaurante(res.data);

    } catch (err) {
      console.error("❌ Error guardando:", err);
      alert("Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando configuración...</p>;

  return (
    <div className="config-container">
      <h1 className="config-title">Ajustes del Restaurante</h1>

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

          {/* Email */}
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
              <img src={previewLogo} className="config-logo-preview" />
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

      <div className="config-summary-box">
        <h2 className="config-summary-title">Vista previa</h2>
        <div className="config-summary">
          <p><strong>Nombre:</strong> {restaurante.nombre_restaurante}</p>
          <p><strong>Teléfono:</strong> {restaurante.telefono}</p>
          <p><strong>Dirección:</strong> {restaurante.direccion}</p>
        </div>
      </div>
    </div>
  );
}

export default Config;
