const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken, verifyAdmin } = require('../middlewares/auth');

// 1. Registro de nuevos usuarios (Público)
router.post('/registrar', userController.registrarUsuario);

// 2. Obtener datos del usuario logueado (Privado - Requiere Token)
router.get('/perfil', validateToken, userController.obtenerPerfil);

// 3. Ver todos los usuarios (Privado - Solo para pruebas o Admin)
router.get('/', validateToken, verifyAdmin, userController.obtenerUsuarios);

// 4. Login de usuarios (Público)
router.post('/login', userController.loginUsuario);
// 5. Actualizar datos de despacho del usuario logueado (Privado)
router.put('/perfil', validateToken, userController.actualizarPerfil);

module.exports = router;