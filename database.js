const mysql = require('mysql2');
require('dotenv').config();

// Configuración de conexión corregida
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'marketing_financiero',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    reconnect: true
};

// Pool de conexiones para mejor rendimiento
const connectionPool = mysql.createPool(dbConfig);

// Manejo de errores de conexión
connectionPool.on('error', (err) => {
    console.error('Error de base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconectando a la base de datos...');
    }
});

module.exports = connectionPool.promise();