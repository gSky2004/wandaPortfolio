const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorHandler');
const { pool, verifyConnection, config: dbConfig } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const messageRoutes = require('./routes/messageRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || undefined;

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (req, res) => {
  const dbUp = await verifyConnection();
  res.status(dbUp ? 200 : 503).json({
    success: dbUp,
    message: dbUp ? 'Portfolio API is running' : 'API is running but PostgreSQL is unreachable',
    database: dbUp ? 'connected' : 'unreachable',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const installProcessGuards = () => {
  process.on('unhandledRejection', (reason) => {
    console.error('[process] Unhandled promise rejection (request will fail, server stays up):');
    console.error(reason instanceof Error ? reason.stack : reason);
  });

  process.on('uncaughtException', (err) => {
    console.error('[process] Uncaught exception (server stays up, state may be inconsistent):');
    console.error(err.stack || err.message);
  });
};

const reportListenError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[server] Port ${PORT} is already in use (EADDRINUSE).`);
    console.error('[server] Another process owns that port. On Windows:');
    console.error(`[server]   netstat -ano | findstr :${PORT}`);
    console.error('[server]   taskkill /PID <pid> /F');
    console.error(`[server] Or set PORT in backend/.env and match the`);
    console.error(`[server] frontend/vite.config.js proxy target to the same port.\n`);
    process.exit(1);
  }

  console.error(`[server] Fatal listen error (${err.code}): ${err.message}`);
  process.exit(1);
};

const start = async () => {
  installProcessGuards();

  const dbUp = await verifyConnection();
  if (!dbUp) {
    console.error(`[server] PostgreSQL not reachable at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    console.error('[server] Starting anyway - requests needing the database will fail.');
    console.error('[server] Fix with: docker compose up -d db   (or start your local PostgreSQL)');
    console.error('[server] Then run: npm run db:init && npm run seed\n');
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
    console.log(`[server] Database: ${dbUp ? 'connected' : 'UNREACHABLE'}`);
  });

  server.on('error', reportListenError);
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n[server] ${signal} received, shutting down.`);
    server.close(async () => {
      await pool.end().catch(() => {});
      console.log('[server] Shutdown complete.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('[server] Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return server;
};

if (require.main === module) {
  start();
}

module.exports = { app, start };
