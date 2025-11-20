
/**
 * Standardized API response utility functions
 */
export function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}

export function paginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  });
}

export function created(res, data, message = 'Resource created successfully') {
  return success(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}

export function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

export function unauthorized(res, message = 'Unauthorized access') {
  return error(res, message, 401);
}

export function forbidden(res, message = 'Forbidden access') {
  return error(res, message, 403);
}

export function validationError(res, errors, message = 'Validation failed') {
  return error(res, message, 400, errors);
}