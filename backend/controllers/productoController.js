const Producto = require('../models/Producto');
const { Op } = require('sequelize');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un solo producto por ID
exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener productos por categoría
exports.getProductosByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params; // Recibimos la categoría desde la URL
        
        const productos = await Producto.findAll({
            where: { 
                categoria: categoria 
            }
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: `No se encontraron productos en la categoría: ${categoria}` });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchProductosByName = async (req, res) => {
    try {
        const { query } = req.params; // Lo que el usuario escribe para buscar

        const productos = await Producto.findAll({
            where: {
                nombre: {
                    // El signo % significa "cualquier texto antes o después"
                    [Op.like]: `%${query}%` 
                }
            }
        });

        if (productos.length === 0) {
            return res.status(404).json({ message: `No se encontraron coincidencias para: ${query}` });
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        // Si el error es de validación (ej: stock negativo), enviamos 400
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación', 
                detalles: error.errors.map(e => e.message) 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un producto (Ej: cambiar stock)
exports.updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        await producto.update(req.body);
        res.json(producto);
    } catch (error) {
        // Si el error es de validación (ej: stock negativo), enviamos 400
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación', 
                detalles: error.errors.map(e => e.message) 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        await producto.destroy();
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};