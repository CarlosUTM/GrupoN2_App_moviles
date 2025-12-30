const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT, // Agregamos el puerto explícitamente
        dialect: 'mysql',
        logging: false, // Puedes poner true si quieres ver las consultas SQL en la consola
        dialectOptions: {
            // A veces los servidores remotos requieren tiempos de espera más largos
            connectTimeout: 60000 
        }
    }
);

// Probar conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa al servidor remoto grupofmo.com');
    } catch (error) {
        console.error('❌ Error al conectar:', error);
    }
})();

module.exports = sequelize;