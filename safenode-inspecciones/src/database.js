const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Esto es obligatorio para Render
  }
});

pool.on('connect', () => {
  console.log('✅ Conexión establecida con safenode_inspecciones_db');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la base de datos', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
