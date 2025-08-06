const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) return console.error('Error DB: ', err.message);
  console.log('Connected to the database');
});

// Table users classique
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Note : on ne crée **pas de tables globales pour notes**
// car chaque utilisateur aura sa propre table `notes_userid`
// On créera cette table dynamiquement à l'inscription

module.exports = db;
