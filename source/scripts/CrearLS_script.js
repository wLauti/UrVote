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

async function initializeVotes() {
    try {
      const cantPartidosRaw = await votingdataGet("cantPartidos");
      const votoBlancoRaw   = await votingdataGet("votoBlanco");
  
      const numPartidos = Number(cantPartidosRaw) || 0;
  
      const votes = Object.fromEntries(
        Array.from({ length: numPartidos }, (_, i) => [`partido${i + 1}`, 0])
      );
  
      if (votoBlancoRaw) {
        votes["Blanco"] = 0;
      }
  
      await votingdataSet("votes", JSON.stringify(votes));
  
      window.location.href = "Seleccionar_Seguridad.html";
    } catch (error) {
      console.error("Error al inicializar los votos:", error);
    }
  }
  
  initializeVotes();
  