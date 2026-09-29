"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BankService {
    async getBanks({ page = 1, limit = 20, search = "", status = "", }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    bankName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    accountHolderName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    ifscCode: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (status) {
            where.verificationStatus = status;
        }
        const [data, total] = await Promise.all([
            prisma_1.default.bankAccount.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phoneNo: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma_1.default.bankAccount.count({ where }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getBankById(id) {
        return prisma_1.default.bankAccount.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    async createBank(data) {
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
    async updateBank(id, data) {
        if (data.isPrimary) {
            const account = await prisma_1.default.bankAccount.findUnique({
                where: { id },
            });
            if (account) {
                await prisma_1.default.bankAccount.updateMany({
                    where: {
                        userId: account.userId,
                    },
                    data: {
                        isPrimary: false,
                    },
                });
            }
        }
        return prisma_1.default.bankAccount.update({
            where: { id },
            data,
        });
    }
    async deleteBank(id) {
        return prisma_1.default.bankAccount.delete({
            where: { id },
        });
    }
    async verifyBankAccount(id) {
        return prisma_1.default.bankAccount.update({
            where: { id },
            data: {
                verificationStatus: "VERIFIED",
                verifiedAt: new Date(),
            },
        });
    }
    async rejectBankAccount(id, reason) {
        return prisma_1.default.bankAccount.update({
            where: { id },
            data: {
                verificationStatus: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
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
    async getBankAnalytics() {
        const [totalAccounts, verifiedAccounts, pendingAccounts, rejectedAccounts, primaryAccounts,] = await Promise.all([
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
            prisma_1.default.bankAccount.count({
                where: {
                    isPrimary: true,
                },
            }),
        ]);
        return {
            totalAccounts,
            verifiedAccounts,
            pendingAccounts,
            rejectedAccounts,
            primaryAccounts,
        };
    }
    // ========================================
    // GET USER BANK ACCOUNTS
    // ========================================
    async getUserBankAccounts(userId) {
        return prisma_1.default.bankAccount.findMany({
            where: {
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                    },
                },
            },
            orderBy: [
                {
                    isPrimary: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
        });
    }
}
exports.default = new BankService();
