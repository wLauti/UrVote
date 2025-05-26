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
(async function loadResultsPage() {
  try {
    const votesStr = await votingdataGet("votes");
    const votes = JSON.parse(votesStr || "{}");

    const indices = [1, 2, 3, 4, 5, 6];
    const partidos = await Promise.all(
      indices.map(i => votingdataGet(`partido${i}`))
    );
    const ColoresPartidos = await Promise.all(
      indices.map(i => votingdataGet(`partido${i}_color`))
    );

    const GraficaTipo = await votingdataGet("grafica");
    const titulo = await votingdataGet("titulo");

    const votoBlancoRaw = await votingdataGet("votoBlanco");
    const voto_blanco = votoBlancoRaw === true || votoBlancoRaw === "true";

    document.getElementById("titulo").innerText = titulo;

    const totalVotos = Object.values(votes).reduce(
      (acc, val) => acc + (parseInt(val) || 0),
      0
    );

    const tbody = document.getElementById("tablabody");
    tbody.innerHTML = "";

    Object.keys(votes).forEach(key => {
      if (key !== "Blanco") {
        const partidoIndex = parseInt(key.replace("partido", "")) - 1;
        const nombrePartido = partidos[partidoIndex];
        const votosPartido = parseInt(votes[key]) || 0;
        const porcentaje =
          totalVotos > 0 ? ((votosPartido / totalVotos) * 100).toFixed(2) : "0.00";

        if (nombrePartido && nombrePartido !== "null" && nombrePartido !== undefined) {
          tbody.innerHTML += `
            <tr>
              <td>${nombrePartido}</td>
              <td>${votosPartido}</td>
              <td>${porcentaje}%</td>
            </tr>
          `;
        }
      }
    });

    if (voto_blanco) {
      const votosBlanco = parseInt(votes.Blanco) || 0;
      const porcB =
        totalVotos > 0 ? ((votosBlanco / totalVotos) * 100).toFixed(2) : "0.00";

      tbody.innerHTML += `
        <tr>
          <td>Votos en blanco</td>
          <td>${votosBlanco}</td>
          <td>${porcB}%</td>
        </tr>
      `;
    }

    tbody.innerHTML += `
      <tr>
        <td><b>Total</b></td>
        <td>${totalVotos}</td>
        <td>100%</td>
      </tr>
    `;

    const ctx = document.getElementById("votingChart").getContext("2d");

    const labels = Object.keys(votes).map(key => {
      if (key !== "Blanco") {
        const index = parseInt(key.replace("partido", "")) - 1;
        return partidos[index] || "Votos en blanco";
      } else {
        return "Votos en blanco";
      }
    });

    const dataValues = Object.values(votes).map(val => parseInt(val) || 0);

    const datasetConfig =
      GraficaTipo === "line" ||
      GraficaTipo === "bar" ||
      GraficaTipo === "radar"
        ? {
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2
          }
        : {
            backgroundColor: ColoresPartidos.slice(0, Object.keys(votes).length)
          };

    new Chart(ctx, {
      type: GraficaTipo,
      data: {
        labels: labels,
        datasets: [
          {
            label: "Votos",
            data: dataValues,
            borderWidth: 1,
            ...datasetConfig
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" }
        }
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        window.print();
        require("electron").ipcRenderer.send("print-page");
      }
    });

    window.volver = function volver() {
      Swal.fire({
        title: "¿Estas seguro?",
        text: "¡No podras volver a esta pagina!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "¡No, cancelar!",
        confirmButtonText: "¡Si, volver!"
      }).then(result => {
        if (result.isConfirmed) {
          document.location.href = "Menu.html";
        }
      });
    };
  } catch (error) {
    console.error("Error al cargar los resultados:", error);
  }
})();
