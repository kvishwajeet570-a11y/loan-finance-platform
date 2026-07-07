"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const error = {
        success: false,
        statusCode: 404,
        error: "Not Found",
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
    };
    return res.status(404).json(error);
};
exports.default = notFound;
