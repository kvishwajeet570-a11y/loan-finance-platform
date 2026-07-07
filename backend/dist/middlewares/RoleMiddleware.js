"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (...allowedRoles) => (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                role: userRole,
                allowedRoles,
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = roleMiddleware;
