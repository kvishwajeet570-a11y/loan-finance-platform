"use strict";
/* ========================================
   API ERROR CLASS
======================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stackTrace = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
/* ========================================
   COMMON ERROR HELPERS
======================================== */
class BadRequestError extends ApiError {
    constructor(message = "Bad Request", errors = []) {
        super(400, message, errors);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized Access") {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = "Forbidden Access") {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends ApiError {
    constructor(message = "Resource Not Found") {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends ApiError {
    constructor(message = "Resource Conflict") {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
class ValidationError extends ApiError {
    constructor(message = "Validation Failed", errors = []) {
        super(422, message, errors);
    }
}
exports.ValidationError = ValidationError;
class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error") {
        super(500, message);
    }
}
exports.InternalServerError = InternalServerError;
