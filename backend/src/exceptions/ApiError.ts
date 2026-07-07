/* ========================================
   API ERROR CLASS
======================================== */

export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: any[];
  public stackTrace?: string;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stackTrace = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/* ========================================
   COMMON ERROR HELPERS
======================================== */

export class BadRequestError extends ApiError {
  constructor(
    message = "Bad Request",
    errors: any[] = []
  ) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = "Unauthorized Access"
  ) {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    message = "Forbidden Access"
  ) {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message = "Resource Not Found"
  ) {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(
    message = "Resource Conflict"
  ) {
    super(409, message);
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = "Validation Failed",
    errors: any[] = []
  ) {
    super(422, message, errors);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    message = "Internal Server Error"
  ) {
    super(500, message);
  }
}