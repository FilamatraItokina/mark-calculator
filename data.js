const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) return console.error('Error DB: ', err.message);
  console.log('Connected to the database');
});

// Création table users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Création table notes avec user_id
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    note REAL NOT NULL,
    coeff REAL NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

module.exports = db;
