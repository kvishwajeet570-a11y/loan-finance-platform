"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbac = void 0;
const rbac = (...allowedRoles) => (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                requiredRoles: allowedRoles,
                currentRole: req.user.role,
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.rbac = rbac;
exports.default = exports.rbac;
