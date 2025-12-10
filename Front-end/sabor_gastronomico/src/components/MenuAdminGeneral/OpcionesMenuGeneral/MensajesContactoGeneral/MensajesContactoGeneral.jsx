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
  const [filtro, setFiltro] = useState('todos');

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

  const handleEliminarMensaje = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar mensaje?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (resultado.isConfirmed) {
      try {
        await eliminarMensaje(id);
        setMensajes(mensajes.filter((m) => m.id !== id));
        setMensajeSeleccionado(null);
        Swal.fire('Eliminado', 'El mensaje ha sido eliminado', 'success');
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el mensaje', 'error');
      }
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const detalle = await obtenerMensajeDetalle(id);
      setMensajeSeleccionado(detalle);
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

    if (filtro === 'todos') return coincideBusqueda;
    return coincideBusqueda;
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
        <div className="mcg-estadisticas">
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
                  <div className="mcg-col-acciones">
                    <button
                      className="mcg-btn-ver"
                      onClick={() => handleVerDetalle(mensaje.id)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    <button
                      className="mcg-btn-eliminar"
                      onClick={() => handleEliminarMensaje(mensaje.id)}
                      title="Eliminar"
                    >
                      🗑️
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
                  className="mcg-btn-eliminar-detalles"
                  onClick={() => handleEliminarMensaje(mensajeSeleccionado.id)}
                >
                  🗑️ Eliminar
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