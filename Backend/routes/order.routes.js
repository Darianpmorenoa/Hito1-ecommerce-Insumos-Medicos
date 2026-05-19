const express = require('express');
const router = express.Router();
const { crearBoleta, obtenerMisBoletas, obtenerTodasLasBoletas } = require('../controllers/orderController');
const { validateToken, verifyAdmin } = require('../middlewares/auth');

// Rutas para órdenes (boletas)
router.post('/', validateToken, crearBoleta);

// Obtener historial de boletas del usuario logueado
router.get('/', validateToken, obtenerMisBoletas);

// Obtener todas las boletas (Solo para Admin)
router.get('/todas', validateToken, verifyAdmin, obtenerTodasLasBoletas);

module.exports = router;