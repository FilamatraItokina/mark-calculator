const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./data");
const notesRoutes = require("./routes/notes");
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res)=>{
  res.render('index');
});
app.use('/notes', notesRoutes);
app.get('/moyenne', (req, res) => {
  db.all(`SELECT * FROM notes`, [], (err, notes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!notes || notes.length === 0) return res.json({ moyenne: 0 });

    let sommeDesNotesPonderees = 0;
    let sommeDesCoefficients = 0;

    for (let note of notes) {
      sommeDesNotesPonderees += note.note * note.coeff;
      sommeDesCoefficients += note.coeff;
    }

    let moyenne = 0;
    if (sommeDesCoefficients !== 0) {
      moyenne = sommeDesNotesPonderees / sommeDesCoefficients;
    }
    res.json({ moyenne });
  });
});

app.listen(port, () => {
  console.log(`Server runnig on http://localhost:${port}`);
});
