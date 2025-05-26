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
async function loadVotingPage() {
  try {
    const titulo = await votingdataGet("titulo");
    const descripcion = await votingdataGet("descripcion");
    document.getElementById("titulo").innerText = titulo;
    document.getElementById("descripcion").innerText = descripcion;

    const cantPartidos = Number(await votingdataGet("cantPartidos")) || 0;
    const votesStr = await votingdataGet("votes");
    const votes = JSON.parse(votesStr || "{}");
    const votoBlanco = await votingdataGet("votoBlanco");
    const partidosDiv = document.getElementById("partidosDiv");

    const partyKeys = Array.from({ length: cantPartidos }, (_, i) => `partido${i + 1}`); // Crea un array con las claves de los partidos
    const nombres = await Promise.all(
      partyKeys.map(i => votingdataGet(i)) // Accede a los datos de los partidos con las claves correctas
    );
    const URLs = await Promise.all(
      partyKeys.map(i => votingdataGet(`${i}_URL`))
    );
    const representantes = await Promise.all(
      partyKeys.map(i => votingdataGet(`${i}_representante`))
    );
    const subRepresentantes = await Promise.all(
      partyKeys.map(i => votingdataGet(`${i}_subRepresentante`))
    );

    // Itera sobre las claves de los partidos
    partyKeys.forEach((key, index) => {
      const nombrePartido = nombres[index];
      if (nombrePartido && nombrePartido !== "null" && nombrePartido !== undefined) {
        const card = `
          <button class="voting-button" id="${key}" onclick="selectParty('${key}');">
            <img src="${URLs[index]}" alt="No se pudo cargar la imagen." height="260" width="250">
            ${nombres[index]}
            <br>
            <span><strong>${representantes[index]}</strong></span>
            <br>
            ${subRepresentantes[index]}
          </button>`;
        partidosDiv.innerHTML += card;
      }
    });

    if (votoBlanco) {
      partidosDiv.innerHTML += `
          <button class="voting-button" id="Blanco" onclick="selectParty('Blanco');">
            <img src="../assets/media/VotoEnBlanco.png" alt="Imagen no disponible" height="260" width="250">
            <span><strong>Voto en blanco</strong></span>
          </button>`;
    }

    const voteCount = Number(await votingdataGet("cantPersonas")) || 0;
    window.votesLeft = voteCount;
    window.canVote = true;
    window.selectedParty = '';
  } catch (error) {
    console.error("Error al cargar la página de votación:", error);
  }
}

async function selectParty(party) {
  if (!window.canVote) {
    const textoAlIntentar = await votingdataGet("textoalintentar");
    document.getElementById('message').textContent = textoAlIntentar;
    return;
  }
  document.querySelectorAll('.voting-button').forEach(btn => btn.classList.remove('selected'));
  document.getElementById(party).classList.add('selected');
  window.selectedParty = party;

  const voteButton = document.getElementById('voteButton');
  voteButton.disabled = false;
  voteButton.classList.add('enabled');
}

async function submitVote() {
  if (!window.selectedParty) {
    document.getElementById('message').textContent = 'Error, reinicia el programa e intenta de nuevo.';
    return;
  }

  const votesStr = await votingdataGet("votes");
  const method = await votingdataGet("Method");
  let votes = JSON.parse(votesStr || "{}");
  votes[window.selectedParty] = (votes[window.selectedParty] || 0) + 1;
  window.votesLeft--;

  window.canVote = false;
  await votingdataSet("votes", JSON.stringify(votes));

  const textoAlVotar = await votingdataGet("textoalvotar");
  document.getElementById('message').textContent = textoAlVotar;

  const voteButton = document.getElementById('voteButton');
  voteButton.disabled = true;
  voteButton.classList.remove('enabled');
  voteButton.classList.add('disabled');

  if (method === 'nil') {
    setTimeout(() => {
      if (window.votesLeft === 0) {
        window.location.href = "Resultados.html";
      } else if (!window.canVote && window.votesLeft > 0) {
        window.canVote = true;
        document.querySelectorAll('.voting-button').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('message').textContent = '';

        const voteButton = document.getElementById('voteButton');
        voteButton.disabled = true;
        voteButton.classList.remove('enabled');
      }
    }, 500);
  }
}

document.addEventListener('keydown', async function(event) {
  const method = await votingdataGet("Method");
  if (method == "key") {
    const unlockKey = await votingdataGet("unlockKey");
    if (event.key === unlockKey) {
      if (window.votesLeft === 0) {
        window.location.href = "Resultados.html";
        return;
      } else if (!window.canVote && window.votesLeft > 0) {
        window.canVote = true;
        document.querySelectorAll('.voting-button').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('message').textContent = '';

        const voteButton = document.getElementById('voteButton');
        voteButton.disabled = true;
        voteButton.classList.remove('enabled');
      }
    }
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

loadVotingPage();
