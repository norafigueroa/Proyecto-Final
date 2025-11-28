import React, { useState } from 'react';
import LogoTiki from "../../../../assets/LogoTiki.jpg";
import "./Inicio.css";

function Inicio() {

  // === FECHA ===
  const fechaHora = new Date().toLocaleString("es-CR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // === HORARIOS (Editable) ===
  const [horarios, setHorarios] = useState({
    0: ["09:30", "23:00"], // Domingo
    1: ["11:00", "23:00"], // Lunes
    2: ["11:00", "23:00"], // Martes
    3: ["11:00", "23:00"], // Miércoles
    4: ["11:00", "23:00"], // Jueves
    5: ["11:00", "23:59"], // Viernes
    6: ["09:30", "23:59"], // Sábado
  });

  // Estado de los modales
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  // Horarios temporales durante edición
  const [horariosEditando, setHorariosEditando] = useState({ ...horarios });

  // === CALCULAR ESTADO ACTUAL ===
  const verificarEstado = () => {
    const ahora = new Date();
    const dia = ahora.getDay();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    const [inicio, fin] = horarios[dia];
    const [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    const inicioMin = hInicio * 60 + mInicio;
    const finMin = hFin * 60 + mFin;

    return horaActual >= inicioMin && horaActual <= finMin
      ? "Abierto"
      : "Cerrado";
  };

  const estadoActual = verificarEstado();

  // === GUARDAR CAMBIOS ===
  const guardarCambios = () => {
    setHorarios(horariosEditando);
    setModalEditar(false);
  };

  // === ELIMINAR DATOS ===
  const eliminarDatos = () => {
    setHorarios({});
    setModalEliminar(false);
  };

  // === DÍAS PARA MOSTRAR EN EL MODAL ===
  const diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  return (
    <div>
      <div className='Inicio-container'>
        <div className='Inicio-logo-wrapper'>
          <img src={LogoTiki} alt="Logo del Restaurante" className='Inicio-logo' />
        </div>

        <h2 className='Inicio-titulo'>Bienvenido, Administrador</h2>
        <p className='Inicio-fecha'>{fechaHora}</p>

        <div className='Inicio-resumen'>
          <h3>Resumen del Restaurante</h3>

          <p>
            <strong>Estado: </strong>
            <span className={estadoActual === "Abierto" ? "estado-abierto" : "estado-cerrado"}>
              {estadoActual}
            </span>
          </p>

          <p><strong>Horario de hoy:</strong></p>

          <ul className="Inicio-horario-list">
            {Object.keys(horarios).length === 0 ? (
              <p style={{ color: "red" }}>Datos eliminados</p>
            ) : (
              diasSemana.map((dia, index) => (
                <li key={index}>
                  {dia}: {horarios[index][0]} - {horarios[index][1]}
                </li>
              ))
            )}
          </ul>

          {/* Botones de acciones */}
          <div className="Inicio-botones">
            <button className="btn-editar" onClick={() => setModalEditar(true)}>Editar información</button>
            <button className="btn-eliminar" onClick={() => setModalEliminar(true)}>Eliminar datos</button>
          </div>
        </div>
      </div>

      {/* === MODAL EDITAR === */}
      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>Editar Horarios</h3>

            {diasSemana.map((dia, i) => (
              <div key={i} className="modal-item">
                <label>{dia}</label>
                <input
                  type="time"
                  value={horariosEditando[i][0]}
                  onChange={(e) => {
                    const nuevo = { ...horariosEditando };
                    nuevo[i][0] = e.target.value;
                    setHorariosEditando(nuevo);
                  }}
                />
                <input
                  type="time"
                  value={horariosEditando[i][1]}
                  onChange={(e) => {
                    const nuevo = { ...horariosEditando };
                    nuevo[i][1] = e.target.value;
                    setHorariosEditando(nuevo);
                  }}
                />
              </div>
            ))}

            <div className="modal-buttons">
              <button className="btn-guardar" onClick={guardarCambios}>Guardar</button>
              <button className="btn-cerrar" onClick={() => setModalEditar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL ELIMINAR === */}
      {modalEliminar && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h3>¿Eliminar toda la información?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <button className="btn-eliminar" onClick={eliminarDatos}>Eliminar</button>
            <button className="btn-cerrar" onClick={() => setModalEliminar(false)}>Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inicio;
