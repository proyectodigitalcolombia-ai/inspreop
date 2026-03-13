const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para crear la tabla automáticamente
const crearTablaSiNoExiste = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS inspecciones (
        id SERIAL PRIMARY KEY,
        fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        conductor_nombre VARCHAR(255) NOT NULL,
        conductor_documento VARCHAR(50),
        vehiculo_placa VARCHAR(20) NOT NULL,
        respuestas_inspeccion JSONB NOT NULL, 
        pdf_url TEXT,
        aprobado BOOLEAN DEFAULT true
    );
  `;
  try {
    await pool.query(sql);
    console.log('✅ Base de datos: Tabla "inspecciones" lista para usar');
  } catch (err) {
    console.error('❌ Error al verificar la tabla:', err);
  }
};

// Ejecutar la verificación al cargar el archivo
crearTablaSiNoExiste();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
