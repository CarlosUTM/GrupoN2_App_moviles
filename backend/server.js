const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const productoRoutes = require('./routes/productoRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());                 // Permite conexiones desde cualquier frontend
app.use(express.json());         // Permite recibir JSON en el body

// Rutas
app.use('/api/productos', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Inventario funcionando 🚀');
});

// Sincronización con Base de Datos y arranque del servidor
// force: false asegura que NO borre los datos cada vez que reinicias
sequelize.sync({ force: false }) 
    .then(() => {
        console.log('✅ Tablas sincronizadas con la base de datos');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al sincronizar con la BD:', err);
    });