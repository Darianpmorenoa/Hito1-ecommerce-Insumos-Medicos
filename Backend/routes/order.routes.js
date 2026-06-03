const express = require('express');
const router = express.Router();
// 1. Agregamos 'actualizarEstadoBoleta'
const { crearBoleta, obtenerMisBoletas, obtenerTodasLasBoletas, actualizarEstadoBoleta } = require('../controllers/orderController');
const { validateToken, verifyAdmin } = require('../middlewares/auth');

// Rutas para órdenes (boletas)
router.post('/', validateToken, crearBoleta);

// Obtener historial de boletas del usuario logueado
router.get('/', validateToken, obtenerMisBoletas);

// Obtener todas las boletas (Solo para Admin)
router.get('/todas', validateToken, verifyAdmin, obtenerTodasLasBoletas);

router.put('/actualizar-estado/:cod_boleta', validateToken, verifyAdmin, actualizarEstadoBoleta);

module.exports = router;