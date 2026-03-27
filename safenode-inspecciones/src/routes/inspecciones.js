const express = require('express');
const router = express.Router();
const db = require('../database');

// Guardar nueva inspección
router.post('/guardar', async (req, res) => {
  const { conductor_nombre, conductor_documento, vehiculo_placa, ...rest } = req.body;

  // Store all extra fields inside respuestas_inspeccion JSON
  const respuestas = { ...rest };

  try {
    const query = `
      INSERT INTO inspecciones (conductor_nombre, conductor_documento, vehiculo_placa, respuestas_inspeccion)
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const values = [conductor_nombre, conductor_documento, vehiculo_placa, JSON.stringify(respuestas)];
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

// Obtener todas las inspecciones (historial)
router.get('/historial', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inspecciones ORDER BY fecha_creacion DESC');
    const rows = result.rows.map(r => {
      const resp = r.respuestas_inspeccion || {};
      return {
        id: r.id,
        fecha: resp.fecha || r.fecha_creacion,
        vehiculo_placa: r.vehiculo_placa,
        clase_vehiculo: resp.clase_vehiculo || 'N/A',
        conductor_nombre: r.conductor_nombre,
        conductor_documento: r.conductor_documento,
        manifiesto: resp.manifiesto || 'N/A',
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// Obtener una inspección por ID (detalle completo)
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inspecciones WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Inspección no encontrada" });
    }
    const r = result.rows[0];
    const resp = r.respuestas_inspeccion || {};
    res.json({
      id: r.id,
      fecha: resp.fecha || r.fecha_creacion,
      vehiculo_placa: r.vehiculo_placa,
      clase_vehiculo: resp.clase_vehiculo || 'N/A',
      conductor_nombre: r.conductor_nombre,
      conductor_documento: r.conductor_documento,
      manifiesto: resp.manifiesto || 'N/A',
      tipo_documento: resp.tipo_documento || 'Cédula de Ciudadanía',
      kilometraje: resp.kilometraje || 0,
      modalidad: resp.modalidad || 'Nacional',
      aplica_remolque: resp.aplica_remolque || false,
      n_remolque: resp.n_remolque || null,
      aplica_kit_derrames: resp.aplica_kit_derrames || false,
      cabezote: resp.cabezote || {},
      remolque_estructura: resp.remolque_estructura || {},
      remolque_luces: resp.remolque_luces || {},
      kit_derrames: resp.kit_derrames || {},
      kit_carretera: resp.kit_carretera || {},
      botiquin: resp.botiquin || {},
      epp: resp.epp || {},
      requisitos_despacho: resp.requisitos_despacho || {},
      documentos_carga: resp.documentos_carga || {},
      observaciones: resp.observaciones || null,
      firma_conductor: resp.firma_conductor || null,
      firma_inspector: resp.firma_inspector || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// Eliminar inspección
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM inspecciones WHERE id=$1', [req.params.id]);
    res.json({ success: true, message: "Inspección eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la inspección" });
  }
});

module.exports = router;
