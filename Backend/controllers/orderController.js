const consultas = require('../database/consultas');

// 1. Generar una nueva Boleta (Antes crearOrden)
const crearBoleta = async (req, res) => {
    try {
        const { productos, total } = req.body;
        
        // Extraemos el ID del usuario que viene desde el middleware auth.js
        const id_usuario = req.user.id; 

        // Llamamos a la función de consultas actualizada
        const nuevaBoleta = await consultas.generarBoleta(id_usuario, productos, total);
        
        res.status(201).json({
            message: "¡Venta registrada con éxito! 🧾",
            boleta: nuevaBoleta
        });
    } catch (error) {
        console.error("Error al generar boleta:", error.message);
        res.status(500).json({ error: "No se pudo procesar la boleta de compra." });
    }
};

// 2. Obtener historial de boletas (Antes obtenerMisOrdenes)
const obtenerMisBoletas = async (req, res) => {
    try {
        const id_usuario = req.user.id;
        const boletas = await consultas.obtenerBoletasPorUsuario(id_usuario);
        
        res.status(200).json(boletas);
    } catch (error) {
        console.error("Error al obtener boletas:", error.message);
        res.status(500).json({ error: "Error al cargar el historial de compras." });
    }
};

// 3. Obtener todas las boletas (Solo para Admin)
const obtenerTodasLasBoletas = async (req, res) => {
    try {
        const boletas = await consultas.obtenerTodasLasBoletas();
        res.status(200).json(boletas);
    } catch (error) {
        console.error("Error al obtener boletas:", error.message);
        res.status(500).json({ error: "Error al cargar boletas." });
    }
};

module.exports = { crearBoleta, obtenerMisBoletas, obtenerTodasLasBoletas };