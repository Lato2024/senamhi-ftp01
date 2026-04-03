const express = require("express");
const ftpClient = require("basic-ftp");

const app = express();
const PORT = process.env.PORT || 10000;

// Ruta principal (para verificar que el servidor está activo)
app.get("/", (req, res) => {
  res.send("Servidor activo OK");
});

// Ruta para enviar datos al FTP
app.get("/upload", async (req, res) => {
  try {
    const data = req.query.data;

    if (!data) {
      return res.send("Error: falta parametro data");
    }

    // Crear cliente FTP
    const ftp = new ftpClient.Client();
    ftp.ftp.verbose = true;

    // 🔧 Configuración clave
    ftp.ftp.useEPSV = false; // ayuda en servidores restrictivos

    // Conexión al FTP
    await ftp.access({
      host: "ftp-datos.senamhi.gob.pe",
      user: "ftp_sutron",
      password: "Senamhi123",
      secure: false // cambiar a true si SENAMHI usa FTPS
    });

    // Crear archivo temporal
    const fileName = "datos.txt";
    const contenido = data + "\n";

    const { Readable } = require("stream");
    const stream = Readable.from([contenido]);

    // Subir archivo
    await ftp.uploadFrom(stream, fileName);

    // Cerrar conexión
    ftp.close();

    res.send("Datos enviados al FTP correctamente");
  } catch (error) {
    console.error(error);
    res.send("Error: " + error.message);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
