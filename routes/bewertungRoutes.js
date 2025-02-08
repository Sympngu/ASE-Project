// routes/bewertungRoute.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const { createBewertung, getBewertungen } = require('./bewertungController');

// Eine neue Bewertung hinzufügen
router.post('/', createBewertung);

// Bewertungen für ein bestimmtes Rezept abrufen
router.get('/:rezept_id', getBewertungen);

module.exports = router;