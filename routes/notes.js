const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const notesController = require('../controllers/notesController');

router.use(authMiddleware); // toutes les routes notes nécessitent un token

router.post('/', notesController.creerNote);
router.get('/', notesController.lireNote);
router.delete('/:id', notesController.supprimerNote);
router.delete('/', notesController.supprimerNotes);

module.exports = router;
