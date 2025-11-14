import React, { useState } from "react";
import "./GaleriaComunitaria.css";

import Letras from "../../assets/LetrasGaleria.jpg";
import Anfiteatro from "../../assets/AnfiteatroGaleria.jpg";
import Faro from "../../assets/FaroGaleria.jpg";

function GaleriaComunitaria() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galeria, setGaleria] = useState([
    { url: Letras },
    { url: Anfiteatro },
    { url: Faro },
  ]);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url_foto: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarFoto = () => {
    if (!formData.url_foto.trim()) return alert("Debes agregar la URL de la foto");

    setGaleria([...galeria, { ...formData }]);
    setFormData({ titulo: "", descripcion: "", url_foto: "" });
    closeModal();
  };

  return (
    <div>
        <div className="galeria-container">
            <h1 className="galeria-title"> Galería Comunitaria de <span>Puntarenas</span></h1>

            <p className="galeria-description">
                Un espacio donde la comunidad comparte sus fotografías favoritas de Puntarenas.
            </p>

            <div className="galeria-grid">
                {galeria.map((item, index) => (

                <div key={index} className="galeria-item">
                    <img src={item.url} alt={`foto-${index}`} />
                    {item.titulo && <h4>{item.titulo}</h4>}
                    {item.descripcion && <p>{item.descripcion}</p>}
                </div>
                ))}
            </div>

            <div className="btn-container">
                <button className="galeria-btn" onClick={openModal}>Subir Foto</button>
            </div>

            {/* ========== MODAL ========== */}
            {isModalOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Subir Foto</h2>

                    <form className="modal-form">
                        <input type="text" name="titulo" placeholder="Título" />
                        <textarea name="descripcion" placeholder="Descripción" />
                        <input type="text" name="url_foto" placeholder="URL de la foto" />
                    </form>

                    <div className="modal-buttons">
                        <button className="btn-save">Guardar</button>
                        <button className="btn-cancel">Cancelar</button>
                    </div>
                </div>
            </div>
            )}
        </div>
    </div>
  );
}

export default GaleriaComunitaria;
