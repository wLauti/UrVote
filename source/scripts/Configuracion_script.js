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

function volver() {
    window.location.href = "Menu.html";
}
// Funciones savingdataGet y savingdataSet deben estar definidas para interactuar con tu base de datos.
// Se asume que savingdataGet devuelve un string ("true" o "false") o un valor vacío (null, undefined, o "")
// y savingdataSet guarda ese valor.

async function initAutoguardadoButton() {
  const btn = document.getElementById("sAG");
  
  // Obtener el valor actual de "autoguardado"
  let value = await savingdataGet("autoguardado");
  console.log("Valor inicial de autoguardado desde la DB:", value);
  
  // Si no existe, lo configuramos en true y lo guardamos
  if (value === null || value === undefined || value === "") {
    value = "true";
    await savingdataSet("autoguardado", value);
    console.log("No se encontró valor, se asigna true por defecto");
  }
  
  // Convertir el valor a booleano
  let autoguardado = (value === "true" || value === true);
  
  // Actualizar la clase del botón
  if (autoguardado) {
    btn.classList.add("green");
    btn.classList.remove("red");
  } else {
    btn.classList.add("red");
    btn.classList.remove("green");
  }
}

async function toggleAutoguardado() {
  const btn = document.getElementById("sAG");
  
  // Obtener el valor actual
  let value = await savingdataGet("autoguardado");
  if (value === null || value === undefined || value === "") {
    value = "true";
  }
  let autoguardado = (value === "true" || value === true);
  
  // Invertir el valor
  autoguardado = !autoguardado;
  // Guardar el nuevo valor (se guarda como string para consistencia)
  await savingdataSet("autoguardado", autoguardado ? "true" : "false");
  console.log("Nuevo valor de autoguardado guardado:", autoguardado);
  
  // Actualizar las clases del botón según el nuevo valor
  if (autoguardado) {
    btn.classList.add("green");
    btn.classList.remove("red");
  } else {
    btn.classList.add("red");
    btn.classList.remove("green");
  }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
  await initAutoguardadoButton();
  // Agregar el listener para el botón
  document.getElementById("sAG").addEventListener("click", toggleAutoguardado);
});
