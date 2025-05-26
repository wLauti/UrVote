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
  
function getChartConfig(type) {
    const data = {
        labels: ['ABC', 'DEF', 'GHI'],
        datasets: [{
            label: 'Ejemplo',
            data: [5, 5, 5],
            ...(type === 'line' || type === 'bar' || type === 'radar'
              ? {
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2
                }
              : {
                  backgroundColor: ['red', 'green', 'blue']
                })
        }]
    };

    return {
        type: type,
        data: data,
        options: {}
    };
}

let currentType = document.querySelector('input[name="chartType"]:checked').value;
let graficatype = currentType; 
let config = getChartConfig(currentType);
let myChart = new Chart(
    document.getElementById('myChart'),
    config
);

document.querySelectorAll('input[name="chartType"]').forEach(radio => {
    radio.addEventListener('change', event => {
        const selectedType = event.target.value;
        graficatype = selectedType;
        myChart.destroy();
        config = getChartConfig(selectedType);
        myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    });
});

const container = document.getElementById("cards-container");
const addButton = document.getElementById("add-card-btn");
let cardCount = 0;
let enableRoles = true;

function generateRandomName() {
    const names = [
        "Martín", "Valentino", "Agustín", "Sofía", "Lucía",
        "Mateo", "Benjamín", "Santiago", "Facundo", "Joaquín",
        "Tomás", "Lucas", "Juan", "Franco", "Alejandro",
        "Ignacio", "Nicolás", "Emiliano", "Gabriel", "Andrés",
        "Ezequiel", "Ramiro", "Gonzalo", "Simón", "Damián",
        "Esteban", "Hernán", "Pablo", "Ricardo", "Salvador",
        "Leonardo", "Hugo", "Ángel", "Kevin", "Manuel",
        "Bruno", "Cristian", "Rafael", "Fabián", "Luciano",
        "Rodrigo", "Axel", "Fernando", "Julián", "Adrián",
        "Sebastián", "Lautaro", "Máximo", "Enzo", "Iván",
        "Camila", "Julieta", "Valentina", "Mía", "Martina",
        "Renata", "Victoria", "Abril", "Agustina", "Carla",
        "Isabella", "Antonella", "Catalina", "Milagros", "Alma",
        "Bárbara", "Andrea", "Cecilia", "Bianca", "Florencia",
        "Clara", "Paula", "Elena", "Regina", "Josefina",
        "Gabriela", "Rocío", "Nadia", "Miranda", "Melina",
        "Azul", "Noelia", "Ariana", "Carolina", "Sol",
        "Tamara", "Magdalena", "Lorena", "Daniela", "Pilar",
        "Fernanda", "Celeste", "Marina", "Gisela", "Natalia",
        "Lucrecia", "Ana", "Beatriz", "Rosa", "Graciela"
    ];
    
    const surnames = [
        "Pérez", "Gómez", "López", "Fernández", "Rodríguez",
        "Martínez", "García", "Sánchez", "Romero", "Torres",
        "Díaz", "Ruiz", "Álvarez", "Morales", "Muñoz",
        "Silva", "Castro", "Ortiz", "Herrera", "Mendoza",
        "Flores", "Chávez", "Ramos", "Vargas", "Acosta",
        "Medina", "Navarro", "Delgado", "Ríos", "Cabrera",
        "Figueroa", "Bravo", "Maldonado", "Bustamante", "Peña",
        "Benítez", "Peralta", "Mora", "Paredes", "Aguirre",
        "Vera", "Valenzuela", "Orellana", "Cáceres", "Escobar",
        "Cardozo", "Toledo", "Luna", "Zamora", "Franco",
        "Esquivel", "Quintero", "Correa", "Villalobos", "León",
        "Arce", "Rivas", "Salas", "Cortés", "Moya",
        "Sosa", "Hidalgo", "Santana", "Paz", "Sepúlveda",
        "Bustos", "Guerrero", "Arias", "Montes", "Olivares",
        "Fuentes", "Venegas", "Mejía", "Montoya", "Escalante",
        "Vega", "Camacho", "Campos", "Domínguez", "Palacios",
        "Ponce", "Riquelme", "Carranza", "Barrera", "Miranda",
        "Godoy", "Ojeda", "Tapia", "Cuéllar", "Reyes",
        "Lagos", "Saavedra", "Zárate", "Menéndez", "Uribe"
    ];
    
    return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
}

function generateRandomPartyName() {
    const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    return Array(3)
        .fill("")
        .map(() => letters[Math.floor(Math.random() * letters.length)])
        .join("");
}

