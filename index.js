const express = require("express");
const ftp = require("basic-ftp");

const app = express();

// Acepta texto y JSON
app.use(express.text());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor activo OK");
});

// Ruta para enviar a FTP
app.post("/upload", async (req, res) => {
  const client = new ftp.Client();

  try {
    let contenido;

    // Detecta si viene de webhook o Apps Script
    if (typeof req.body === "string") {
      contenido = req.body;
    } else if (req.body.data) {
      contenido = req.body.data;
    } else {
      throw new Error("Formato inválido");
    }

    // Nombre archivo tipo SENAMHI
    const now = new Date();
    const fileName =
      "EDWIN_" +
      now.toISOString().replace(/[-:]/g, "").slice(0, 13) +
      ".txt";

    // Conexión FTP
    await client.access({
      host: "ftp-datos.senamhi.gob.pe",
      user: "ftp_sutron",
      password: "Senamhi123",
      secure: false
    });

    // Subir archivo
   app.get('/upload', async (req, res) => {
  try {
    const data = req.query.data;

    if (!data) {
      return res.send("Falta parámetro data");
    }

    const ftp = new ftpClient();
    await ftp.access({
      host: "ftp-datos.senamhi.gob.pe",
      user: "ftp_sutron",
      password: "Senamhi123"
    });

    const fileName = `EDWIN_${Date.now()}.txt`;

    await ftp.uploadFrom(Buffer.from(data), fileName);

    ftp.close();

    res.send("Archivo enviado al FTP correctamente ✅");

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
