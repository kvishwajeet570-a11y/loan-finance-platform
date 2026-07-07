"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permit = void 0;
const permit = (...roles) => (req, res, next) => {
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
                message: "Access Denied",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Permission check failed",
        });
    }
};
exports.permit = permit;
