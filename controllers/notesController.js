const db = require("../data");

// CREATE
function creerNote(req, res) {
  const { title, note, coeff } = req.body;
  const userId = req.user.id;
  const query = `INSERT INTO notes (title, note, coeff, user_id) VALUES (?, ?, ?, ?)`;
  db.run(query, [title, note, coeff, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: "Note ajoutée" });
  });
}

// READ
function lireNote(req, res) {
  const userId = req.user.id;
  db.all(`SELECT * FROM notes WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0)
      return res.status(404).json({ message: "Pas de note trouvée" });
    return res.status(200).json(rows);
  });
}

// DELETE
function supprimerNote(req, res) {
  const userId = req.user.id;
  const id = req.params.id;
  const query = `DELETE FROM notes WHERE id = ? AND user_id = ?`;
  db.run(query, [id, userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Note non trouvée ou pas autorisé" });
    return res.status(200).json({ message: "Note supprimée" });
  });
}

// DELETE ALL
function supprimerNotes(req, res) {
  const userId = req.user.id;
  const query = `DELETE FROM notes WHERE user_id = ?`;
  db.run(query, [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ message: "Toutes les notes ont été supprimées" });
  });
}

module.exports = { creerNote, lireNote, supprimerNote, supprimerNotes };
