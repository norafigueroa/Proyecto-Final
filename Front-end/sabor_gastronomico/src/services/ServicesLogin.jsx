const API_URL_LOGIN = 'http://127.0.0.1:8000/api/token/';

async function postLogin(credentials) {
    try {
        const response = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            let errorDetail = 'Error desconocido al iniciar sesión.';
            try {
                const errorData = await response.json();
                errorDetail = JSON.stringify(errorData);
            } catch (e) {
                errorDetail = await response.text();
            }
            throw new Error(`Respuesta del servidor (${response.status}): ${errorDetail}`);
        }

        return await response.json(); // Devuelve los tokens JWT

    } catch (error) {
        console.error("Existe un error al iniciar sesión:", error);
        throw error;
    }
}

export { postLogin };
