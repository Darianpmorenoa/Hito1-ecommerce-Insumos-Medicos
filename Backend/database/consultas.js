const pool = require('./connection');
const bcrypt = require('bcryptjs');

const registrarUsuario = async (usuario) => {
    const { nombre, apellido, email, password, rut, telefono, region, comuna } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    const values = [nombre, apellido, email, passwordEncriptada, rut, telefono, region, comuna];
    const consulta = "INSERT INTO usuarios (nombre, apellido, email, password, rut, telefono, region, comuna) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const { rows } = await pool.query(consulta, values);
    return rows[0];
};

const obtenerUsuarioPorEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(consulta, [email]);
    return rows[0];
};

const obtenerPerfilUsuario = async (email) => {
    const consulta = "SELECT nombre, apellido, email, rut, telefono, region, comuna FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(consulta, [email]);
    return rows[0];
};

const obtenerUsuarios = async () => {
    const consulta = "SELECT id_usuario, nombre, apellido, email, rut, telefono, rol FROM usuarios";
    const { rows } = await pool.query(consulta);
    return rows;
};

const obtenerProductos = async () => {
    const consulta = "SELECT id_producto, nombre_producto, precio, imagen, descripcion, stock, marca, id_categoria FROM productos";
    const { rows } = await pool.query(consulta);
    return rows;
};

const obtenerProductoPorId = async (id) => {
    const consulta = "SELECT * FROM productos WHERE id_producto = $1";
    const { rows } = await pool.query(consulta, [id]);
    return rows[0];
};

const generarBoleta = async (id_usuario, productos, total, metodo_pago = 'tarjeta') => {
    // 1. Crear boleta
    const consultaBoleta = 
    ` INSERT INTO boletas (id_usuario, fecha, total, estado, metodo_pago) VALUES ($1, NOW(), $2, 'completado', $3) RETURNING * `;

    const { rows } = await pool.query(
        consultaBoleta,
        [id_usuario, total, metodo_pago]
    );

    const nuevaBoleta = rows[0];

    for (const producto of productos) {
        const consultaDetalle = `INSERT INTO detalle_boleta (cod_boleta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) `;

        await pool.query(
            consultaDetalle,
            [
                nuevaBoleta.cod_boleta,
                producto.id_producto,
                producto.cantidad,
                producto.precio
            ]
        );
       
        await pool.query(`UPDATE productos SET stock = stock - $1 WHERE id_producto = $2 `,
            [
                producto.cantidad,
                producto.id_producto
            ]
        );
    }

    return nuevaBoleta;
};

const obtenerBoletasPorUsuario = async (id_usuario) => {
    const consulta = "SELECT * FROM boletas WHERE id_usuario = $1 ORDER BY cod_boleta DESC";
    const { rows } = await pool.query(consulta, [id_usuario]);
    return rows;
};

const obtenerTodasLasBoletas = async () => {
    const consulta = `
        SELECT b.cod_boleta, b.fecha, b.total, b.estado, b.metodo_pago,
               u.nombre, u.apellido, u.email
        FROM boletas b
        JOIN usuarios u ON b.id_usuario = u.id_usuario
        ORDER BY b.cod_boleta DESC
    `;
    const { rows } = await pool.query(consulta);
    return rows;
};

const actualizarEstadoBoleta = async (cod_boleta, estado) => {
    const consulta = "UPDATE boletas SET estado = $1 WHERE cod_boleta = $2 RETURNING *;";
    const valores = [estado, cod_boleta];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
};
const actualizarStockProducto = async (id_producto, nuevoStock) => {
    const consulta = "UPDATE productos SET stock = $1 WHERE id_producto = $2 RETURNING *;";
    const { rows } = await pool.query(consulta, [nuevoStock, id_producto]);
    return rows[0];
};

module.exports = {
    registrarUsuario,
    obtenerUsuarioPorEmail,
    obtenerPerfilUsuario,
    obtenerUsuarios,
    obtenerProductos,
    obtenerProductoPorId,
    generarBoleta,
    obtenerBoletasPorUsuario,
    obtenerTodasLasBoletas,
    actualizarEstadoBoleta,
    actualizarStockProducto
};