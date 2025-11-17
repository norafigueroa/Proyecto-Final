import React, { useState } from "react";
import "./GaleriaComunitaria.css";

import Letras from "../../assets/LetrasGaleria.jpg";
import Anfiteatro from "../../assets/AnfiteatroGaleria.jpg";
import Faro from "../../assets/FaroGaleria.jpg";

function GaleriaComunitaria() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galeria, setGaleria] = useState([
    { url: Letras, 
      titulo: "Letras de Puntarenas", 
      descripcion: "Las letras del malecón al atardecer." },

    { url: Anfiteatro, 
      titulo: "Anfiteatro", 
      descripcion: "Presentaciones culturales en el anfiteatro local." },

    { url: Faro, 
      titulo: "Faro", 
      descripcion: "El faro que guía la bahía." },
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarFoto = () => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.url_foto.trim()) return alert("Debes agregar la URL de la foto");

    const nuevoItem = {
      url: formData.url_foto,
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
    };

    setGaleria((prev) => [...prev, nuevoItem]);
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
                    <img src={item.url} alt={item.titulo || `foto-${index}`} />
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

                    <form className="modal-form" onSubmit={guardarFoto}>
                      <input type="text" name="titulo" placeholder="Título" value={formData.titulo} onChange={handleChange}/>
                      <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange}/>
                      <input type="text" name="url_foto" placeholder="URL de la foto" value={formData.url_foto} onChange={handleChange}/>


                      <div className="modal-buttons">
                        <button type="submit" className="btn-save"> Guardar </button>
                        <button type="button" className="btn-cancel" onClick={closeModal}> Cancelar </button>
                      </div>
                    </form>
                </div>
            </div>
            )}
        </div>
    </div>
  );
}

export default GaleriaComunitaria;
