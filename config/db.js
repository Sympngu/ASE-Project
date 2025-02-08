const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL-Verbindung mit der Pool-Methode
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Verbunden mit der PostgreSQL-Datenbank');
});

module.exports = pool;