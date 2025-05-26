let selectedKey = null;

// Capturamos la tecla presionada en el input
const keyInput = document.getElementById("keyDisplay");
keyInput.addEventListener("keydown", function(e) {
  e.preventDefault(); // Evita comportamiento por defecto
  selectedKey = e.key;  // Guarda la tecla presionada
  // Muestra la tecla en el input
  keyInput.value = selectedKey;
});

// También, para permitir que el usuario pueda hacer clic en el input y luego presionar la tecla,
// habilitamos el enfoque (aunque sea readonly, se puede hacer focus)
keyInput.addEventListener("click", function() {
  keyInput.focus();
});

// Cuando el usuario hace clic en "Confirmar Tecla"
document.getElementById("confirmKeyBtn").addEventListener("click", async function() {
  if (selectedKey !== null) {
    // Guarda la tecla seleccionada en la base de datos usando votingdataSet
    // Se asume que votingdataSet está definida en tu código y realiza una petición a tu API
    await votingdataSet("Method", "key");
    await votingdataSet("unlockKey", selectedKey);
    document.location.href='Votaciones.html'
  } else {
    Swal.fire({
        icon: "error",
        title: "No podemos hacer eso...",
        text: "¡No seleccionaste ninguna tecla!",
      });
  }
});

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