const express = require('express');
const productsRouter = express.Router();
const { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    deleteProduct, 
    modifyProduct 
} = require('../controllers/productController');
const { validateToken, verifyAdmin } = require('../middlewares/auth');

// 1. GET GENERAL (Obtener todos los productos)
// Los controladores ya manejan su propio try/catch interno, usó la función directa
productsRouter.get("/", getAllProducts);

// 2. GET POR ID (Obtener un producto específico)
productsRouter.get("/:id", getProductById);

// 3. CREATE PRODUCTO (Crear producto - Solo Admin)
productsRouter.post("/", createProduct);

// 4. DELETE PRODUCTO (Eliminar producto - Solo Admin)
productsRouter.delete("/:id", validateToken, verifyAdmin, deleteProduct);

// 5. UPDATE PRODUCTO (Modificar producto - Solo Admin)
// Esta es la ruta que el botón "Editar" del Frontend va a golpear usando HTTP PUT
productsRouter.put("/:id", validateToken, verifyAdmin, modifyProduct);

module.exports = productsRouter;