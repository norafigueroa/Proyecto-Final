// src/services/platillosService.js
async function getPlatillos() {
  try {
    const response = await fetch("http://localhost:8000/api/platillos/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const platillos = await response.json();
    return platillos;
  } catch (error) {
    console.error("Error al obtener los platillos", error);
    throw error;
  }
}

export default { getPlatillos };