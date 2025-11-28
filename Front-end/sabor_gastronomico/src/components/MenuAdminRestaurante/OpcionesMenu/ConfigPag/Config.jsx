import React, { useEffect, useState } from "react";
import "./Config.css";
import ConfigService from "../../../../services/servicesAdminRest/ServicesConfig";

function Config() {
  const [restaurante, setRestaurante] = useState({
    horario_apertura: "",
    horario_cierre: "",
    dias_operacion: "",
    logo: null,
    foto_portada: "",
    });


  const [previewLogo, setPreviewLogo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);


  useEffect(() => {
    async function cargarConfig() {
      try {
        const res = await ConfigService.obtenerConfig();
          setRestaurante(res.data);


        if (res.data.logo) setPreviewLogo(res.data.logo);
      } catch (err) {
        console.error("❌ Error cargando config:", err);
      } finally {
        setCargando(false);
      }
    }


    cargarConfig();
  }, []);


    const handleChange = (e) => {
      setRestaurante({ ...restaurante, [e.target.name]: e.target.value });
    };


    const handleLogoChange = (e) => {
      const file = e.target.files[0];
      setRestaurante({ ...restaurante, logo: file });
      setPreviewLogo(URL.createObjectURL(file));
    };


    const guardarCambios = async () => {
      setGuardando(true);


      try {
        const formData = new FormData();
        for (const [key, value] of Object.entries(restaurante)) {
          formData.append(key, value);
        }


        await ConfigService.actualizarConfig(formData);
        alert("Configuración actualizada correctamente");
      } catch (err) {
        console.error("Error guardando:", err);
        alert("Error al guardar");
      } finally {
        setGuardando(false);
      }
    };


    if (cargando) return <p>Cargando configuración...</p>;
    
  return (
    <div>
      <div className="config-container">
        <h1 className="config-title">Ajustes del Restaurante</h1>

        <div className="config-section">
          <h2>Información General</h2>

          <div className="config-form">

            <div className="config-group">
              <label className="config-label">Nombre del Restaurante</label>
              <input
                className="config-input"
                name="nombre_restaurante"
                value={restaurante.nombre_restaurante}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Descripción</label>
              <textarea
                className="config-textarea"
                name="descripcion"
                value={restaurante.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Historia del Negocio</label>
              <textarea
                className="config-textarea"
                name="historia_negocio"
                value={restaurante.historia_negocio}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Dirección</label>
              <input
                className="config-input"
                name="direccion"
                value={restaurante.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Teléfono</label>
              <input
                className="config-input"
                name="telefono"
                value={restaurante.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Sitio Web</label>
              <input
                className="config-input"
                name="sitio_web"
                value={restaurante.sitio_web}
                onChange={handleChange}
              />
            </div>

            <div className="config-group">
              <label className="config-label">Email (no editable)</label>
              <input
                className="config-input-disabled"
                value={restaurante.email || "—"}
                disabled
              />
            </div>

            <div className="config-group">
              <label className="config-label">Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />

              {previewLogo && (
                <img src={previewLogo} className="config-logo-preview" />
              )}
            </div>

            <button className="config-btn" onClick={guardarCambios} disabled={guardando}>
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
    </div>          
  );
}

export default Config;
