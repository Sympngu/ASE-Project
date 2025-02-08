
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Benutzer registrieren
router.post('/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('passwort').isLength({ min: 6 }).withMessage('Passwort must be at least 6 characters long')
  ],
  async (req, res) => {
  try {
    const { username, email, passwort } = req.body;
    const hashedPasswort = await bcrypt.hash(passwort, 10);
    const result = await pool.query(
      'INSERT INTO benutzer (username, email, passwort) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPasswort]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Benutzer login
router.post('/login', async (req, res) => {
  try {
    const { username, passwort } = req.body;
    const result = await pool.query('SELECT * FROM benutzer WHERE username= $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }
    const benutzer = result.rows[0];
    const validPasswort = await bcrypt.compare(passwort, benutzer.passwort);
    if (!validPasswort) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }
    const token = jwt.sign({ id: benutzer.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

   // Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM benutzer');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific user by ID
router.get('/benutzer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, username, email FROM benutzer WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user by ID
router.put('/benutzer/:id',
  [
    body('username').optional().notEmpty().withMessage('Benutzername darf nicht leer sein'),
    body('email').optional().isEmail().withMessage('Ungültige E-Mail-Adresse')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { benutzername: username, email } = req.body;

      const fields = [];
      const values = [];

      if (username) {
        fields.push('benutzername');
        values.push(username);
      }

      if (email) {
        fields.push('email');
        values.push(email);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'Keine Felder zum Aktualisieren angegeben' });
      }

      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

      const query = `UPDATE benutzer SET ${setClause} WHERE id = $${values.length + 1} RETURNING id, benutzername, email`;
      values.push(id);

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Benutzer nicht gefunden' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete a user by ID
router.delete('/benutzer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM benutzer WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;