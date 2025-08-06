const express = require('express');
const router = express.Router();
const {creerNote, lireNote, supprimerNote, supprimerNotes} = require('./../controllers/notesController');

router.post('/', creerNote);
router.get('/', lireNote);
router.delete('/:id', supprimerNote);
router.delete('/', supprimerNotes);

module.exports = router;