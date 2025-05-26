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
/* Funciones de manejo de guardados */

// Funcion de remover un guardado
async function Remover(number) {
  try {
    let cantidad_guardados = parseInt(await savingdataGet("cantidad_guardados")) || 0;
    if (cantidad_guardados === 0) return;

    await window.electronAPI.saveData(`guardado${number}`, null);

    for (let i = number; i < cantidad_guardados; i++) {
      let nextGuardado = await savingdataGet(`guardado${i + 1}`);
      if (nextGuardado) {
        await savingdataSet(`guardado${i}`, nextGuardado);
      }
    }

    await window.electronAPI.saveData(`guardado${cantidad_guardados}`, null);

    cantidad_guardados--;
    await savingdataSet("cantidad_guardados", cantidad_guardados);

    loadGuardados(); // Llama a loadGuardados() para recargar los guardados
  } catch (error) {
    console.error("Error al remover guardado:", error);
  }
}
  
// Funcion de ejecutar un guardado
async function Ejecutar(number) {
  let infoObject = JSON.parse(await savingdataGet(`guardado${number}`));

  for (let i = 1; i <= infoObject.cantPartidos; i++) {
    await votingdataSet(`partido${i}`, infoObject.nombres[i - 1]);
    await votingdataSet(`partido${i}_URL`, infoObject.URLs[i - 1]);
    await votingdataSet(`partido${i}_representante`, infoObject.representantes[i - 1]);
    await votingdataSet(`partido${i}_subRepresentante`, infoObject.subrepresentantes[i - 1]);
    await votingdataSet(`partido${i}_color`, infoObject.colores[i - 1]);
  }

  await votingdataSet("cantPartidos", infoObject.cantPartidos);
  await votingdataSet("cantPersonas", infoObject.cantPersonas);
  await votingdataSet("titulo", infoObject.titulo);
  await votingdataSet("descripcion", infoObject.descripcion);
  await votingdataSet("votoBlanco", infoObject.votoBlanco);
  await votingdataSet("grafica", infoObject.grafica);
  await votingdataSet("textoalvotar", infoObject.textoalvotar);
  await votingdataSet("textoalintentar", infoObject.textoalintentar);

  // Inicializa votes como un objeto vacío
  await votingdataSet("votes", "{}"); 

  document.location.href = "Seleccionar_Seguridad.html";
}
  
// Funcion de editar un guardado
async function Editar(number) {
    // Pasar los datos del guardado en savingdata a el votingdata y guardando editMode como true para que Crear_Eleccion.html procese los datos      let infoObject = JSON.parse(await savingdataGet(`guardado${number}`));
    let infoObject = JSON.parse(await savingdataGet(`guardado${number}`));
  
      for (let i = 1; i <= infoObject.cantPartidos; i++) {
          await votingdataSet(`partido${i}`, infoObject.nombres[i - 1]);
          await votingdataSet(`partido${i}_URL`, infoObject.URLs[i - 1]);
          await votingdataSet(`partido${i}_representante`, infoObject.representantes[i - 1]);
          await votingdataSet(`partido${i}_subRepresentante`, infoObject.subrepresentantes[i - 1]);
          await votingdataSet(`partido${i}_color`, infoObject.colores[i - 1]);
      }
  
      await votingdataSet("cantPartidos", infoObject.cantPartidos);
      await votingdataSet("cantPersonas", infoObject.cantPersonas);
      await votingdataSet("titulo", infoObject.titulo);
      await votingdataSet("descripcion", infoObject.descripcion);
      await votingdataSet("votoBlanco", infoObject.votoBlanco);
      await votingdataSet("grafica", infoObject.grafica);
      await votingdataSet("textoalvotar", infoObject.textoalvotar);
      await votingdataSet("textoalintentar", infoObject.textoalintentar);
      
      await votingdataSet("editMode", true);
  
      document.location.href = "Crear_Eleccion.html";
  }

async function Vermas(number) {

    let divObjeto = document.getElementById(`Vermas${number}`);

    let objetoActual = JSON.parse(await savingdataGet(`guardado${number}`)); 

    let graficaTipo = ""

    switch (objetoActual.grafica) {
    case "line": graficaTipo = "Linea"; break;
    case "bar": graficaTipo = "Barra"; break;
    case "radar": graficaTipo = "Radar"; break;
    case "doughnut": graficaTipo = "Dona"; break;
    case "pie": graficaTipo = "Circular"; break;
    case "polarArea": graficaTipo = "Area polar"; break;
    }


    divObjeto.innerHTML = `
        <p><strong>Descripcion: </strong>${objetoActual.descripcion}</p>
        <p><strong>Cantidad de personas: </strong>${objetoActual.cantPersonas}</p>
        <p><strong>Tipo de grafica: </strong>${graficaTipo}</p>
        <button onclick="Vermenos(${number})"class="menu-button" style="zoom: 70%;">Ver menos...</button>
        `;
}

async function Vermenos(number) {

    let divObjeto = document.getElementById(`Vermas${number}`);

    divObjeto.innerHTML = `
                    <button onclick="Vermas(${number});"class="menu-button" style="zoom: 70%;">Ver mas...</button>
        `;
}


/* Funcion para cargar la pagina de guardados */
async function CargarGuardados() {
  let cantidad_guardados = await savingdataGet("cantidad_guardados");
  const divGuardados = document.getElementById("elecciones");

  cantidad_guardados = parseInt(cantidad_guardados) || 0;
  divGuardados.innerHTML = "";

  if (cantidad_guardados === 0) {
    divGuardados.innerHTML = `<br><br><p>No hay guardados disponibles.</p>`;
  } else {
    for (let i = 1; i <= cantidad_guardados; i++) {
      let objetoActual = JSON.parse(await savingdataGet(`guardado${i}`));
      let titulo = objetoActual.autoguardado
        ? `<span>Autoguardado</span> - ${objetoActual.titulo}`
        : objetoActual.titulo;

      divGuardados.innerHTML += `
        <article>
          <h2>${titulo}</h2>
          <p><strong>Titulo: </strong>${objetoActual.titulo}</p>
          <p><strong>Cantidad de partidos: </strong>${objetoActual.cantPartidos}</p>
          <p><strong>Fecha: </strong>${objetoActual.fecha}</p>
          <div id="Vermas${i}">
            <button onclick="Vermas(${i});" class="menu-button" style="zoom: 70%;">Ver mas...</button>
          </div>
          <br>
          <div class="botones">
            <img src="../assets/media/Run.svg" onclick="Ejecutar(${i})">
            <img src="../assets/media/Edit.svg" onclick="Editar(${i})">
            <img src="../assets/media/Remove.svg" onclick="Remover(${i})">
          </div>
        </article>
      `;
    }
  }
}

// Funcion para llamar a CargarGuardados
async function loadGuardados() {
    await CargarGuardados();
}

loadGuardados();