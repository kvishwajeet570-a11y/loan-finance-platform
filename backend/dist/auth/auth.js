"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET || "secret", {
            expiresIn: "7d",
        });
    }
    async register(data) {
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phoneNo: data.phoneNo },
                ],
            },
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNo: data.phoneNo,
                password: hashedPassword,
                role: "user",
            },
        });
        const token = this.generateToken(user);
        return {
            success: true,
            token,
            user,
        };
    }
    async login(email, password) {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        const token = this.generateToken(user);
        return {
            success: true,
            token,
            user,
        };
    }
    async getProfile(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isValid = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            throw new Error("Old password incorrect");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });
        return {
            success: true,
            message: "Password changed successfully",
        };
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
