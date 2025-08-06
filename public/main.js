const form = document.getElementById('form');
const inputTitle = document.getElementById('title');
const inputNote = document.getElementById('note');
const inputCoeff = document.getElementById('coeff');
const ul = document.getElementById('liste-notes');
const h2 = document.getElementById('moyenne');

function getToken() {
  return localStorage.getItem('token'); // Assure-toi que le token est stocké sous cette clé
}

// Fonction pour récupérer et afficher la moyenne
function updateMoyenne() {
  const token = getToken();
  fetch('/moyenne', {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(data => {
    h2.textContent = `Moyenne: ${data.moyenne.toFixed(2)}`;
  })
  .catch(err => {
    console.error("Erreur lors de la récupération de la moyenne :", err);
    alert("Erreur lors de la récupération de la moyenne.");
  });
}

// Fonction pour afficher une note dans la liste
function afficherNote(note) {
  const li = document.createElement('li');
  li.textContent = `${note.title} - Note: ${note.note} - Coeff: ${note.coeff}`;
  ul.appendChild(li);

  li.addEventListener('dblclick', () => {
    li.remove();

    const token = getToken();
    fetch('/notes/' + note.id, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(() => {
      updateMoyenne();
    })
    .catch(err => {
      console.error("Erreur lors de la suppression de la note :", err);
      alert("Erreur lors de la suppression de la note.");
    });
  });
}

// Fonction pour récupérer et afficher toutes les notes
function chargerNotes() {
  ul.innerHTML = '';
  const token = getToken();
  fetch('/notes', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(data => {
    data.forEach(note => {
      afficherNote(note);
    });
  })
  .catch(err => {
    console.error("Erreur lors du chargement des notes :", err);
    alert("Erreur lors du chargement des notes.");
  });
}

// Fonction pour ajouter une note
function ajouterNote(title, note, coeff) {
  const token = getToken();
  fetch('/notes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      title: title,
      note: note,
      coeff: coeff
    })
  })
  .then(() => {
    chargerNotes();
    updateMoyenne();
  })
  .catch(err => {
    console.error("Erreur lors de l'envoi de la note :", err);
    alert("Erreur lors de l'envoi de la note.");
  });
}

// Événement de soumission du formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (inputTitle.value === '' || inputNote.value === '' || inputCoeff.value === '') {
    alert('Tous les champs sont obligatoires');
    return;
  }

  ajouterNote(inputTitle.value, parseFloat(inputNote.value), parseFloat(inputCoeff.value));

  inputTitle.value = '';
  inputNote.value = '';
  inputCoeff.value = '';
});

// Initialisation : chargement des notes et de la moyenne
chargerNotes();
updateMoyenne();
