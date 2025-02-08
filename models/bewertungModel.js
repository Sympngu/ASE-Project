const pool = require('../config/db');  // Verbindung zur PostgreSQL-Datenbank

const addBewertung = async (rezept_id, benutzer_id, bewertung, kommentar) => {
    try {
      const result = await pool.query(
        'INSERT INTO bewertungen (rezept_id, benutzer_id, bewertung, kommentar) VALUES ($1, $2, $3, $4) RETURNING *',
        [rezept_id, benutzer_id, bewertung, kommentar]
      );
      return result.rows[0];  // Gibt die hinzugefügte Bewertung zurück
    } catch (err) {
      console.error('Fehler beim Hinzufügen der Bewertung:', err);
      throw new Error('Fehler beim Hinzufügen der Bewertung');
    }
  };
  
  // Bewertungen für ein Rezept abrufen
  const getBewertungenByRezeptId = async (rezept_id) => {
    try {
      const result = await pool.query('SELECT * FROM bewertungen WHERE rezept_id = $1', [rezept_id]);
      return result.rows;  // Gibt alle Bewertungen für das Rezept zurück
    } catch (err) {
      console.error('Fehler beim Abrufen der Bewertungen:', err);
      throw new Error('Fehler beim Abrufen der Bewertungen');
    }
  };
  
  module.exports = {
    addBewertung,
    getBewertungenByRezeptId,
  };