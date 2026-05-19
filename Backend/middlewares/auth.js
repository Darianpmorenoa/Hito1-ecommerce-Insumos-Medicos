const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, message: "Token no proporcionado" });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Token inválido o expirado" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ ok: false, message: "Token no proporcionado" });
  if (req.user.rol !== 'admin') return res.status(403).json({ ok: false, message: "No tienes permisos" });
  next();
};

module.exports = { validateToken, verifyAdmin };