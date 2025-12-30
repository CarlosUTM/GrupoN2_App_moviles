const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0], // El valor mínimo permitido es 0
                msg: "El stock no puede ser negativo" // Mensaje de error personalizado
            }
        }
    },
    ubicacion: {
        type: DataTypes.STRING, // Ej: "Estante A", "Refrigerador 2"
        allowNull: true
    },
    categoria: {
        type: DataTypes.STRING, // Ej: "Reactivos", "Herramientas"
        allowNull: true
    }
}, {
    tableName: 'productos', // Nombre de la tabla en MySQL
    timestamps: true        // Crea createdAt y updatedAt automáticamente
});

module.exports = Producto;