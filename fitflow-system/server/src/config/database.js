// src/config/database.js
const { Sequelize } = require('sequelize');

// Crear instancia de Sequelize usando DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Para conexiones SSL de Neon
    }
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Función para conectar y sincronizar la base de datos
const connectDB = async () => {
  try {
    // Probar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    
    // Importar y cargar todas las relaciones de modelos
    require('../models/index');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ 
      force: false, // Cambiar a true solo si quieres recrear todas las tablas
      alter: false  // Cambiar a true para actualizar estructura de tablas existentes
    });
    console.log('✅ Modelos sincronizados con la base de datos');
    
    return sequelize;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
    process.exit(1);
  }
};

// Función para cerrar la conexión
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión a la base de datos cerrada');
  } catch (error) {
    console.error('❌ Error cerrando la conexión:', error.message);
  }
};

module.exports = {
  sequelize,
  connectDB,
  closeDB
};