"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AuthRepository {
    async createUser(data) {
        return prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                phoneNo: data.phoneNo,
                password: data.password,
                otp: data.otp,
                otpExpiry: data.otpExpiry,
                isVerified: false,
                isBlocked: false,
                role: "user",
            },
        });
    }
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async findByPhone(phoneNo) {
        return prisma_1.default.user.findUnique({
            where: { phoneNo },
        });
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            include: {
                wallet: true,
                loans: true,
                referral: true,
            },
        });
    }
    async updateOTP(userId, otp, otpExpiry) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                otp,
                otpExpiry,
            },
        });
    }
    async verifyUser(userId) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });
    }
    async updatePassword(userId, password) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                password,
            },
        });
    }
    async updateRefreshToken(userId, refreshToken) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                refreshToken,
            },
        });
    }
    async clearRefreshToken(userId) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                refreshToken: null,
            },
        });
    }
    async blockUser(userId) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockUser(userId) {
        return prisma_1.default.user.update({
            where: { id: userId },
            data: {
                isBlocked: false,
            },
        });
    }
    async deleteUser(userId) {
        return prisma_1.default.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.default = new AuthRepository();
