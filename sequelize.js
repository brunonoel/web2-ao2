// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nombre_de_tu_base_de_datos', 'tu_usuario_de_mysql', 'tu_contraseña_de_mysql', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
