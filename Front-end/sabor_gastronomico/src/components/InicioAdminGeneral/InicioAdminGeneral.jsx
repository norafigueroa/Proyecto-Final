import React from 'react';
import "./InicioAdminGeneral.css";

function InicioAdminGeneral() {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh', borderLeft: '5px solid #007bff' }}>
      <h1>👑 Dashboard: Administración General</h1>
      <p>Bienvenido, **Admin General**. Este es tu centro de control para toda la plataforma. Tus responsabilidades incluyen:</p>
      <ul>
        <li>Aprobación y gestión de **Restaurantes**.</li>
        <li>Gestión de **Usuarios** (Clientes, Admins de Restaurante).</li>
        <li>Administración de **Contenido** (Categorías, Cultura, Turismo).</li>
      </ul>
      {/* Aquí irán los componentes reales de gestión */}
    </div>
  );
}

export default InicioAdminGeneral;