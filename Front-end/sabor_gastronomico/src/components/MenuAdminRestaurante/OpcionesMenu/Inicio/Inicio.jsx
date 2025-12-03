import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Inicio.css";
import { ServicesInicio } from "../../../../services/servicesAdminRest/ServicesInicio";


function Inicio() {
  const { id } = useParams(); // ID DEL RESTAURANTE
  const [loading, setLoading] = useState(true);

  // === ESTADOS DEL BACKEND ===
  const [restaurante, setRestaurante] = useState({
    horario_apertura: "",
    horario_cierre: "",
    dias_operacion: "",
    foto: "",
  });

  // === MODALES ===
  const [modalEditar, setModalEditar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalFoto, setModalFoto] = useState(false);

  // === ESTADOS TEMPORALES PARA EDITAR ===
  const [editData, setEditData] = useState({
    horario_apertura: "",
    horario_cierre: "",
    dias_operacion: "",
  });

  // === FOTO PREVIEW ===
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // === FECHA ===
  const fechaHora = new Date().toLocaleString("es-CR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ServicesInicio.obtenerRestaurante(id);
        console.log(res);
        
        setRestaurante(res.data);

        setEditData({
          horario_apertura: res.data.horario_apertura || "",
          horario_cierre: res.data.horario_cierre || "",
          dias_operacion: res.data.dias_operacion || "",
        });
      } catch (err) {
        console.error("Error cargando restaurante:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const verificarEstado = () => {
    if (!restaurante.horario_apertura || !restaurante.horario_cierre) return "Sin horario";

    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    const [hInicio, mInicio] = restaurante.horario_apertura.split(":");
    const [hFin, mFin] = restaurante.horario_cierre.split(":");

    const inicioMin = parseInt(hInicio) * 60 + parseInt(mInicio);
    const finMin = parseInt(hFin) * 60 + parseInt(mFin);

    return horaActual >= inicioMin && horaActual <= finMin ? "Abierto" : "Cerrado";
  };

  const estadoActual = verificarEstado();

  const guardarHorario = async () => {
    try {
      await ServicesInicio.actualizarRestaurante(id, editData);

      setRestaurante({
        ...restaurante,
        ...editData,
      });

      setModalEditar(false);
      setModalCrear(false);
    } catch (err) {
      console.error("Error guardando horario:", err);
    }
  };

  const subirFoto = async () => {
    if (!foto) return;

    const formData = new FormData();
    formData.append("url_foto", foto);
    formData.append("descripcion", "prueba");
    formData.append("restaurante", id);

    try {
      const res = await ServicesInicio.subirFoto(formData);
      setRestaurante((prev) => ({ ...prev, foto: res.data.url_foto }));

      setModalFoto(false);
    } catch (error) {
      console.error("Error subiendo foto:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div className="Inicio-container">

        {/* FOTO */}
        <div className="Inicio-logo-wrapper">
          <img
            src={previewFoto || restaurante.foto || "/no-image.png"}
            alt="Logo"
            className="Inicio-logo"
          />
          <button className="btn-cambiar-foto" onClick={() => setModalFoto(true)}>
            Cambiar Foto
          </button>
        </div>

        <h2 className="Inicio-titulo">Bienvenido, Administrador</h2>
        <p className="Inicio-fecha">{fechaHora}</p>

        {/* RESUMEN */}
        <div className="Inicio-resumen">
          <h3>Resumen del Restaurante</h3>

          <p>
            <strong>Estado: </strong>
            <span className={estadoActual === "Abierto" ? "estado-abierto" : "estado-cerrado"}>
              {estadoActual}
            </span>
          </p>

          <p><strong>Días de operación:</strong> {restaurante.dias_operacion || "No registrado"}</p>
          <p><strong>Horario:</strong> {restaurante.horario_apertura} - {restaurante.horario_cierre}</p>

          <div className="Inicio-botones">
            <button className="btn-editar" onClick={() => setModalEditar(true)}>Editar Horario</button>
            <button className="btn-crear" onClick={() => setModalCrear(true)}>Crear Horario</button>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Editar Horario</h3>

            <label>Días Operación</label>
            <input
              type="text"
              value={editData.dias_operacion}
              onChange={(e) => setEditData({ ...editData, dias_operacion: e.target.value })}
            />

            <label>Apertura</label>
            <input
              type="time"
              value={editData.horario_apertura}
              onChange={(e) => setEditData({ ...editData, horario_apertura: e.target.value })}
            />

            <label>Cierre</label>
            <input
              type="time"
              value={editData.horario_cierre}
              onChange={(e) => setEditData({ ...editData, horario_cierre: e.target.value })}
            />

            <button className="btn-guardar" onClick={guardarHorario}>Guardar</button>
            <button className="btn-cerrar" onClick={() => setModalEditar(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {modalCrear && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Crear Horario</h3>

            <label>Días Operación</label>
            <input
              type="text"
              placeholder="Ej: Lunes a Domingo"
              value={editData.dias_operacion}
              onChange={(e) => setEditData({ ...editData, dias_operacion: e.target.value })}
            />

            <label>Apertura</label>
            <input
              type="time"
              value={editData.horario_apertura}
              onChange={(e) => setEditData({ ...editData, horario_apertura: e.target.value })}
            />

            <label>Cierre</label>
            <input
              type="time"
              value={editData.horario_cierre}
              onChange={(e) => setEditData({ ...editData, horario_cierre: e.target.value })}
            />

            <button className="btn-guardar" onClick={guardarHorario}>Crear</button>
            <button className="btn-cerrar" onClick={() => setModalCrear(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* MODAL FOTO */}
      {modalFoto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Cambiar Foto</h3>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFoto(e.target.files[0]);
                setPreviewFoto(URL.createObjectURL(e.target.files[0]));
              }}
            />

            <button className="btn-guardar" onClick={subirFoto}>Guardar</button>
            <button className="btn-cerrar" onClick={() => setModalFoto(false)}>Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inicio;
