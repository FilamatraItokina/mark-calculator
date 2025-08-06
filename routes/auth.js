const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../data');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Insérer utilisateur
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashed], function(err) {
      if(err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ message: 'Email déjà utilisé' });
        }
        return res.status(500).json({ message: err.message });
      }

      // Créer la table notes spécifique à cet utilisateur
      const userId = this.lastID;
      const tableName = `notes_${userId}`;

      db.run(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          note REAL NOT NULL,
          coeff REAL NOT NULL
        )
      `, (err) => {
        if(err) {
          return res.status(500).json({ message: 'Erreur création table notes utilisateur' });
        }
        res.status(201).json({ message: 'Utilisateur créé, connectez-vous' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if(err) return res.status(500).json({ message: 'Erreur serveur' });
    if(!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

module.exports = router;
