import React from 'react'
import LogoTiki from "../../../../assets/LogoTiki.jpg";
import "./Inicio.css";

function Inicio() {
  const fechaHora = new Date().toLocaleString("es-CR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // --- HORARIO DEL RESTAURANTE ---
  const horarios = {
    0: ["09:30", "23:00"], // Domingo
    1: ["11:00", "23:00"], // Lunes
    2: ["11:00", "23:00"], // Martes
    3: ["11:00", "23:00"], // Miércoles
    4: ["11:00", "23:00"], // Jueves
    5: ["11:00", "23:59"], // Viernes (hasta medianoche)
    6: ["09:30", "23:59"], // Sábado
  };

  const verificarEstado = () => {
    const ahora = new Date();
    const dia = ahora.getDay();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    const [inicio, fin] = horarios[dia];

    const [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    const inicioMin = hInicio * 60 + mInicio;
    const finMin = hFin * 60 + mFin;

    return horaActual >= inicioMin && horaActual <= finMin ? "Abierto" : "Cerrado";
  };

  const estadoActual = verificarEstado();

  return (
    <div>
      <div className='Inicio-container'>
        <div className='Inicio-logo-wrapper'>
          <img src= {LogoTiki} alt="Logo del Restaurante" className='Inicio-logo'/>
        </div>

        <h2 className='Inicio-titulo'>Bienvenido, Administrador</h2>
        <p className='Inicio-fecha'> {fechaHora} </p>

        <div className='Inicio-resumen'>
          <h3>Resumen del Restaurante</h3>

          <p> 
            <strong> Estado: </strong> {" "}
            <span className={estadoActual === "Abierto" ? "estado-abierto" : "estado-cerrado"}> {estadoActual} </span>
          </p>

          <p> <strong> Horario de hoy: </strong></p>

          <ul className="Inicio-horario-list">
            <li>Lun - Jue: 11:00 AM - 11:00 PM</li>
            <li>Viernes: 11:00 AM - 12:00 AM</li>
            <li>Sábado: 9:30 AM - 12:00 AM</li>
            <li>Domingo: 9:30 AM - 11:00 PM</li>
          </ul>
        </div>
        
      </div>
    </div>
  )
}

export default Inicio
