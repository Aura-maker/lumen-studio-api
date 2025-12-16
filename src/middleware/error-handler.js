/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🛡️ ERROR HANDLING MIDDLEWARE - PRODUCTION READY
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const winston = require('winston');

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'imparafacile-api' },
  transports: [
    // Errori in file separato
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Tutti i log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// In development, log anche su console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM ERROR CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Non autenticato') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Non autorizzato') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Risorsa') {
    super(`${resource} non trovata`, 404, 'NOT_FOUND');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Troppe richieste, riprova più tardi') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Errore database') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Errore interno del server';
  let code = err.code || 'INTERNAL_ERROR';
  
  // Log dell'errore
  const errorLog = {
    message: err.message,
    code: err.code,
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    body: process.env.NODE_ENV !== 'production' ? req.body : undefined,
    timestamp: new Date().toISOString()
  };
  
  if (statusCode >= 500) {
    logger.error('Server Error', errorLog);
  } else if (statusCode >= 400) {
    logger.warn('Client Error', errorLog);
  }
  
  // Gestione errori specifici
  
  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token non valido';
    code = 'INVALID_TOKEN';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token scaduto';
    code = 'TOKEN_EXPIRED';
  }
  
  // Validation Errors (express-validator)
  if (err.array && typeof err.array === 'function') {
    statusCode = 400;
    message = 'Dati non validi';
    code = 'VALIDATION_ERROR';
  }
  
  // PostgreSQL Errors
  if (err.code === '23505') { // Unique violation
    statusCode = 409;
    message = 'Risorsa già esistente';
    code = 'DUPLICATE_ENTRY';
  }
  
  if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Riferimento non valido';
    code = 'INVALID_REFERENCE';
  }
  
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Servizio temporaneamente non disponibile';
    code = 'SERVICE_UNAVAILABLE';
  }
  
  // Response
  const response = {
    success: false,
    error: {
      code,
      message,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    }
  };
  
  res.status(statusCode).json(response);
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOT FOUND HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Endpoint ${req.method} ${req.path}`);
  next(error);
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC HANDLER WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REQUEST LOGGER
// ═══════════════════════════════════════════════════════════════════════════════

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id
    };
    
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else if (duration > 1000) {
      logger.warn('Slow request', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

// ═══════════════════════════════════════════════════════════════════════════════
// UNHANDLED REJECTION & EXCEPTION HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

const setupGlobalErrorHandlers = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
  });
  
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    // Graceful shutdown
    process.exit(1);
  });
};

module.exports = {
  logger,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  DatabaseError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  requestLogger,
  setupGlobalErrorHandlers
};
