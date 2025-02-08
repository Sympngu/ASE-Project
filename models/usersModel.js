const pool = require('../config/db');  // Verbindung zur PostgreSQL-Datenbank
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Benutzer erstellen
const createUser = async (username, email, passwort) => {
  try {
    const hashedPasswort = await bcrypt.hash(passwort, 10);
    const result = await pool.query(
      'INSERT INTO benutzer (username, email, passwort) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ username, email, hashedPasswort]
    );
    return result.rows[0];  // Gibt den erstellten Benutzer zurück
  } catch (err) {
    throw new Error('Fehler beim Erstellen des Benutzers:' + err.message);
  }
};

// 2. Benutzer anhand der Email suchen
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM benutzer WHERE email = $1', [email]);
    return result.rows[0];  // Gibt den gefundenen Benutzer zurück
  } catch (err) {
    throw new Error('Fehler beim Abrufen des Benutzers:' + err.message);
  }
};

const validatePassword = async (email, passwort) => {
  try {
    const benutzer = await getUserByEmail(email);
    if (benutzer) {
      const isMatch = await bcrypt.compare(passwort, benutzer.passwort);  // Passwort vergleichen
      if (isMatch) {
        return benutzer;  // Benutzer zurückgeben, wenn Passwort übereinstimmt
      } else {
        throw new Error('Falsches Passwort');
      }
    } else {
      throw new Error('Benutzer nicht gefunden');
    }
  } catch (err) {
    throw new Error('Fehler beim Überprüfen des Passworts: ' + err.message);
  }
};


// 3. JWT für den Benutzer erstellen
const generateAuthToken = (benutzer) => {
  const token = jwt.sign({ id: benutzer.id, benutzername: benutzer.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = {
  createUser,
  getUserByEmail,
  generateAuthToken,
};