const express = require("express"); // Importa Express
const axios = require("axios"); // Importa Axios para manejar solicitudes HTTP
const bodyParser = require("body-parser"); // Permite procesar datos JSON en el cuerpo de las solicitudes
const cors = require("cors"); // Permite el acceso desde otros dominios (CORS)

const app = express(); // Crea la aplicación de Express

// Middleware para registrar cada solicitud recibida
app.use((req, res, next) => {
  console.log(`[DEBUG] Método: ${req.method}, URL: ${req.url}`);
  next(); // Continúa con el siguiente middleware o ruta
});

const PORT = 3000; // Define el puerto en el que correrá el servidor

// Middleware
app.use(bodyParser.json()); // Configura el servidor para manejar JSON
app.use(cors()); // Habilita CORS

// URL del servicio externo
const AGENDA_URL = "http://www.raydelto.org/agenda.php";

// Endpoint para listar contactos
app.get("/contactos", async (req, res) => {
    try {
      const response = await axios.get("http://www.raydelto.org/agenda.php");
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error al listar contactos:", error.message);
      res.status(500).json({ error: "Error al obtener los contactos" });
    }
  });
  

// Endpoint para almacenar un nuevo contacto
app.post("/contactos", async (req, res) => {
  const nuevoContacto = req.body; // Captura los datos enviados en el cuerpo de la solicitud

  // Verifica que los campos requeridos estén presentes
  if (!nuevoContacto.nombre || !nuevoContacto.telefono || !nuevoContacto.email) {
    return res.status(400).json({
      error: "Debe proporcionar los campos 'nombre', 'telefono' y 'email'",
    });
  }

  try {
    // Envía los datos del contacto al servicio externo
    await axios.post(AGENDA_URL, nuevoContacto);
    res.status(201).json({ mensaje: "Contacto almacenado exitosamente" });
  } catch (error) {
    console.error("Error al almacenar contacto:", error.message);
    res.status(500).json({ error: "Error al guardar el contacto" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
