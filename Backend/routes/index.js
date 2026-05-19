const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const categoryRoutes = require('./category.routes');

router.use('/usuarios', userRoutes);
router.use('/productos', productRoutes);
router.use('/ordenes', orderRoutes);
router.use('/categorias', categoryRoutes);

module.exports = router;