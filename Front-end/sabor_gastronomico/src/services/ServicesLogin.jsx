const API_URL_LOGIN = 'http://127.0.0.1:8000/api/login/';

async function postLogin(credenciales) {
    try {
        const respuesta = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',  // ← CLAVE: Permite enviar/recibir cookies
            body: JSON.stringify(credenciales)
        });

        if (!respuesta.ok) {
            let detalleError = 'Error desconocido al iniciar sesión.';
            try {
                const datosError = await respuesta.json();
                detalleError = datosError.error || JSON.stringify(datosError);
            } catch (e) {
                detalleError = await respuesta.text();
            }
            throw new Error(`Error del servidor (${respuesta.status}): ${detalleError}`);
        }

        return await respuesta.json(); // Devuelve { message, user }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        throw error;
    }
}

async function postLogout() {
    try {
        const respuesta = await fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'POST',
            credentials: 'include',  // ← Envía las cookies para eliminarlas
        });

        if (!respuesta.ok) {
            throw new Error('Error al cerrar sesión');
        }

        // Limpiar localStorage
        localStorage.removeItem('usuario');

        return await respuesta.json();

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        throw error;
    }
}

export { postLogin, postLogout };