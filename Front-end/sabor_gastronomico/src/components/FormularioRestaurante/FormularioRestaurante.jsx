import React, { useState } from 'react';
import { postRestaurante } from "../../services/ServicesRestaurantes";

function FormularioRestaurante() {
  // Hooks para manejar el estado de los inputs
  const [nombre, setNombre] = useState('');
  const [propietarioId, setPropietarioId] = useState(''); 
  const [categoriaId, setCategoriaId] = useState(''); 
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [longitud, setLongitud] = useState('');
  const [latitud, setLatitud] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el envío del formulario
  const handleGuardarRestaurante = async (e) => {
    e.preventDefault(); 
    setMensaje('');

    // 1. Construir el objeto de datos
    const objRestaurante = {
      // Campos obligatorios y relaciones:
      usuario_propietario: parseInt(propietarioId), 
      categoria: categoriaId ? parseInt(categoriaId) : null, 
      nombre_restaurante: nombre,
      direccion: direccion,
      
      // Campos opcionales:
      telefono: telefono,
      email: email,
      longitud: longitud ? parseFloat(longitud) : null, 
      latitud: latitud ? parseFloat(latitud) : null,   
    };

    console.log('Objeto a enviar:', objRestaurante);

    try {
      // 2. Llamar al servicio
      const respuestaServidor = await postRestaurante(objRestaurante);
      
      console.log('Respuesta del Servidor:', respuestaServidor);
      setMensaje(`✅ Restaurante '${respuestaServidor.nombre_restaurante}' registrado con éxito! ID: ${respuestaServidor.id}`);
      
      // Limpiar el formulario
      setNombre(''); setPropietarioId(''); setCategoriaId('');
      setDireccion(''); setTelefono(''); setEmail('');
      setLongitud(''); setLatitud('');

    } catch (error) {
      // Capturar y mostrar errores de conexión o del backend
      console.error('Error al guardar el restaurante:', error);
      setMensaje(`❌ Error al registrar: ${error.message || 'Error de conexión'}. Revisa la consola.`);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Nuevo Restaurante</h2>
      {mensaje && <p style={{ color: mensaje.startsWith('❌') ? 'red' : 'green' }}>{mensaje}</p>}

      <form onSubmit={handleGuardarRestaurante}>
        {/* Propietario ID (FK) - OBLIGATORIO */}
        <div>
          <label htmlFor="propietarioId">ID del Propietario (Usuario):</label>
          <input 
            type="number" 
            id="propietarioId"
            value={propietarioId}
            onChange={(e) => setPropietarioId(e.target.value)}
            required
          />
        </div>

        {/* Categoría ID (FK) - OPCIONAL */}
        <div>
          <label htmlFor="categoriaId">ID de Categoría (Opcional):</label>
          <input 
            type="number" 
            id="categoriaId"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          />
        </div>

        {/* Nombre - OBLIGATORIO */}
        <div>
          <label htmlFor="nombre">Nombre del Restaurante:</label>
          <input 
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* Dirección - OBLIGATORIO */}
        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input 
            type="text" 
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        
        {/* Teléfono - OPCIONAL */}
        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input 
            type="tel" 
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {/* Email - OPCIONAL */}
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Longitud y Latitud - OPCIONAL */}
        <div>
          <label htmlFor="longitud">Longitud (Decimal):</label>
          <input 
            type="text"
            id="longitud"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="latitud">Latitud (Decimal):</label>
          <input 
            type="text" 
            id="latitud"
            value={latitud}
            onChange={(e) => setLatitud(e.target.value)}
          />
        </div>
        <br />
        
        <button type="submit">
          Registrar Restaurante
        </button>
      </form>
    </div>
  );
}

export default FormularioRestaurante;