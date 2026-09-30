const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function initDb() {
  const dbName = process.env.DB_NAME || 'portfolio_db';
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
    ssl,
  });

  try {
    await adminClient.connect();
    const exists = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (exists.rows.length === 0) {
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`Created database: ${dbName}`);
    } else {
      console.log(`Database already exists: ${dbName}`);
    }
  } finally {
    await adminClient.end();
  }

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: dbName,
    ssl,
  });

  try {
    await client.connect();
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('Schema applied successfully.');
  } finally {
    await client.end();
  }
}

initDb()
  .then(() => {
    console.log('Database initialization complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database init failed:', err.message);
    console.error('Make sure PostgreSQL is running and credentials in .env are correct.');
    process.exit(1);
  });
