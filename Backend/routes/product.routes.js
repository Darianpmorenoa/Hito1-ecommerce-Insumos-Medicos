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
productsRouter.get("/", async (req, res, next) => {
    try {
        await getAllProducts(req, res);
    } catch (error) {
        console.error("Error en ruta GET /:", error.message);
        res.status(500).json({ error: "Error interno al obtener los productos." });
    }
});

// 2. GET POR ID (Obtener un producto específico)
productsRouter.get("/:id", async (req, res) => {
    try {
        await getProductById(req, res);
    } catch (error) {
        console.error("Error en ruta GET /:id:", error.message);
        res.status(500).json({ error: "Error interno al obtener el producto." });
    }
});

// 3. CREATE PRODUCTO (Crear producto - Solo Admin)
productsRouter.post("/", async (req, res) => {
    try {
        await createProduct(req, res);
    } catch (error) {
        console.error("Error en ruta POST /:", error.message);
        res.status(500).json({ error: "Error interno al crear el producto." });
    }
});

// 4. DELETE PRODUCTO (Eliminar producto - Solo Admin)
productsRouter.delete("/:id", validateToken, verifyAdmin, async (req, res) => {
    try {
        await deleteProduct(req, res);
    } catch (error) {
        console.error("Error en ruta DELETE /:id:", error.message);
        res.status(500).json({ error: "Error interno al eliminar el producto." });
    }
});

// 5. UPDATE PRODUCTO (Modificar producto - Solo Admin)
productsRouter.put("/:id", validateToken, verifyAdmin, async (req, res) => {
    try {
        await modifyProduct(req, res);
    } catch (error) {
        console.error("Error en ruta PUT /:id:", error.message);
        res.status(500).json({ error: "Error interno al actualizar el producto." });
    }
});

module.exports = productsRouter;