import React from 'react'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./PagCultura.css";

// 🖼️ Importar imágenes
import capitaniaPuntarenas from "../../assets/capitaniaPuntarenas.jpg"
import MaleconAntiguo from "../../assets/MaleconAntiguo.png"
import FerrocarrilPacífico from "../../assets/FerrocarrilPacífico.webp"
import EstacionFerrocarril from "../../assets/EstacionFerrocarril.jpg"
import CarnavalesPuntarenas from "../../assets/CarnavalesPuntarenas.jpg"
import CarnavalesPuntarenas2 from "../../assets/CarnavalesPuntarenas2.jpg"
import Vigoron from "../../assets/Vigoron.jpg"
import Churchill from "../../assets/Churchill.png"
import Muelle from "../../assets/Muelle.jpg"
import Paseo from "../../assets/Paseo.webp"
import PaseoTuristas from "../../assets/PaseoTuristas.png"

// 📜 Datos estructurados
const seccionesCultura = [
  {
    titulo: "Orígenes",
    texto: `Puntarenas nació como un pequeño puerto natural a mediados del siglo XIX.
            Gracias a su ubicación estratégica en el Golfo de Nicoya, se convirtió en
            la principal salida marítima del país hacia el Pacífico. Desde entonces,
            fue un punto clave para el comercio del café costarricense hacia el mundo.`,
    imagenes: [
      { src: capitaniaPuntarenas, leyenda: "Antigua Capitanía de Puntarenas" },
    ],
  },
  {
    titulo: "Desarrollo y auge",
    texto: `Durante muchos años, Puntarenas fue el puerto más importante de Costa Rica.
            La llegada del ferrocarril al Pacífico impulsó su crecimiento, y el centro
            se llenó de actividad con barcos, hoteles y comercio local. Su malecón y
            playas comenzaron a atraer visitantes nacionales e internacionales.`,
    imagenes: [
      { src: FerrocarrilPacífico, leyenda: "Ferrocarril al Pacífico" },
      { src: MaleconAntiguo, leyenda: "Antiguo Malecón de Puntarenas" },
      { src: EstacionFerrocarril, leyenda: "Estación del Ferrocarril" },
    ],
  },
  {
    titulo: "Identidad cultural",
    texto: `Puntarenas destaca por su gente amable, su gastronomía costera —como el
            vigorón, el ceviche y la chucheca— y sus tradiciones marineras. Las
            festividades del Carnaval y el Paseo de los Turistas forman parte del alma
            cultural porteña.`,
    imagenes: [
      { src: CarnavalesPuntarenas, leyenda: "Carnaval de Puntarenas" },
      { src: CarnavalesPuntarenas2, leyenda: "Carnaval de Puntarenas" },
      { src: Vigoron, leyenda: "Vigorón" },
      { src: Churchill, leyenda: "Churchill" },
    ],
  },
  {
    titulo: "Puntarenas hoy",
    texto: `Hoy, el centro de Puntarenas combina historia, turismo y cultura. Sus
            calles, iglesias antiguas y el muelle turístico siguen siendo testigos del
            pasado glorioso de la “Perla del Pacífico”, un lugar que mantiene viva la
            esencia costera de Costa Rica.`,
    imagenes: [
      { src: PaseoTuristas, leyenda: "Paseo de los Turistas actual" },
      { src: Muelle, leyenda: "Muelle turístico de Puntarenas" },
      { src: Paseo, leyenda: "Faro de Puntarenas" },
    ],
  },
];

function PagCultura() {
  return (
    <div className="cultura-page">
      <header className="cultura-header">
        <h1 className="header-title">
          Historia de <span>Puntarenas Centro</span>
        </h1>
        <p>El corazón del Pacífico costarricense</p>
      </header>

      {/* 🔁 Render dinámico con map */}
      {seccionesCultura.map((seccion, index) => (
        <section key={index} className="cultura-section">
          <h2>{seccion.titulo}</h2>
          <p>{seccion.texto}</p>

          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            className="cultura-carousel"
          >
            {seccion.imagenes.map((img, i) => (
              <div key={i}>
                <img src={img.src} alt={img.leyenda} />
                <p className="legend">{img.leyenda}</p>
              </div>
            ))}
          </Carousel>
        </section>
      ))}

      <footer className="cultura-footer">
        <p>© 2025 Cultura Puntarenas | Historia y Tradición Costera</p>
      </footer>
    </div>
  );
}

export default PagCultura;