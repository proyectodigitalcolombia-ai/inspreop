const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
const inspeccionesRoutes = require('./routes/inspecciones');
app.use('/api/inspecciones', inspeccionesRoutes);

app.get('/', (req, res) => {
  res.send('Servidor de SafeNode Inspecciones Operativo 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor safenode-inspecciones corriendo en puerto ${PORT}`);
});
