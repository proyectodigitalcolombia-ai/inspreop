const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve React frontend static build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Rutas API
const inspeccionesRoutes = require('./routes/inspecciones');
app.use('/api/inspecciones', inspeccionesRoutes);

// All other routes → serve React app (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../frontend/dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Servidor de SafeNode Inspecciones Operativo 🚀');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor safenode-inspecciones corriendo en puerto ${PORT}`);
});
