const pool = require('../database/connection');

// 1. Obtener todos los productos (Para la tienda con su categoría unida)
const getAllProducts = async (req, res) => {
    try {
        // Enlazamos p.id_categoria con c.id_categoria usando estructura real
        const query = `
            SELECT p.*, c.nombre_categoria
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto ASC
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error en getAllProducts:", error.message);
        res.status(500).json({ error: "Error al obtener productos" });
    }
};

// 2. Obtener producto por ID (Para la vista de detalle)
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Este id viene de la URL de la ruta de Express
        const query = `
            SELECT p.*, c.nombre_categoria
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error en getProductById:", error.message);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

// 3. Crear producto (Para el Admin)
const createProduct = async (req, res) => {
    try {
        // Capturamos las propiedades que viajan desde tu formulario de React
        const { nombre_producto, descripcion, imagen_url, precio, id_categoria, marca, stock } = req.body;

        // Mapeamos las variables uno a uno con las columnas exactas de tu Schema.sql
        const query = `
            INSERT INTO productos (nombre_producto, descripcion, imagen, precio, stock, marca, id_categoria) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `;
        
        const values = [
            nombre_producto || "Insumo Médico",
            descripcion || "",
            imagen_url || "", 
            parseFloat(precio) || 0.00,
            parseInt(stock, 10) || 10, 
            marca || "Genérico",
            id_categoria ? parseInt(id_categoria, 10) : null
        ];

        const result = await pool.query(query, values);
        
        return res.status(201).json({
            message: "Producto creado con éxito! 📦",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error en createProduct:", error.message);
        return res.status(500).json({ error: `Error en Base de Datos: ${error.message}` });
    }
};

// 4. ELIMINAR PRODUCTO
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Apuntamos a 'id_producto' como clave primaria real
        const query = `DELETE FROM productos WHERE id_producto = $1 RETURNING *`;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto eliminado correctamente", data: result.rows[0] });
    } catch (error) {
        console.error("Error en deleteProduct:", error.message);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
};

// 5. MODIFICAR PRODUCTO
const modifyProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_producto, descripcion, imagen_url, precio, stock, marca, id_categoria } = req.body;
        
        // Sincronizado completo con las columnas del Schema local
        const query = `
            UPDATE productos 
            SET nombre_producto = $1, descripcion = $2, imagen = $3, precio = $4, stock = $5, marca = $6, id_categoria = $7
            WHERE id_producto = $8 
            RETURNING *
        `;

        const values = [
            nombre_producto || "Insumo Médico",
            descripcion || "",
            imagen_url || "",
            parseFloat(precio) || 0.00, 
            parseInt(stock, 10) || 0, 
            marca || "Genérico",
            id_categoria ? parseInt(id_categoria, 10) : null,
            id
        ];
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado para actualizar" });
        }

        res.status(200).json({ message: "Producto actualizado correctamente", data: result.rows[0] });
    } catch (error) {
        console.error("Error en modifyProduct:", error.message);
        res.status(500).json({ error: `Error al actualizar producto: ${error.message}` });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct,
    modifyProduct
};