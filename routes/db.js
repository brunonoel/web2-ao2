const mysql = require('mysql2');

// Crear una conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
    user: 'root',
    password: 'root',
    database: 'bd_catalogo',
    connectTimeout: 60000,
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos MySQL establecida');
});

module.exports = db;
