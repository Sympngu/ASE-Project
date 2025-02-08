const pool = require('../config/db');  // Verbindung zur PostgreSQL-Datenbank

// 1. Rezept hinzufügen
const createRezept = async (rezeptname, beschreibung, zutaten, zubereitung, kategorie, land) => {
  try {
    const result = await pool.query(
      'INSERT INTO rezepte (rezeptname, beschreibung, zutaten, zubereitung,kategorie, land) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *',
      [rezeptname, beschreibung, zutaten, zubereitung, kategorie, land]
    );
    return result.rows[0];  // Gibt das erstellte Rezept zurück
  } catch (err) {
    throw new Error('Fehler beim Erstellen des Rezepts: ' + err.message);
  }
};

// 2. Alle Rezepte abrufen
const getAllRezepte = async () => {
  try {
    const result = await pool.query('SELECT * FROM rezepte');
    return result.rows;  // Gibt alle Rezepte zurück
  } catch (err) {
    throw new Error('Fehler beim Abrufen der Rezepte: ' + err.message);
  }
};

// 3. Rezept nach ID abrufen
const getRezeptById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM rezepte WHERE id = $1', [id]);
    return result.rows[0];  // Gibt das Rezept zurück, falls gefunden
  } catch (err) {
    throw new Error('Fehler beim Abrufen des Rezepts: ' + err.message);
  }
};

// 4. Rezept aktualisieren
const updateRezept = async (id, rezeptname, beschreibung, zutaten) => {
  try {
    const result = await pool.query(
      'UPDATE rezepte SET name = $1, beschreibung = $2, zutaten = $3 WHERE id = $4 RETURNING *',
      [rezeptname, beschreibung, zutaten, id]
    );
    return result.rows[0];  // Gibt das aktualisierte Rezept zurück
  } catch (err) {
    throw new Error('Fehler beim Aktualisieren des Rezepts: ' + err.message);
  }
};

// 5. Rezept löschen
const deleteRezept = async (id) => {
  try {
    const result = await pool.query('DELETE FROM rezepte WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];  // Gibt das gelöschte Rezept zurück
  } catch (err) {
    throw new Error('Fehler beim Löschen des Rezepts: ' + err.message);
  }
};

module.exports = {
  createRezept,
  getAllRezepte,
  getRezeptById,
  updateRezept,
  deleteRezept,
};