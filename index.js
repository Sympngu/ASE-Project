const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./config/db');
const rezeptRoutes = require('./routes/rezeptRoutes');
const authRoutes = require('./routes/authRoutes');
const bewertungRoutes = require('./routes/bewertungRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cors = require('cors');
// Middleware
app.use(bodyParser.json());
// cors-paket
app.use(cors());

// Routen
app.use('/api/rezepte', rezeptRoutes);
app.use('/api/auth', authRoutes);
app.use('/bewertungen', bewertungRoutes);
app.use('/api/sucherezept', searchRoutes);

// Server starten
app.listen(PORT, () => { console.log(`Server läuft auf http://localhost:${PORT}`);
});
  // Datenbankverbindung 
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Fehler bei der Verbindung zur Datenbank:', err);
    } else {
      console.log('Datenbank erfolgreich verbunden:', res.rows[0]);
    }
  });