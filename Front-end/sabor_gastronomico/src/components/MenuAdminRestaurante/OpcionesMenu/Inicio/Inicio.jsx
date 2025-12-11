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

  const diasSemana = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo"
];


  const [horario, setHorario] = useState({
    lunes: { apertura: "", cierre: "", cerrado: false },
    martes: { apertura: "", cierre: "", cerrado: false },
    miercoles: { apertura: "", cierre: "", cerrado: false },
    jueves: { apertura: "", cierre: "", cerrado: false },
    viernes: { apertura: "", cierre: "", cerrado: false },
    sabado: { apertura: "", cierre: "", cerrado: false },
    domingo: { apertura: "", cierre: "", cerrado: false }
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

  // === FECHA ===
  const fechaHora = new Date().toLocaleString("es-CR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ServicesInicio.obtenerRestaurante(id);
        const horarioRes = await ServicesInicio.obtenerHorario(id);



        console.log(horarioRes.data.horario);
        console.log(res);
        
        const normalizarHorario = (raw) => {
          const limpio = {};

          diasSemana.forEach((dia) => {
            limpio[dia] = {
              apertura: raw[dia]?.apertura || "",
              cierre: raw[dia]?.cierre || "",
              cerrado: raw[dia]?.cerrado || false,
            };
          });

          return limpio;
        };

        setHorario(normalizarHorario(horarioRes.data.horario));

        console.log("HORARIO FINAL:", normalizarHorario(horarioRes.data.horario));
        setRestaurante(res.data);
      } catch (err) {
        console.error("Error cargando restaurante:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  console.log(horario);
  

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

  const toggleCerrado = (dia) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        cerrado: !prev[dia].cerrado,
        apertura: !prev[dia].cerrado ? "" : prev[dia].apertura,
        cierre: !prev[dia].cerrado ? "" : prev[dia].cierre
      }
    }));
  };

  const validarHoras = (apertura, cierre) => {
    if (!apertura || !cierre) return true;
    return apertura < cierre;
  };

  const guardarHorarios = async () => {

  
  // Validar horas
  /* for (const dia of diasSemana) {
    const { apertura, cierre, cerrado } = horario[dia];

    if (!cerrado && !validarHoras(apertura, cierre)) {
      alert(`La hora de cierre debe ser mayor a la de apertura en ${dia}`);
      return;
    }
  } */

  try {
    await ServicesInicio.actualizarHorario(id, { horario });

    setRestaurante({
      ...restaurante,
      ...editData,
    });

    setModalEditar(false);
    setModalCrear(false);
  } catch (err) {
    console.error("Error guardando horarios:", err);
  }
};

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div className="Inicio-container">

        <h2 className="Inicio-titulo">Bienvenido, Administrador</h2>
        <p className="Inicio-fecha">{fechaHora}</p>

        {/* RESUMEN */}
        <div className="Inicio-resumen">
          <h3>Resumen del Restaurante</h3>

          <h4>Horarios</h4>

          <p>
            <strong>Estado: </strong>
            <span className={estadoActual === "Abierto" ? "estado-abierto" : "estado-cerrado"}>
              {estadoActual}
            </span>
          </p>

          <div className="lista-horarios">
            {diasSemana.map((dia) => (
              <p key={dia}>
                <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong>{" "}
                {horario[dia].cerrado
                  ? "Cerrado"
                  : horario[dia].apertura && horario[dia].cierre
                    ? `${horario[dia].apertura} - ${horario[dia].cierre}`
                    : "Sin horario"}
              </p>
            ))}
          </div>

          <div className="Inicio-botones">
            <button className="btn-editar" onClick={() => setModalEditar(true)}>Editar Horario</button>
           {/*  <button className="btn-crear" onClick={() => setModalCrear(true)}>Crear Horario</button> */}
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Editar Horarios</h3>

            {diasSemana.map((dia) => (
              <div key={dia} className="grupo-dia">
                <label><strong>{dia.toUpperCase()}</strong></label>

                {/* BOTÓN PARA CERRAR/ABRIR EL DÍA */}
                <button
                  className="btn-cerrar-dia"
                  onClick={() => toggleCerrado(dia)}
                  style={{ marginBottom: "8px" }}
                >
                  {horario[dia].cerrado ? "Abrir este día" : "Cerrar este día"}
                </button>

                <label>Apertura</label>
                <input
                  type="time"
                  disabled={horario[dia].cerrado}
                  value={horario[dia].apertura}
                  onChange={(e) =>
                    setHorario({
                      ...horario,
                      [dia]: { ...horario[dia], apertura: e.target.value }
                    })
                  }
                />

                <label>Cierre</label>
                <input
                  type="time"
                  disabled={horario[dia].cerrado}
                  value={horario[dia].cierre}
                  onChange={(e) =>
                    setHorario({
                      ...horario,
                      [dia]: { ...horario[dia], cierre: e.target.value }
                    })
                  }
                />

                <hr />
              </div>
            ))}


            <button className="btn-guardar" onClick={guardarHorarios}>
              Guardar Cambios
            </button>
            <button className="btn-cerrar" onClick={() => setModalEditar(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {modalCrear && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Crear Horarios</h3>

            {diasSemana.map((dia) => (
              <div key={dia} className="grupo-dia">
                <label><strong>{dia.toUpperCase()}</strong></label>

                {/* BOTÓN PARA CERRAR/ABRIR EL DÍA */}
                <button
                  className="btn-cerrar-dia"
                  onClick={() => toggleCerrado(dia)}
                  style={{ marginBottom: "8px" }}
                >
                  {horario[dia].cerrado ? "Abrir este día" : "Cerrar este día"}
                </button>

                <label>Apertura</label>
                <input
                  type="time"
                  disabled={horario[dia].cerrado}
                  value={horario[dia].apertura}
                  onChange={(e) =>
                    setHorario({
                      ...horario,
                      [dia]: { ...horario[dia], apertura: e.target.value }
                    })
                  }
                />

                <label>Cierre</label>
                <input
                  type="time"
                  disabled={horario[dia].cerrado}
                  value={horario[dia].cierre}
                  onChange={(e) =>
                    setHorario({
                      ...horario,
                      [dia]: { ...horario[dia], cierre: e.target.value }
                    })
                  }
                />

                <hr />
              </div>
            ))}


            <button className="btn-guardar" onClick={guardarHorarios}>
              Crear Horarios
            </button>
            <button className="btn-cerrar" onClick={() => setModalCrear(false)}>
              Cancelar
            </button>
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
