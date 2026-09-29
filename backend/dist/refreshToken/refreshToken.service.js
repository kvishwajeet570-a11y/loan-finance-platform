"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
class RefreshTokenService {
    static async generateRefreshToken(payload) {
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });
        return refreshToken;
    }
    static async verifyRefreshToken(refreshToken) {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        return decoded;
    }
    static async generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15m",
        });
    }
    static async refreshAccessToken(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.isBlocked) {
            throw new Error("Account blocked");
        }
        const accessToken = await this.generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
        };
    }
}
exports.RefreshTokenService = RefreshTokenService;
