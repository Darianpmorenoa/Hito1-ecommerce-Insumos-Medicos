const consultas = require('../database/consultas');

// 1. Generar una nueva Boleta (Antes crearOrden)
const crearBoleta = async (req, res) => {
    try {
        const { productos, total } = req.body;
        
        // Validamos que req.user exista gracias al middleware auth.js
        if (!req.user) {
            return res.status(401).json({ 
                error: "No autorizado. No se encontraron datos de usuario en el token." 
            });
        }

        // Rescatamos cualquier variante válida de ID que traiga el token decodificado
        const id_usuario = req.user.id_usuario || req.user.id || req.user.user_id; 

        if (!id_usuario) {
            return res.status(400).json({ 
                error: "No se pudo identificar el ID del usuario dentro del token activo." 
            });
        }

        // Enviamos el id_usuario limpio directamente a tu función SQL de Neon
        const nuevaBoleta = await consultas.generarBoleta(id_usuario, productos, total);
        
        res.status(201).json({
            ok: true,
            message: "¡Venta registrada con éxito! 🧾",
            boleta: nuevaBoleta
        });
    } catch (error) {
        console.error("Error al generar boleta en el controlador:", error.message);
        res.status(500).json({ error: "No se pudo procesar la boleta de compra." });
    }
};

// 2. Obtener historial de boletas (Antes obtenerMisOrdenes)
const obtenerMisBoletas = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "No autorizado." });
        }

        const id_usuario = req.user.id_usuario || req.user.id || req.user.user_id;
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