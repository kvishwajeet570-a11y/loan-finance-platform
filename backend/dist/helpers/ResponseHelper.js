"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, message, statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
exports.errorResponse = errorResponse;
const paginatedResponse = (res, message, data, pagination, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination,
    });
};
exports.paginatedResponse = paginatedResponse;
