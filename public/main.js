const tokenKey = 'token';

// Elements DOM
const authSection = document.getElementById('auth-section');
const notesSection = document.getElementById('notes-section');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');

const noteForm = document.getElementById('note-form');
const ul = document.getElementById('liste-notes');
const moyenneElem = document.getElementById('moyenne');

// Utilitaire
function getToken() {
  return localStorage.getItem(tokenKey);
}

function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

function clearToken() {
  localStorage.removeItem(tokenKey);
}

function showAuth() {
  authSection.style.display = 'block';
  notesSection.style.display = 'none';
}

function showNotes() {
  authSection.style.display = 'none';
  notesSection.style.display = 'block';
}

// ================== AUTH ==================

signupForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert('Inscription réussie, connecte-toi !');
    signupForm.reset();
  } else {
    alert(data.message || 'Erreur inscription');
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    setToken(data.token);
    loginForm.reset();
    loadNotesPage();
  } else {
    alert(data.message || 'Erreur connexion');
  }
});

logoutBtn.addEventListener('click', () => {
  clearToken();
  showAuth();
});

// ================== NOTES ==================

noteForm.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const note = parseFloat(document.getElementById('note').value);
  const coeff = parseFloat(document.getElementById('coeff').value);

  const token = getToken();
  if (!token) {
    alert('Connecte-toi d’abord');
    return;
  }

  const res = await fetch('/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, note, coeff }),
  });

  if (res.ok) {
    noteForm.reset();
    afficherNotes();
    afficherMoyenne();
  } else {
    const data = await res.json();
    alert(data.message || 'Erreur ajout note');
  }
});

async function afficherNotes() {
  const token = getToken();
  if (!token) return;

  const res = await fetch('/notes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    alert('Erreur chargement notes');
    return;
  }
  const notes = await res.json();

  ul.innerHTML = '';
  for (const note of notes) {
    const li = document.createElement('li');
    li.textContent = `${note.title} - Note: ${note.note} - Coeff: ${note.coeff}`;
    ul.appendChild(li);
  }
}

async function afficherMoyenne() {
  const token = getToken();
  if (!token) return;

  const res = await fetch('/moyenne', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    moyenneElem.textContent = '';
    return;
  }
  const data = await res.json();
  moyenneElem.textContent = `Moyenne: ${data.moyenne.toFixed(2)}`;
}

function loadNotesPage() {
  showNotes();
  afficherNotes();
  afficherMoyenne();
}

// Au chargement, afficher la bonne section
window.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token) {
    loadNotesPage();
  } else {
    showAuth();
  }
});
