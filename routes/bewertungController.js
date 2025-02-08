const { addBewertung, getBewertungenByRezeptId } = require('../models/bewertungModel');

// Bewertung hinzufügen
const createBewertung = async (req, res) => {
  const { rezept_id, benutzer_id, bewertung, kommentar } = req.body;

  // Eingabevalidierung
  if (!rezept_id || !benutzer_id || !bewertung || bewertung < 1 || bewertung > 5) {
    return res.status(400).json({ error: 'Ungültige Eingabedaten' });
  }

  try {
    const neueBewertung = await addBewertung(rezept_id, benutzer_id, bewertung, kommentar);
    res.status(201).json(neueBewertung);  // Bewertung wurde erstellt
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Bewertung' });
  }
};

// Bewertungen für ein Rezept abrufen
const getBewertungen = async (req, res) => {
  const { rezept_id } = req.params;

  try {
    const bewertungen = await getBewertungenByRezeptId(rezept_id);
    res.status(200).json(bewertungen);  // Alle Bewertungen für das Rezept
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Bewertungen' });
  }
};

module.exports = {
  createBewertung,
  getBewertungen,
};