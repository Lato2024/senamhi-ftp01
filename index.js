const express = require("express");
const ftpClient = require("basic-ftp");

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta principal (prueba)
app.get("/", (req, res) => {
  res.send("Servidor activo OK");
});

// Ruta GET (para probar desde navegador)
app.get("/upload", async (req, res) => {
  try {
    const data = req.query.data;

    if (!data) {
      return res.send("Falta parámetro data");
    }

    const ftp = new ftpClient.Client();
    ftp.ftp.verbose = true;

    await ftp.access({
      host: "ftp-datos.senamhi.gob.pe",
      user: "ftp_sutron",
      password: "Senamhi123",
      secure: false
    });

    const fileName = `EDWIN_${Date.now()}.txt`;

    await ftp.uploadFrom(Buffer.from(data), fileName);

    ftp.close();

    res.send("Archivo enviado al FTP correctamente ✅");

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Ruta POST (para Particle o curl)
app.use(express.text());

app.post("/upload", async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.send("No hay datos");
    }

    const ftp = new ftpClient.Client();
    ftp.ftp.verbose = true;

    await ftp.access({
      host: "ftp-datos.senamhi.gob.pe",
      user: "ftp_sutron",
      password: "Senamhi123",
      secure: false
    });

    const fileName = `EDWIN_${Date.now()}.txt`;

    await ftp.uploadFrom(Buffer.from(data), fileName);

    ftp.close();

    res.send("Archivo enviado al FTP correctamente ✅");

  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
