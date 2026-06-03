const consultas = require('../database/consultas');

// 1. Generar una nueva Boleta (Antes crearOrden)
const crearBoleta = async (req, res) => {
    try {
        const { productos, total } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ 
                error: "No autorizado. No se encontraron datos de usuario en el token." 
            });
        }

        const id_usuario = req.user.id_usuario || req.user.id || req.user.user_id; 

        if (!id_usuario) {
            return res.status(400).json({ 
                error: "No se pudo identificar el ID del usuario dentro del token activo." 
            });
        }

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

// 4. NUEVA FUNCIÓN: Actualizar el estado de una boleta (Para el select del Admin)
const actualizarEstadoBoleta = async (req, res) => {
    try {
        const { cod_boleta } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: "El nuevo estado es requerido." });
        }

        // Llamamos a la consulta SQL que crearemos en el paso 2
        await consultas.actualizarEstadoBoleta(cod_boleta, estado);

        res.status(200).json({ 
            ok: true, 
            message: `Estado de la boleta #${cod_boleta} actualizado a '${estado}' correctamente.` 
        });
    } catch (error) {
        console.error("Error al actualizar estado de la boleta:", error.message);
        res.status(500).json({ error: "Error interno al actualizar el estado." });
    }
};

module.exports = { 
    crearBoleta, 
    obtenerMisBoletas, 
    obtenerTodasLasBoletas, 
    actualizarEstadoBoleta}