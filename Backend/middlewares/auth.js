const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
      return res.status(401).json({ ok: false, message: "Token no proporcionado en las cabeceras" });
  }

  // Soporta si viene con "Bearer " o si viene el token puro directamente
  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7, authHeader.length).trim();
  }

  if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ ok: false, message: "Token inválido o vacío" });
  }

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