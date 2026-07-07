"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissionMiddleware = (...requiredPermissions) => (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const userPermissions = req.user.permissions || [];
        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Permission denied",
                requiredPermissions,
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = permissionMiddleware;
