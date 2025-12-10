import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from '../../../../services/ServicesAdminGeneral/ServicesConfiguracion';
import './ConfiguracionGeneral.css';

function ConfiguracionGeneral() {
  const [configuracion, setConfiguracion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('general');
  const [cargandoLogo, setCargandoLogo] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre_plataforma: '',
    logo: '',
    correo_contacto: '',
    telefono_contacto: '',
    direccion_general: '',
    horarios_atencion: '',
    mision: '',
    vision: '',
    valores: '',
    url_facebook: '',
    url_instagram: '',
    url_twitter: '',
    url_tiktok: '',
    url_youtube: '',
    url_whatsapp: '',
  });

  const [formularioOriginal, setFormularioOriginal] = useState({...formulario});

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setCargando(true);
      const data = await obtenerConfiguracion();
      
      // La API devuelve un array o un objeto
      const config = Array.isArray(data) ? data[0] : data;
      
      if (config) {
        setConfiguracion(config);
        const nuevoFormulario = {
          nombre_plataforma: config.nombre_plataforma || '',
          logo: config.logo || '',
          correo_contacto: config.correo_contacto || '',
          telefono_contacto: config.telefono_contacto || '',
          direccion_general: config.direccion_general || '',
          horarios_atencion: config.horarios_atencion || '',
          mision: config.mision || '',
          vision: config.vision || '',
          valores: config.valores || '',
          url_facebook: config.url_facebook || '',
          url_instagram: config.url_instagram || '',
          url_twitter: config.url_twitter || '',
          url_tiktok: config.url_tiktok || '',
          url_youtube: config.url_youtube || '',
          url_whatsapp: config.url_whatsapp || '',
        };
        setFormulario(nuevoFormulario);
        setFormularioOriginal({...nuevoFormulario});
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      Swal.fire('Error', 'No se pudo cargar la configuración', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubirLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCargandoLogo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'el_sabor_de_la_perla');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dujs1kx4w/image/upload',
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      
      if (data.secure_url) {
        setFormulario({ ...formulario, logo: data.secure_url });
        Swal.fire('Éxito', 'Logo subido correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al subir logo:', error);
      Swal.fire('Error', 'No se pudo subir el logo', 'error');
    } finally {
      setCargandoLogo(false);
    }
  };

  const handleEditarClick = () => {
    setModoEdicion(true);
  };

  const validarURL = (url) => {
    if (!url) return true; // URLs vacías son válidas
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleGuardar = async () => {
    // Validaciones básicas
    if (!formulario.nombre_plataforma) {
      Swal.fire('Error', 'El nombre de la plataforma es obligatorio', 'error');
      return;
    }

    if (!formulario.correo_contacto) {
      Swal.fire('Error', 'El correo de contacto es obligatorio', 'error');
      return;
    }

    if (formulario.correo_contacto && !formulario.correo_contacto.includes('@')) {
      Swal.fire('Error', 'El correo de contacto no es válido', 'error');
      return;
    }

    // Validar URLs de redes sociales
    const urlsARedes = {
      url_facebook: 'Facebook',
      url_instagram: 'Instagram',
      url_twitter: 'Twitter',
      url_tiktok: 'TikTok',
      url_youtube: 'YouTube',
      url_whatsapp: 'WhatsApp',
    };

    for (const [campo, nombre] of Object.entries(urlsARedes)) {
      if (formulario[campo] && !validarURL(formulario[campo])) {
        Swal.fire('Error', `La URL de ${nombre} no es válida`, 'error');
        return;
      }
    }

    try {
      setGuardando(true);
      
      // Actualizar la configuración
      await actualizarConfiguracion(formulario);
      
      await Swal.fire(
        'Éxito',
        'Configuración guardada correctamente',
        'success'
      );
      
      setFormularioOriginal({...formulario});
      setModoEdicion(false);
      cargarConfiguracion();
    } catch (error) {
      console.error('Error al guardar:', error);
      Swal.fire('Error', 'No se pudo guardar la configuración', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleRestaurar = async () => {
    const resultado = await Swal.fire({
      title: '¿Descartar cambios?',
      text: 'Se perderán todos los cambios realizados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      setFormulario({...formularioOriginal});
      setModoEdicion(false);
      Swal.fire('Cancelado', 'Los cambios han sido descartados', 'info');
    }
  };

  const secciones = [
    { id: 'general', nombre: 'General', icono: '📋' },
    { id: 'institucional', nombre: 'Institucional', icono: '🏛️' },
    { id: 'redes', nombre: 'Redes Sociales', icono: '🌐' },
  ];

  if (cargando) {
    return <div className="cg-cargando-unico">Cargando configuración...</div>;
  }

  return (
    <div className="cg-contenedor-principal-unico">
      <div className="cg-seccion-titulo-boton-unico">
        <h2 className="cg-titulo-unico">Configuración de la Plataforma</h2>
      </div>

      {/* Tabs de secciones */}
      <div className="cg-tabs-container-unico">
        {secciones.map((seccion) => (
          <button
            key={seccion.id}
            className={`cg-tab-btn-unico ${
              seccionActiva === seccion.id ? 'activo' : ''
            }`}
            onClick={() => setSeccionActiva(seccion.id)}
          >
            <span className="cg-tab-icono-unico">{seccion.icono}</span>
            {seccion.nombre}
          </button>
        ))}
      </div>

      {/* Contenido de las secciones */}
      <div className="cg-contenido-seccion-unico">
        {/* SECCIÓN GENERAL */}
        {seccionActiva === 'general' && (
          <div className="cg-seccion-unico">
            <div className="cg-header-seccion-editar">
              <h3 className="cg-subtitulo-unico">Información General</h3>
              {!modoEdicion && (
                <button
                  className="cg-btn-editar-subtitulo"
                  onClick={handleEditarClick}
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Nombre de la Plataforma *</label>
              {modoEdicion ? (
                <input
                  type="text"
                  name="nombre_plataforma"
                  value={formulario.nombre_plataforma}
                  onChange={handleCambioFormulario}
                  placeholder="Ej: El Sabor de la Perla del Pacífico"
                />
              ) : (
                <div className="cg-valor-lectura">{formulario.nombre_plataforma}</div>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Logo de la Plataforma</label>
              {formulario.logo && (
                <div className="cg-logo-preview-unico">
                  <img src={formulario.logo} alt="Logo" />
                </div>
              )}
              {modoEdicion && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubirLogo}
                    disabled={cargandoLogo}
                    className="cg-input-file-unico"
                  />
                  {cargandoLogo && (
                    <small style={{ color: '#1a4d6d' }}>Subiendo logo...</small>
                  )}
                </>
              )}
            </div>

            <div className="cg-form-fila-unico">
              <div className="cg-form-grupo-unico">
                <label>Correo de Contacto *</label>
                {modoEdicion ? (
                  <input
                    type="email"
                    name="correo_contacto"
                    value={formulario.correo_contacto}
                    onChange={handleCambioFormulario}
                    placeholder="contacto@plataforma.com"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.correo_contacto}</div>
                )}
              </div>

              <div className="cg-form-grupo-unico">
                <label>Teléfono de Contacto</label>
                {modoEdicion ? (
                  <input
                    type="tel"
                    name="telefono_contacto"
                    value={formulario.telefono_contacto}
                    onChange={handleCambioFormulario}
                    placeholder="+506 1234-5678"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.telefono_contacto}</div>
                )}
              </div>
            </div>

            <div className="cg-form-grupo-unico">
              <label>Dirección General</label>
              {modoEdicion ? (
                <input
                  type="text"
                  name="direccion_general"
                  value={formulario.direccion_general}
                  onChange={handleCambioFormulario}
                  placeholder="Dirección física de la organización"
                />
              ) : (
                <div className="cg-valor-lectura">{formulario.direccion_general}</div>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Horarios de Atención</label>
              {modoEdicion ? (
                <input
                  type="text"
                  name="horarios_atencion"
                  value={formulario.horarios_atencion}
                  onChange={handleCambioFormulario}
                  placeholder="Ej: Lunes a Viernes 9:00 AM - 5:00 PM"
                />
              ) : (
                <div className="cg-valor-lectura">{formulario.horarios_atencion}</div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN INSTITUCIONAL */}
        {seccionActiva === 'institucional' && (
          <div className="cg-seccion-unico">
            <div className="cg-header-seccion-editar">
              <h3 className="cg-subtitulo-unico">Misión, Visión y Valores</h3>
              {!modoEdicion && (
                <button
                  className="cg-btn-editar-subtitulo"
                  onClick={handleEditarClick}
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Misión</label>
              {modoEdicion ? (
                <>
                  <textarea
                    name="mision"
                    value={formulario.mision}
                    onChange={handleCambioFormulario}
                    placeholder="Describe la misión de la organización..."
                    rows="4"
                  />
                  <small className="cg-helper-text-unico">
                    La razón de ser de la organización
                  </small>
                </>
              ) : (
                <div className="cg-valor-lectura cg-valor-textarea">{formulario.mision}</div>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Visión</label>
              {modoEdicion ? (
                <>
                  <textarea
                    name="vision"
                    value={formulario.vision}
                    onChange={handleCambioFormulario}
                    placeholder="Describe la visión a futuro..."
                    rows="4"
                  />
                  <small className="cg-helper-text-unico">
                    Hacia dónde se dirige la organización
                  </small>
                </>
              ) : (
                <div className="cg-valor-lectura cg-valor-textarea">{formulario.vision}</div>
              )}
            </div>

            <div className="cg-form-grupo-unico">
              <label>Valores</label>
              {modoEdicion ? (
                <>
                  <textarea
                    name="valores"
                    value={formulario.valores}
                    onChange={handleCambioFormulario}
                    placeholder="Lista los valores fundamentales..."
                    rows="4"
                  />
                  <small className="cg-helper-text-unico">
                    Principios que guían las acciones de la organización
                  </small>
                </>
              ) : (
                <div className="cg-valor-lectura cg-valor-textarea">{formulario.valores}</div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN REDES SOCIALES */}
        {seccionActiva === 'redes' && (
          <div className="cg-seccion-unico">
            <div className="cg-header-seccion-editar">
              <h3 className="cg-subtitulo-unico">Enlaces a Redes Sociales</h3>
              {!modoEdicion && (
                <button
                  className="cg-btn-editar-subtitulo"
                  onClick={handleEditarClick}
                >
                  ✏️ Editar
                </button>
              )}
            </div>
            {modoEdicion && (
              <p className="cg-descripcion-seccion-unico">
                Agrega los enlaces a las redes sociales de la plataforma. Deja
                vacío si no aplica.
              </p>
            )}

            <div className="cg-form-fila-unico">
              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">📘</span> Facebook
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_facebook"
                    value={formulario.url_facebook}
                    onChange={handleCambioFormulario}
                    placeholder="https://facebook.com/tupagina"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_facebook || 'No configurado'}</div>
                )}
              </div>

              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">📸</span> Instagram
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_instagram"
                    value={formulario.url_instagram}
                    onChange={handleCambioFormulario}
                    placeholder="https://instagram.com/tuperfil"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_instagram || 'No configurado'}</div>
                )}
              </div>
            </div>

            <div className="cg-form-fila-unico">
              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">🐦</span> Twitter (X)
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_twitter"
                    value={formulario.url_twitter}
                    onChange={handleCambioFormulario}
                    placeholder="https://twitter.com/tuperfil"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_twitter || 'No configurado'}</div>
                )}
              </div>

              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">🎵</span> TikTok
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_tiktok"
                    value={formulario.url_tiktok}
                    onChange={handleCambioFormulario}
                    placeholder="https://tiktok.com/@tuperfil"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_tiktok || 'No configurado'}</div>
                )}
              </div>
            </div>

            <div className="cg-form-fila-unico">
              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">📺</span> YouTube
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_youtube"
                    value={formulario.url_youtube}
                    onChange={handleCambioFormulario}
                    placeholder="https://youtube.com/@tucanal"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_youtube || 'No configurado'}</div>
                )}
              </div>

              <div className="cg-form-grupo-unico">
                <label>
                  <span className="cg-icono-red-unico">💬</span> WhatsApp
                </label>
                {modoEdicion ? (
                  <input
                    type="url"
                    name="url_whatsapp"
                    value={formulario.url_whatsapp}
                    onChange={handleCambioFormulario}
                    placeholder="https://wa.me/50612345678"
                  />
                ) : (
                  <div className="cg-valor-lectura">{formulario.url_whatsapp || 'No configurado'}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con botones */}
      {modoEdicion && (
        <div className="cg-footer-botones-unico">
          <button
            className="cg-btn-cancelar-unico"
            onClick={handleRestaurar}
            disabled={guardando}
          >
            Descartar Cambios
          </button>
          <button
            className="cg-btn-guardar-unico"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionGeneral;