"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const roleGuard = (...roles) => (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Role authorization failed",
        });
    }
};
exports.roleGuard = roleGuard;
