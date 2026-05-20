const { Pool } = require('pg');
require('dotenv').config();

// Cambiado a DATABASE_URL para que coincida exactamente con Render
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL no está definida");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Probar conexión
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Conexión exitosa a Neon');
  })
  .catch((err) => {
    console.error('❌ Error conectando a Neon:', err);
  });

module.exports = pool;