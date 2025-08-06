const db = require("../data");

//CREATE
function creerNote(req, res) {
  const { title,note, coeff } = req.body;
  const query = `INSERT INTO notes (title, note, coeff) VALUES (?,?,?)`;
  db.run(query, [title, note, coeff], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: "Note ajoutée" });
  });
}

//READ
function lireNote(req, res) {
  db.all(`SELECT * FROM notes`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Pas de note trouvé" });
    return res.status(200).json(row);
  });
}

//DELETE
function supprimerNote(req, res) {
  const id = req.params.id;
  const query = `DELETE FROM notes WHERE id = ?`;
  db.run(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ message: "Note supprimée" });
  });
}

//DELETEALL
function supprimerNotes(req, res) {
  db.run(`DELETE FROM notes`, [], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    return res
      .status(200)
      .json({ message: "Toutes les notes ont été supprimées" });
  });
}

module.exports = { creerNote, lireNote, supprimerNote, supprimerNotes };
