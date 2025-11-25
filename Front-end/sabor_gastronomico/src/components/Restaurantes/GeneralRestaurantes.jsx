import React, { useEffect, useState } from "react";
import "./GeneralRestaurantes.css";
import { useNavigate } from "react-router-dom";

function GeneralRestaurantes() {
  const [restaurantes, setRestaurantes] = useState([]);
  const navigate = useNavigate();

  // 🟢 Función para determinar si está abierto o cerrado
  const estaAbierto = (apertura, cierre) => {
    if (!apertura || !cierre) return "Horario no disponible";

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    // Convertimos a minutos totales para comparar correctamente
    const [h1, m1] = apertura.split(":").map(Number);
    const [h2, m2] = cierre.split(":").map(Number);

    const inicio = h1 * 60 + m1;
    const fin = h2 * 60 + m2;
    const ahoraMin = horaActual * 60 + minutoActual;

    // Caso normal (ej: 09:00 a 18:00)
    if (inicio < fin) {
      return ahoraMin >= inicio && ahoraMin <= fin ? "Abierto" : "Cerrado";
    }

    // Caso horario nocturno (ej: 18:00 a 02:00)
    if (inicio > fin) {
      return ahoraMin >= inicio || ahoraMin <= fin ? "Abierto" : "Cerrado";
    }

    return "Cerrado";
  };

  useEffect(() => {
    const cargarRestaurantes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/restaurantes/");
        const data = await response.json();
        setRestaurantes(data.results);
        console.log("API devuelve:", data);
      } catch (error) {
        console.error("Error cargando restaurantes:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRestaurantes();
  }, []);


  return (
    <div className="restaurantes-contenedor">
      {restaurantes.length === 0 ? (
        <p>No hay restaurantes registrados.</p>
      ) : (
        restaurantes.map((rest) => {
          const estado = estaAbierto(rest.horario_apertura, rest.horario_cierre);

          return (
            <div
              key={rest.id}
              className="restaurante-card"
              onClick={() => navigate(`/restaurante/${rest.id}`)}
            >
              <img
                src={rest.foto_portada || "/default.jpg"}
                alt={rest.nombre_restaurante}
              />

              <h3>{rest.nombre_restaurante}</h3>

              <p><strong>Categoría:</strong> {rest.categoria?.nombre_categoria || "Sin categoría"}</p>

              <p><strong>Descripción:</strong> {rest.descripcion || "Sin descripción"}</p>

              <p>
                <strong>Estado:</strong>{" "}
                <span className={estado === "Abierto" ? "estado-abierto" : "estado-cerrado"}>
                  {estado}
                </span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GeneralRestaurantes;
