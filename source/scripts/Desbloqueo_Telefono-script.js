document.addEventListener('DOMContentLoaded', async () => {
  try {
    const express = require('express');
    const os = require('os');
    const app = express();

    app.use(express.text());

    function getLocalIP() {
      const interfaces = os.networkInterfaces();
      for (const iface of Object.values(interfaces)) {
        for (const info of iface) {
          if (info.family === 'IPv4' && !info.internal) {
            return info.address;
          }
        }
      }
      return null;
    }

    const ipAddress = getLocalIP();
    if (!ipAddress) {
      console.error("No se pudo encontrar la IP local.");
      return;
    }

    console.log("Dirección IP obtenida:", ipAddress); // Log para depuración

    // Dividimos la IP en segmentos
    const ipSegments = ipAddress.split(".");
    
    if (ipSegments.length !== 4) {
      console.error("Formato de IP inesperado:", ipAddress);
      return;
    }

    const firstSegment = parseInt(ipSegments[0]); // Primer número de la IP
    const thirdSegment = parseInt(ipSegments[2]); // Tercer número de la IP

    console.log("Primer segmento:", firstSegment);
    console.log("Tercer segmento:", thirdSegment);

    let typeOfIP;
    if (firstSegment === 192 && ipSegments[1] === "168") {
      typeOfIP = "0";  // Red doméstica común
    } else if (firstSegment === 172 && (ipSegments[1] >= 16 && ipSegments[1] <= 31)) {
      typeOfIP = "1";  // Red privada tipo B
    } else if (firstSegment === 10) {
      typeOfIP = "2";  // Red privada tipo A
    } else {
      typeOfIP = "X";  // IP no reconocida
    }

    console.log("Tipo de IP asignado:", typeOfIP);

    const port = Math.floor(Math.random() * (9999 - 1024 + 1)) + 1024;
    const portStr = port.toString().padStart(4, '0');

    // Código de conexión corregido
    const connectionCode = `${typeOfIP}.112.${portStr}`;
    console.log("Código de conexión generado:", connectionCode);
    
    document.getElementById("puerto").textContent = connectionCode;

    // Función para guardar datos en votingdata
    async function votingdataGet(name) {
      try {
        const result = await window.electronAPI.getVotingData(name);
        return result.value;
      } catch (error) {
        console.error("Error al obtener votingdata:", error);
        return null;
      }
    }
    
    async function votingdataSet(name, value) {
      try {
        const result = await window.electronAPI.saveVotingData(name, value);
        return result; // Devuelve el resultado directamente desde ipcMain
      } catch (error) {
        console.error("Error al guardar votingdata:", error);
      }
    }
    
    async function savingdataGet(name) {
      try {
        const result = await window.electronAPI.getData(name);
        return result.value;
      } catch (error) {
        console.error("Error al obtener savingdata:", error);
        return null;
      }
    }
    
    async function savingdataSet(name, value) {
      try {
        const result = await window.electronAPI.saveData(name, value);
        return result; // Devuelve el resultado directamente desde ipcMain
      } catch (error) {
        console.error("Error al guardar savingdata:", error);
      }
    }

    // Guardar en votingdata antes de iniciar el servidor
    await votingdataSet("Method", "Device");
    await votingdataSet("Port", port);

    // Servidor para recibir el texto "Go"
    app.post('/device', async (req, res) => {
      if (req.body.trim() === "Go") {
        await votingdataSet("Method", "Device");
        await votingdataSet("Port", port);
        window.location.href = "Votaciones.html";
      }
      res.json({ message: "OK" });
    });

    // Iniciar el servidor en el puerto generado
    app.listen(port, "0.0.0.0", () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });

  } catch (error) {
    console.error("Error al iniciar el script:", error);
  }
});
