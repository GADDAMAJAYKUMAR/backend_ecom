const AppError = require('../utils/AppError');
const messages = require('../constants/messages');


const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(e => e.message);
  const message = `Validation error: ${errors.join('. ')}`;
  return new AppError(message, 400);
};


const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0].path;
  const message = `${field} already exists`;
  return new AppError(message, 400);
};


const handleJWTError = () => {
  return new AppError(messages.ERROR.INVALID_TOKEN, 401);
};

const handleJWTExpiredError = () => {
  return new AppError(messages.ERROR.TOKEN_EXPIRED, 401);
};


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};


const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: messages.ERROR.INTERNAL_SERVER
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'SequelizeValidationError') {
      error = handleSequelizeValidationError(err);
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      error = handleSequelizeUniqueConstraintError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
