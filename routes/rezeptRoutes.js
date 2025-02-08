const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const rezeptModel = require('../models/rezeptModel');

// Alle Rezepte abrufen
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rezepte');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ein interner Serverfehler ist aufgetreten' });
  }
});

// Ein Rezept abrufen
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rezepte WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rezept nicht gefunden' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ein Fehler ist aufgetreten' });
  }
});

// Neues Rezept erstellen
router.post('/', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const { rezeptname, beschreibung, zutaten, zubereitung, kategorie, land } = req.body;

    // Check if all required fields are provided
    if (!rezeptname || !beschreibung || !zutaten || !zubereitung || !kategorie || !land) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }
     
    const result = await pool.query(
      'INSERT INTO rezepte (rezeptname, beschreibung, zutaten, zubereitung, kategorie, land) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [rezeptname, beschreibung, zutaten, zubereitung, kategorie, land]
    );
    console.log('Database insert result:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ein Fehler ist aufgetreten: ' + err.message });
  }
});

// Rezept aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rezeptname, beschreibung, zutaten, zubereitung, kategorie, land } = req.body;
 const result = await pool.query(
      `UPDATE rezepte 
       SET titel = $1, beschreibung = $2, zutaten = $3, zubereitung = $4, kategorie = $5, land = $6 
       WHERE id = $7 RETURNING *`,
      [rezeptname, beschreibung, zutaten, zubereitung, kategorie, land, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rezept nicht gefunden' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ein Fehler ist aufgetreten: ' + err.message });
  }
});

// Rezept löschen
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM rezepte WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rezept nicht gefunden' });
    }
    res.json({ message: 'Rezept gelöscht', rezept: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;