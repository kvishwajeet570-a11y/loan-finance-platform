"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET ||
            "secret");
        req.userId =
            decoded.id;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};
exports.default = authMiddleware;
