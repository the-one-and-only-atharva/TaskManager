export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  };

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = {
          message: 'A record with this information already exists',
          status: 409,
        };
        break;
      case '23503': // Foreign key violation
        error = {
          message: 'Referenced record does not exist',
          status: 400,
        };
        break;
      case '23514': // Check violation
        error = {
          message: 'Invalid data provided',
          status: 400,
        };
        break;
      default:
        error = {
          message: 'Database error occurred',
          status: 500,
        };
    }
  }

  // Validation errors
  if (err.isJoi) {
    error = {
      message: 'Validation error',
      status: 400,
      details: err.details.map(detail => detail.message),
    };
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};