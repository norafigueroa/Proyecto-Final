import React, { useRef, useEffect } from 'react';
import "./PagTurismo.css";

import PaseoTuris from "../../assets/PuntarenasCostaRica.jpg"
import SanLucas from "../../assets/SanLucas.png"
import PlayaDonaAna from "../../assets/PlayaDonaAna.webp"
import ParqueMarino from "../../assets/ParqueMarino.jpeg"
import Ferry from "../../assets/ferry.jpg"


function PagTurismo() {

    const carruselRef = useRef(null);

    const scrollIzquierda = () => {
        carruselRef.current.scrollBy({ left: -300, behavior: 'smooth' })};

    const scrollDerecha = () => {
        carruselRef.current.scrollBy({ left: 300, behavior: 'smooth' })};

    useEffect(() => {
        const intervalo = setInterval(() => {
            if (carruselRef.current) {
                carruselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                // Si llega al final, vuelve al inicio
                if (
                carruselRef.current.scrollLeft + carruselRef.current.offsetWidth >=
                carruselRef.current.scrollWidth
                ) {
                carruselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                }
            }
            }, 3000); // cada 3 segundos

            return () => clearInterval(intervalo);
        }, []);   

    const lugaresTuristicos = [
        {
            nombre: "Paseo de los Turistas",
            descripcion: "Un malecón icónico frente al mar con restaurantes, tiendas y espectaculares atardeceres.",
            imagen: PaseoTuris,
        },
        {
            nombre: "Isla San Lucas",
            descripcion: "Una isla histórica que fue prisión y hoy es un atractivo turístico con tours guiados y naturaleza.",
            imagen: SanLucas,
        },
        {
            nombre: "Playa Doña Ana",
            descripcion: "Playa tranquila ideal para nadar, tomar el sol y disfrutar de la costa pacífica.",
            imagen: PlayaDonaAna,
        },
        {
            nombre: "Parque Marino del Pacífico",
            descripcion: "Un espacio de conservación con actividades educativas, acuarios y tours de naturaleza.",
            imagen: ParqueMarino,
        },
        {
            nombre: "Ferry de Puntarenas",
            descripcion: "Viaje en ferry hacia la península de Nicoya, con vistas espectaculares del Golfo de Nicoya.",
            imagen: Ferry,
        },
        ];

  return (
    <div>
        <div className="turismo-page">
            <h1>
                Lugares Turísticos de <span>Puntarenas</span>
            </h1>
            <p>Explora los principales atractivos de la Perla del Pacífico Costarricense.</p>

            <div className="carrusel-container">
                <button className="btn-scroll" onClick={scrollIzquierda}>◀</button>

                <div className="carrusel" ref={carruselRef}>
                {lugaresTuristicos.map((lugar, index) => (
                    <div key={index} className="lugar-card">
                    <img src={lugar.imagen} alt={lugar.nombre} className="lugar-img"/>
                    <h2>{lugar.nombre}</h2>
                    <p>{lugar.descripcion}</p>
                    </div>
                ))}
                </div>

                <button className="btn-scroll" onClick={scrollDerecha}>▶</button>

            </div>
                {/* ====== FOOTER TURISMO ====== */}
                <footer className="footer-turismo">
                    <p>© 2025 Turismo Puntarenas | La Perla del Pacífico 🌅</p>
                </footer>
        </div>
    </div>
  )
}

export default PagTurismo
