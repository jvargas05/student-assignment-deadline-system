// 404 for any route that does not exist
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Never sends stack traces or DB details to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Mongoose validation errors -> 400
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) =>
      e.name === 'CastError' ? `${e.path} has an invalid value` : e.message
    );
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Bad ObjectId or bad value type -> 400
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }

  // Malformed JSON body -> 400
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  // Anything else -> 500 (details are logged on the server only)
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
