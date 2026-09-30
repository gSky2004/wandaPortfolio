const { Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'portfolio_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

const pool = new Pool({
  ...config,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 5000,
  idleTimeoutMillis: 30000,
  statement_timeout: Number(process.env.DB_STATEMENT_TIMEOUT_MS) || 15000,
  max: Number(process.env.DB_POOL_MAX) || 10,
});

let poolErrorLogged = false;

pool.on('error', (err) => {
  if (!poolErrorLogged) {
    poolErrorLogged = true;
    console.error(`[db] Unexpected PostgreSQL error: ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
      console.error(`[db] Could not reach PostgreSQL at ${config.host}:${config.port}.`);
      console.error('[db] Start it with `docker compose up -d db`, then restart the API.');
    }
  }
});

const query = (text, params) => pool.query(text, params);

const verifyConnection = async () => {
  try {
    await pool.query('SELECT 1');
    poolErrorLogged = false;
    return true;
  } catch (err) {
    console.error(`[db] Connection test failed: ${err.message}`);
    return false;
  }
};

module.exports = { query, pool, verifyConnection, config };
