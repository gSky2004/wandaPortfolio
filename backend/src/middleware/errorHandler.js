const DB_UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ETIMEDOUT',
  '57P01',
  '57P02',
  '57P03',
  '53300',
]);

const describe = (err) => {
  if (DB_UNAVAILABLE_CODES.has(err.code)) {
    return {
      statusCode: 503,
      message: 'Database is unavailable. Please try again shortly.',
    };
  }
  if (err.code === '23505') {
    return { statusCode: 409, message: 'A record with those values already exists.' };
  }
  if (err.code === '23503') {
    return { statusCode: 400, message: 'Referenced record does not exist.' };
  }
  if (err.code === '22P02') {
    return { statusCode: 400, message: 'Malformed value supplied for one of the fields.' };
  }
  return { statusCode: err.statusCode || 500, message: err.message || 'Internal server error' };
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const { statusCode, message } = describe(err);

  if (statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl} -> ${statusCode}`);
    console.error(err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
