// Middleware for handling 404 errors
const notFound = (req, res, next) => { 
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // pass to next error handler
};

// Middleware for general error handling
const errorHandler = (err, req, res, next) => {
  // Preserve existing status or default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Respond with JSON error
  res.status(statusCode).json({
    message, // shorthand for message: message
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // hide stack in prod
  });
};

// Export middleware
export { notFound, errorHandler };