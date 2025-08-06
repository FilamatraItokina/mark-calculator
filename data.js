const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/database.db', (err)=>{
  if (err) return console.error('Error DB: ', err.message);
  return console.log('Connected to the database');
});

db.run(`
  CREATE TABLE IF NOT EXISTS notes(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  note REAL NOT NULL,
  coeff REAL NOT NULL
  )
  `);

module.exports = db;