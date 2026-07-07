"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BankService {
    /**
     * Add Bank Account
     */
    async addBankAccount(data) {
        const existing = await prisma_1.default.bankAccount.findFirst({
            where: {
                userId: data.userId,
                accountNumber: data.accountNumber,
            },
        });
        if (existing) {
            throw new Error("Bank account already exists");
        }
        if (data.isPrimary) {
            await prisma_1.default.bankAccount.updateMany({
                where: {
                    userId: data.userId,
                },
                data: {
                    isPrimary: false,
                },
            });
        }
        return prisma_1.default.bankAccount.create({
            data: {
                ...data,
                verificationStatus: "PENDING",
            },
        });
    }
    /**
     * Get User Banks
     */
    async getUserBankAccounts(userId) {
        return prisma_1.default.bankAccount.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get Single Bank
     */
    async getBankAccountById(id) {
        return prisma_1.default.bankAccount.findUnique({
            where: { id },
        });
    }
    /**
     * Verify Bank
     */
    async verifyBankAccount(id) {
        return prisma_1.default.bankAccount.update({
            where: { id },
            data: {
                verificationStatus: "VERIFIED",
                verifiedAt: new Date(),
            },
        });
    }
    /**
     * Reject Bank
     */
    async rejectBankAccount(id, reason) {
        return prisma_1.default.bankAccount.update({
            where: { id },
            data: {
                verificationStatus: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * Set Primary Account
     */
    async setPrimaryAccount(userId, bankId) {
        await prisma_1.default.bankAccount.updateMany({
            where: { userId },
            data: {
                isPrimary: false,
            },
        });
        return prisma_1.default.bankAccount.update({
            where: { id: bankId },
            data: {
                isPrimary: true,
            },
        });
    }
    /**
     * Delete Bank
     */
    async deleteBankAccount(id) {
        return prisma_1.default.bankAccount.delete({
            where: { id },
        });
    }
    /**
     * Admin Pending Verification
     */
    async getPendingVerificationAccounts() {
        return prisma_1.default.bankAccount.findMany({
            where: {
                verificationStatus: "PENDING",
            },
            include: {
                user: true,
            },
        });
    }
    /**
     * Search Accounts
     */
    async searchAccounts(keyword) {
        return prisma_1.default.bankAccount.findMany({
            where: {
                OR: [
                    {
                        bankName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        accountHolderName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        ifscCode: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
    }
    /**
     * Bank Statistics
     */
    async getBankStats() {
        const [totalAccounts, verifiedAccounts, pendingAccounts, rejectedAccounts,] = await Promise.all([
            prisma_1.default.bankAccount.count(),
            prisma_1.default.bankAccount.count({
                where: {
                    verificationStatus: "VERIFIED",
                },
            }),
            prisma_1.default.bankAccount.count({
                where: {
                    verificationStatus: "PENDING",
                },
            }),
            prisma_1.default.bankAccount.count({
                where: {
                    verificationStatus: "REJECTED",
                },
            }),
        ]);
        return {
            totalAccounts,
            verifiedAccounts,
            pendingAccounts,
            rejectedAccounts,
        };
    }
}
exports.default = new BankService();
