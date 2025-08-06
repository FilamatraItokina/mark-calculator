const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const db = require('../data');

router.use(authMiddleware);

// Helper pour le nom de table utilisateur
function tableUserNotes(userId) {
  return `notes_${userId}`;
}

// CREATE note
router.post('/', (req, res) => {
  const { title, note, coeff } = req.body;
  const userId = req.user.userId;
  if (!title || note == null || coeff == null) return res.status(400).json({ message: 'Tous les champs sont requis' });

  const table = tableUserNotes(userId);
  const query = `INSERT INTO ${table} (title, note, coeff) VALUES (?, ?, ?)`;

  db.run(query, [title, note, coeff], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: this.lastID, message: 'Note ajoutée' });
  });
});

// READ notes
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const table = tableUserNotes(userId);
  const query = `SELECT * FROM ${table} ORDER BY id DESC`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// DELETE note par id
router.delete('/:id', (req, res) => {
  const userId = req.user.userId;
  const table = tableUserNotes(userId);
  const id = req.params.id;

  const query = `DELETE FROM ${table} WHERE id = ?`;
  db.run(query, [id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Note non trouvée' });
    res.json({ message: 'Note supprimée' });
  });
});

// DELETE toutes les notes
router.delete('/', (req, res) => {
  const userId = req.user.userId;
  const table = tableUserNotes(userId);

  const query = `DELETE FROM ${table}`;
  db.run(query, [], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Toutes les notes supprimées' });
  });
});

module.exports = router;
