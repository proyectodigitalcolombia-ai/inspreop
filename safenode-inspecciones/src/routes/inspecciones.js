const express = require('express');
const router = express.Router();
const db = require('../database');

// Guardar nueva inspección
router.post('/guardar', async (req, res) => {
  const { conductor_nombre, conductor_documento, vehiculo_placa, respuestas } = req.body;
  
  try {
    const query = `
      INSERT INTO inspecciones (conductor_nombre, conductor_documento, vehiculo_placa, respuestas_inspeccion)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const values = [conductor_nombre, conductor_documento, vehiculo_placa, respuestas];
    const result = await db.query(query, values);
    
    res.status(201).json({ 
      success: true, 
      id: result.rows[0].id, 
      message: "Inspección guardada correctamente" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar en safenode_inspecciones_db" });
  }
});

// Obtener todas las inspecciones para el panel de control
router.get('/historial', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inspecciones ORDER BY fecha_creacion DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

module.exports = router;
