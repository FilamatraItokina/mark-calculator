const form = document.getElementById('form');
const inputTitle = document.getElementById('title');
const inputNote = document.getElementById('note');
const inputCoeff = document.getElementById('coeff');
const ul = document.getElementById('liste-notes');
const h2 = document.getElementById('moyenne');

// Fonction pour récupérer et afficher la moyenne
function updateMoyenne() {
  fetch('/moyenne')
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

  // Suppression au double-clic
  li.addEventListener('dblclick', () => {
    li.remove();

    fetch('/notes/' + note.id, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(() => {
      updateMoyenne(); // Mise à jour de la moyenne après suppression
    })
    .catch(err => {
      console.error("Erreur lors de la suppression de la note :", err);
      alert("Erreur lors de la suppression de la note.");
    });
  });
}

// Fonction pour récupérer et afficher toutes les notes
function chargerNotes() {
  ul.innerHTML = ''; // Vide la liste avant d'afficher
  fetch('/notes', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
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
  fetch('/notes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      note: note,
      coeff: coeff
    })
  })
  .then(() => {
    chargerNotes();     // Recharge proprement les notes après ajout
    updateMoyenne();    // Met à jour la moyenne
  })
  .catch(err => {
    console.error("Erreur lors de l'envoi de la note :", err);
    alert("Erreur lors de l'envoi de la note.");
  });
}


// Événement de soumission du formulaire
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validation
  if (inputTitle.value === '' || inputNote.value === '' || inputCoeff.value === '') {
    alert('Tous les champs sont obligatoires');
    return;
  }

  // Ajout de la note
  ajouterNote(inputTitle.value, parseFloat(inputNote.value), parseFloat(inputCoeff.value));

  // Réinitialisation du formulaire
  inputTitle.value = '';
  inputNote.value = '';
  inputCoeff.value = '';
});

// Initialisation : chargement des notes et de la moyenne
chargerNotes();
updateMoyenne();
