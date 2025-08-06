const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./data');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

// Routes Auth + Notes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// Route protégée pour calcul moyenne par utilisateur
const authMiddleware = require('./middlewares/auth');
app.get('/moyenne', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const table = `notes_${userId}`;

  db.all(`SELECT * FROM ${table}`, [], (err, notes) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!notes || notes.length === 0) return res.json({ moyenne: 0 });

    let sommeNotesPonderees = 0;
    let sommeCoeffs = 0;
    for (const note of notes) {
      sommeNotesPonderees += note.note * note.coeff;
      sommeCoeffs += note.coeff;
    }
    const moyenne = sommeCoeffs ? (sommeNotesPonderees / sommeCoeffs) : 0;
    res.json({ moyenne });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
