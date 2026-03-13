const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en Render
  }
});

pool.on('connect', () => {
  console.log('✅ Conectado exitosamente a safenode_inspecciones_db');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