function addCard() {
    if (cardCount < 6) {
        cardCount++;
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="../assets/media/Placeholder.png" alt="Party image" class="party-image">
            <input type="text" placeholder="URL de la imagen" oninput="updateImage(this)" id="partido${cardCount}-URL">

            <div class="party-name">
                <input type="text" value="${generateRandomPartyName()}" placeholder="Nombre del partido" id="partido${cardCount}-nombre">
                <input type="color" id="partido${cardCount}-color">
            </div>

            <div class="roles">
                Representante: <input type="text" value="${generateRandomName()}" placeholder="Representante" id="partido${cardCount}-representante"><br>
                Subrepresentante: <input type="text" value="${generateRandomName()}" placeholder="Subrepresentante" id="partido${cardCount}-subRepresentante">
            </div>
        `;
        container.appendChild(card);
    } else {
        Swal.fire({
            icon: "error",
            title: "No podemos hacer eso...",
            text: "El máximo de partidos es 6.",
        });
    }
}

addButton.addEventListener("click", addCard);

function updateImage(input) {
    const img = input.previousElementSibling;
    img.src = input.value || "https://via.placeholder.com/250x200";
}
  
async function submitConfigs() {
    if (cardCount < 2) {
        Swal.fire({
            icon: "error",
            title: "No podemos hacer eso...",
            text: `El mínimo de partidos es 2. (Tienes ${cardCount} partidos)`,
        });
        return;
    }

    let autodb = await savingdataGet("autoguardado");
    
    // Si no existe, lo configuramos en true y lo guardamos
    if (autodb === null || autodb === undefined || autodb === "") {
      autodb = "true";
      await savingdataSet("autoguardado", autodb);
    }

    if (autodb == true || autodb == "true") {
        await guardarEleccion(true);
    }

    for (let i = 1; i <= cardCount; i++) {
        const nombre = document.getElementById(`partido${i}-nombre`).value || "Campo vacio";
        const url = document.getElementById(`partido${i}-URL`).value || "Campo vacio";
        const representante = document.getElementById(`partido${i}-representante`).value || "Campo vacio";
        const subRepresentante = document.getElementById(`partido${i}-subRepresentante`).value || "Campo vacio";
        const color = document.getElementById(`partido${i}-color`).value || "Campo vacio";

        await votingdataSet(`partido${i}`, nombre);
        await votingdataSet(`partido${i}_URL`, url);
        await votingdataSet(`partido${i}_representante`, representante);
        await votingdataSet(`partido${i}_subRepresentante`, subRepresentante);
        await votingdataSet(`partido${i}_color`, color);
    }

    const cantPersonas = document.getElementById("cantPersonas").value || "Campo vacio";
    const titulo = document.getElementById("titulo").value || "Campo vacio";
    const descripcion = document.getElementById("descripcion").value || "Campo vacio";
    const textoalvotar = document.getElementById("textoalvotar").value || "Campo vacio";
    const textoalintentar = document.getElementById("textoalintentar").value || "Campo vacio";
    const votoBlanco = document.getElementById("votoBlanco").checked;

    if (!cantPersonas || !titulo || !descripcion) {
        Swal.fire({
            icon: "error",
            title: "No podemos hacer eso...",
            text: "Completa todos los campos adicionales.",
        });
        return;
    }

    await votingdataSet("cantPartidos", cardCount);
    await votingdataSet("cantPersonas", cantPersonas);
    await votingdataSet("titulo", titulo);
    await votingdataSet("descripcion", descripcion);
    await votingdataSet("votoBlanco", votoBlanco);
    await votingdataSet("grafica", graficatype);
    await votingdataSet("textoalvotar", textoalvotar);
    await votingdataSet("textoalintentar", textoalintentar);

    document.location.href = "CrearLS.html";
}
  
async function guardarEleccion(esautoguardado) {
    if (cardCount < 2) {
        Swal.fire({
            icon: "error",
            title: "No podemos hacer eso...",
            text: `El mínimo de partidos es 2. (Tienes ${cardCount} partidos)`,
        });
        return;
    }

    let cantidad_guardados = await savingdataGet("cantidad_guardados");
    cantidad_guardados = parseInt(cantidad_guardados) || 0;
    cantidad_guardados++;

    let objetoFinal = {
        cantPersonas: "",
        votoBlanco: false,
        titulo: "",
        descripcion: "",
        textoalvotar: "",
        textoalintentar: "",
        grafica: "",
        cantPartidos: 0,
        URLs: Array(6).fill(""),
        nombres: Array(6).fill(""),
        colores: Array(6).fill(""),
        representantes: Array(6).fill(""),
        subrepresentantes: Array(6).fill(""),
        autoguardado: false,
        fecha: ""
    };

    objetoFinal.cantPartidos = cardCount;
    objetoFinal.cantPersonas = document.getElementById("cantPersonas").value || "Campo vacio";
    objetoFinal.titulo = document.getElementById("titulo").value || "Campo vacio";
    objetoFinal.descripcion = document.getElementById("descripcion").value || "Campo vacio";
    objetoFinal.textoalvotar = document.getElementById("textoalvotar").value || "Campo vacio";
    objetoFinal.textoalintentar = document.getElementById("textoalintentar").value || "Campo vacio";
    objetoFinal.votoBlanco = document.getElementById("votoBlanco").checked;
    
    for (let i = 1; i <= cardCount; i++) {
        objetoFinal.nombres[i - 1] = document.getElementById(`partido${i}-nombre`).value || "Campo vacio";
        objetoFinal.URLs[i - 1] = document.getElementById(`partido${i}-URL`).value || "Campo vacio";
        objetoFinal.representantes[i - 1] = document.getElementById(`partido${i}-representante`).value || "Campo vacio";
        objetoFinal.subrepresentantes[i - 1] = document.getElementById(`partido${i}-subRepresentante`).value || "Campo vacio";
        objetoFinal.colores[i - 1] = document.getElementById(`partido${i}-color`).value || "Campo vacio";
    }

    objetoFinal.autoguardado = esautoguardado;
    objetoFinal.grafica = currentType;

    let DateVal = new Date();
    objetoFinal.fecha = `${DateVal.getFullYear()}/${DateVal.getMonth() + 1}/${DateVal.getDate()}`;

    await savingdataSet(`guardado${cantidad_guardados}`, JSON.stringify(objetoFinal));
    await savingdataSet("cantidad_guardados", cantidad_guardados);

    if (esautoguardado == false) {
        Swal.fire(`Se ha guardado la configuración correctamente en el espacio de guardado ${cantidad_guardados}.`);
    }
}

async function loadEditMode() {
    const editMode = await votingdataGet("editMode");

    if (editMode) {
        document.getElementById("cantPersonas").value = await votingdataGet("cantPersonas") || "";
        document.getElementById("titulo").value = await votingdataGet("titulo") || "";
        document.getElementById("descripcion").value = await votingdataGet("descripcion") || "";
        document.getElementById("textoalvotar").value = await votingdataGet("textoalvotar") || "";
        document.getElementById("textoalintentar").value = await votingdataGet("textoalintentar") || "";
        document.getElementById("votoBlanco").checked = (await votingdataGet("votoBlanco")) === "true";

        const cantPartidos = parseInt(await votingdataGet("cantPartidos")) || 0;

        for (let i = 1; i <= cantPartidos; i++) {
            addCard();

            document.getElementById(`partido${i}-nombre`).value = await votingdataGet(`partido${i}`) || "";
            document.getElementById(`partido${i}-URL`).value = await votingdataGet(`partido${i}_URL`) || "";
            document.getElementById(`partido${i}-representante`).value = await votingdataGet(`partido${i}_representante`) || "";
            document.getElementById(`partido${i}-subRepresentante`).value = await votingdataGet(`partido${i}_subRepresentante`) || "";
            document.getElementById(`partido${i}-color`).value = await votingdataGet(`partido${i}_color`) || "#000000";

            updateImage(document.getElementById(`partido${i}-URL`));
        }

        graficatype = await votingdataGet("grafica") || "bar";
        document.querySelector(`input[name="chartType"][value="${graficatype}"]`).checked = true;

        myChart.destroy();
        config = getChartConfig(graficatype);
        myChart = new Chart(document.getElementById('myChart'), config);

        await votingdataSet("cantPersonas", "");
        await votingdataSet("titulo", "");
        await votingdataSet("descripcion", "");
        await votingdataSet("textoalvotar", "");
        await votingdataSet("textoalintentar", "");
        await votingdataSet("votoBlanco", "");
        await votingdataSet("cantPartidos", "");
        await votingdataSet("grafica", "");
        await votingdataSet("editMode", "");

        for (let i = 1; i <= cantPartidos; i++) {
            await votingdataSet(`partido${i}`, "");
            await votingdataSet(`partido${i}_URL`, "");
            await votingdataSet(`partido${i}_representante`, "");
            await votingdataSet(`partido${i}_subRepresentante`, "");
            await votingdataSet(`partido${i}_color`, "");
        }
    }
}

document.addEventListener("DOMContentLoaded", loadEditMode);


