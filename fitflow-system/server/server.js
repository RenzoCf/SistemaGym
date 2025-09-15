// server.js - FitFlow Backend Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware básico
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./src/routes/auth'));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🏋️‍♂️ Bienvenido a FitFlow API',
    status: 'Server funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'FitFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba adicional
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint funcionando',
    data: {
      server: 'FitFlow Backend',
      nodejs: process.version,
      uptime: process.uptime()
    }
  });
});

// Configurar puerto
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor FitFlow INICIADO`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log('✅ Servidor listo para recibir peticiones');
});

// Manejo básico de errores
process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});