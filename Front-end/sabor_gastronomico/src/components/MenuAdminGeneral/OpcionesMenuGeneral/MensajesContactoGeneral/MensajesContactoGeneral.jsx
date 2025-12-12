import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  obtenerMensajes,
  obtenerMensajeDetalle,
  eliminarMensaje,
} from '../../../../services/ServicesAdminGeneral/ServicesContacto';
import './MensajesContactoGeneral.css';

function MensajesContactoGeneral() {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscador, setBuscador] = useState('');
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('no-archivados');
  const [filtroLectura, setFiltroLectura] = useState('todos');

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      setCargando(true);
      const data = await obtenerMensajes();
      setMensajes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      Swal.fire('Error', 'No se pudieron cargar los mensajes', 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleArchivarMensaje = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Archivar mensaje?',
      text: 'Puedes recuperarlo desde la sección de archivados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarMensaje(id);
        setMensajes(mensajes.map((m) =>
          m.id === id ? { ...m, archivado: true } : m
        ));
        setMensajeSeleccionado(null);
        Swal.fire('Archivado', 'El mensaje ha sido archivado', 'success');
      } catch (error) {
        console.error('Error al archivar:', error);
        Swal.fire('Error', 'No se pudo archivar el mensaje', 'error');
      }
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerMensajeDetalle(id);
      setMensajeSeleccionado(detalle);
      // Actualizar el estado local del mensaje a leído
      setMensajes(mensajes.map((m) =>
        m.id === id ? { ...m, leido: true } : m
      ));
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudo cargar el detalle', 'error');
    }
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const mensajesFiltrados = mensajes.filter((mensaje) => {
    const coincideBusqueda =
      mensaje.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
      mensaje.correo.toLowerCase().includes(buscador.toLowerCase()) ||
      mensaje.asunto.toLowerCase().includes(buscador.toLowerCase());

    let cumpleFiltroArchivo = true;
    if (filtro === 'no-archivados') {
      cumpleFiltroArchivo = !mensaje.archivado;
    } else if (filtro === 'archivados') {
      cumpleFiltroArchivo = mensaje.archivado;
    }

    let cumpleFiltroLectura = true;
    if (filtroLectura === 'leidos') {
      cumpleFiltroLectura = mensaje.leido;
    } else if (filtroLectura === 'pendientes') {
      cumpleFiltroLectura = !mensaje.leido;
    }

    return coincideBusqueda && cumpleFiltroArchivo && cumpleFiltroLectura;
  });

  if (cargando) {
    return <div className="mcg-cargando">Cargando mensajes...</div>;
  }

  return (
    <div className="mcg-contenedor-principal">
      <div className="mcg-header">
        <h2 className="mcg-titulo">📨 Mensajes de Contacto</h2>
        <p className="mcg-subtitulo">
          Gestiona los mensajes recibidos de los visitantes
        </p>
      </div>

      <div className="mcg-controles">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o asunto..."
          value={buscador}
          onChange={(e) => setBuscador(e.target.value)}
          className="mcg-buscador"
        />

        <div className="mcg-filtros">
          <div className="mcg-grupo-filtros">
            <label>Estado:</label>
            <button
              className={`mcg-btn-filtro ${filtro === 'no-archivados' ? 'activo' : ''}`}
              onClick={() => setFiltro('no-archivados')}
            >
              📬 No Archivados
            </button>
            <button
              className={`mcg-btn-filtro ${filtro === 'archivados' ? 'activo' : ''}`}
              onClick={() => setFiltro('archivados')}
            >
              📦 Archivados
            </button>
            <button
              className={`mcg-btn-filtro ${filtro === 'todos' ? 'activo' : ''}`}
              onClick={() => setFiltro('todos')}
            >
              📋 Todos
            </button>
          </div>

          <div className="mcg-grupo-filtros">
            <label>Lectura:</label>
            <button
              className={`mcg-btn-filtro ${filtroLectura === 'pendientes' ? 'activo' : ''}`}
              onClick={() => setFiltroLectura('pendientes')}
            >
              📪 Pendientes
            </button>
            <button
              className={`mcg-btn-filtro ${filtroLectura === 'leidos' ? 'activo' : ''}`}
              onClick={() => setFiltroLectura('leidos')}
            >
              ✓ Leídos
            </button>
            <button
              className={`mcg-btn-filtro ${filtroLectura === 'todos' ? 'activo' : ''}`}
              onClick={() => setFiltroLectura('todos')}
            >
              📋 Todos
            </button>
          </div>
        </div>

        <div className="mcg-estadisticas">
          <span className="mcg-stat">
            Mostrando: <strong>{mensajesFiltrados.length}</strong>
          </span>
          <span className="mcg-stat">
            Total: <strong>{mensajes.length}</strong>
          </span>
        </div>
      </div>

      <div className="mcg-contenedor-principal-flex">
        {/* LISTA DE MENSAJES */}
        <div className="mcg-lista-mensajes">
          {mensajesFiltrados.length === 0 ? (
            <div className="mcg-sin-mensajes">
              <p>📭 No hay mensajes disponibles</p>
            </div>
          ) : (
            <div className="mcg-tabla-mensajes">
              <div className="mcg-tabla-header">
                <div className="mcg-col-nombre">Nombre</div>
                <div className="mcg-col-asunto">Asunto</div>
                <div className="mcg-col-correo">Correo</div>
                <div className="mcg-col-fecha">Fecha</div>
                <div className="mcg-col-estado">Estado</div>
                <div className="mcg-col-lectura">Lectura</div>
                <div className="mcg-col-acciones">Acciones</div>
              </div>

              {mensajesFiltrados.map((mensaje) => (
                <div key={mensaje.id} className="mcg-tabla-fila">
                  <div className="mcg-col-nombre">{mensaje.nombre}</div>
                  <div className="mcg-col-asunto">{mensaje.asunto}</div>
                  <div className="mcg-col-correo">{mensaje.correo}</div>
                  <div className="mcg-col-fecha">
                    {formatearFecha(mensaje.fecha_envio)}
                  </div>
                  <div className="mcg-col-estado">
                    {mensaje.archivado ? (
                      <span className="mcg-badge-archivado">Archivado</span>
                    ) : (
                      <span className="mcg-badge-nuevo">Activo</span>
                    )}
                  </div>
                  <div className="mcg-col-lectura">
                    {mensaje.leido ? (
                      <span className="mcg-badge-leido">✓ Leído</span>
                    ) : (
                      <span className="mcg-badge-pendiente">📪 Pendiente</span>
                    )}
                  </div>
                  <div className="mcg-col-acciones">
                    <button
                      className="mcg-btn-ver"
                      onClick={() => handleVerDetalle(mensaje.id)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      className="mcg-btn-archivar"
                      onClick={() => handleArchivarMensaje(mensaje.id)}
                      title={mensaje.archivado ? 'Ya archivado' : 'Archivar'}
                      disabled={mensaje.archivado}
                    >
                      {mensaje.archivado ? '✓' : '📦'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL DE DETALLES */}
        {mensajeSeleccionado && (
          <div className="mcg-detalles-mensaje">
            <div className="mcg-detalles-header">
              <h3>Detalle del Mensaje</h3>
              <button
                className="mcg-btn-cerrar-detalles"
                onClick={() => setMensajeSeleccionado(null)}
              >
                ✕
              </button>
            </div>

            <div className="mcg-detalles-contenido">
              {mensajeSeleccionado.archivado && (
                <div className="mcg-alerta-archivado">
                  ⚠️ Este mensaje está archivado
                </div>
              )}

              <div className="mcg-detalle-grupo">
                <label>Nombre:</label>
                <p>{mensajeSeleccionado.nombre}</p>
              </div>

              <div className="mcg-detalle-grupo">
                <label>Correo:</label>
                <p>
                  <a href={`mailto:${mensajeSeleccionado.correo}`}>
                    {mensajeSeleccionado.correo}
                  </a>
                </p>
              </div>

              {mensajeSeleccionado.telefono && (
                <div className="mcg-detalle-grupo">
                  <label>Teléfono:</label>
                  <p>{mensajeSeleccionado.telefono}</p>
                </div>
              )}

              <div className="mcg-detalle-grupo">
                <label>Asunto:</label>
                <p>{mensajeSeleccionado.asunto}</p>
              </div>

              <div className="mcg-detalle-grupo">
                <label>Fecha de Envío:</label>
                <p>{formatearFecha(mensajeSeleccionado.fecha_envio)}</p>
              </div>

              <div className="mcg-detalle-grupo mcg-detalle-mensaje">
                <label>Mensaje:</label>
                <div className="mcg-mensaje-texto">
                  {mensajeSeleccionado.mensaje}
                </div>
              </div>

              <div className="mcg-detalles-acciones">
                <button
                  className="mcg-btn-responder"
                  onClick={() => {
                    window.location.href = `mailto:${mensajeSeleccionado.correo}`;
                  }}
                >
                  ✉️ Responder
                </button>
                <button
                  className="mcg-btn-archivar-detalles"
                  onClick={() => handleArchivarMensaje(mensajeSeleccionado.id)}
                  disabled={mensajeSeleccionado.archivado}
                >
                  {mensajeSeleccionado.archivado ? '✓ Archivado' : '📦 Archivar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MensajesContactoGeneral;