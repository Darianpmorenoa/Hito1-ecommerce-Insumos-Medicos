const consultas = require('../database/consultas'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    try {
        const usuario = req.body; 
        
        // Lógica para registrar en la base de datos 
        await consultas.registrarUsuario(usuario); 
        
        // Unificamos a JSON para mantener la consistencia
        res.status(201).json({ message: "Usuario registrado con éxito ✅" });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN REGISTRO:", error);
        res.status(500).json({ error: "Error al registrar usuario: " + error.message });
    }
};

// 2. Función para inicio de sesión (Login)
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario en la BD
        const usuario = await consultas.obtenerUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // 2. Comparar password con bcrypt
        const passwordValida = bcrypt.compareSync(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // 3. Generar JWT (Guardamos de ambas formas para máxima compatibilidad)
        const token = jwt.sign(
            { 
                id: usuario.id_usuario, 
                id_usuario: usuario.id_usuario, 
                email: usuario.email, 
                rol: usuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN LOGIN:", error);
        res.status(500).json({ error: "Error interno en el servidor durante el inicio de sesión." });
    }
};

// 3. Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await consultas.obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN OBTENER USUARIOS:", error);
        res.status(500).json({ error: "Error en el servidor al cargar usuarios." });
    }
};

// 4. Obtener perfil del usuario logueado
const obtenerPerfil = async (req, res) => {
    try {
        // El email viene del token que decodificamos en el middleware auth.js
        const { email } = req.user; 
        const usuario = await consultas.obtenerPerfilUsuario(email);
        
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN OBTENER PERFIL:", error);
        res.status(500).json({ error: "Error al obtener el perfil del usuario." });
    }
};

module.exports = { 
    registrarUsuario, 
    loginUsuario,  
    obtenerUsuarios, 
    obtenerPerfil 
};