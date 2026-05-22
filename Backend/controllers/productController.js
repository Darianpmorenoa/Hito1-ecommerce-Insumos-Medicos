const pool = require('../database/connection');

// 1. Obtener todos los productos (Para la tienda)
const getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT * FROM productos 
            ORDER BY id ASC
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
        const { id } = req.params;
        const query = `
            SELECT * FROM productos 
            WHERE id = $1
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
        // Capturamos las variables tal cual vienen de tu formulario en React
        const { nombre_producto, descripcion, imagen_url, precio, id_categoria, marca } = req.body;

        // Normalizamos los nombres exactos alineados con las columnas de Neon
        const precioFinal = parseInt(precio, 10) || 0;
        const stockFinal = parseInt(req.body.stock, 10) || 10; 
        const imagenFinal = imagen_url || ""; 
        const categoriaFinal = id_categoria ? String(id_categoria) : "1";
        const nombreFinal = nombre_producto || "Insumo Médico";
        const descripcionFinal = descripcion || "";
        const marcaFinal = marca || "Genérico";

        // Mapeo uno a uno estricto en el orden de los VALUES
        const query = `
            INSERT INTO productos (precio, stock, imagen_url, categoria, nombre, descripcion, marca) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `;
        
        const values = [
            precioFinal,      
            stockFinal,        
            imagenFinal,       
            categoriaFinal,    
            nombreFinal,       
            descripcionFinal,  
            marcaFinal        
        ];

        const result = await pool.query(query, values);
        
        return res.status(201).json({
            message: "Producto creado con éxito! 📦",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error definitivo en createProduct:", error.message);
        return res.status(500).json({ error: `Error en Neon: ${error.message}` });
    }
};

// 4. ELIMINAR PRODUCTO
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM productos WHERE id = $1 RETURNING *`;
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
        
        const query = `
            UPDATE productos 
            SET precio = $1, stock = $2, imagen_url = $3, categoria = $4, nombre = $5, descripcion = $6, marca = $7
            WHERE id = $8 
            RETURNING *
        `;

        const values = [
            parseInt(precio, 10) || 0, 
            parseInt(stock, 10) || 0, 
            imagen_url || "",
            String(id_categoria),
            nombre_producto || "Insumo Médico",
            descripcion || "",
            marca || "Genérico",
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