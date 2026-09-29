"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class BankRepository {
    /* =========================
       CREATE BANK ACCOUNT
    ========================= */
    static async createBankAccount(data) {
        return prisma_1.default.bankAccount.create({
            data: {
                userId: data.userId,
                accountHolderName: data.accountHolderName,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                ifscCode: data.ifscCode,
                branchName: data.branchName,
            },
        });
    }
    /* =========================
       GET USER BANKS
    ========================= */
    static async getUserBankAccounts(userId) {
        return prisma_1.default.bankAccount.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================
       GET BANK BY ID
    ========================= */
    static async getBankById(bankId) {
        return prisma_1.default.bankAccount.findUnique({
            where: {
                id: bankId,
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
        });
    }
    /* =========================
       VERIFY BANK ACCOUNT
    ========================= */
    static async verifyBankAccount(bankId) {
        return prisma_1.default.bankAccount.update({
            where: {
                id: bankId,
            },
            data: {
                verificationStatus: "VERIFIED",
                rejectionReason: null,
                verifiedAt: new Date(),
            },
        });
    }
    /* =========================
       REJECT BANK ACCOUNT
    ========================= */
    static async rejectBankAccount(bankId, reason) {
        return prisma_1.default.bankAccount.update({
            where: {
                id: bankId,
            },
            data: {
                verificationStatus: "REJECTED",
                rejectionReason: reason,
                verifiedAt: null,
            },
        });
    }
    /* =========================
       SET PRIMARY ACCOUNT
    ========================= */
    static async setPrimaryAccount(userId, bankId) {
        await prisma_1.default.bankAccount.updateMany({
            where: {
                userId,
            },
            data: {
                isPrimary: false,
            },
        });
        return prisma_1.default.bankAccount.update({
            where: {
                id: bankId,
            },
            data: {
                isPrimary: true,
            },
        });
    }
    /* =========================
       UPDATE BANK ACCOUNT
    ========================= */
    static async updateBankAccount(bankId, data) {
        return prisma_1.default.bankAccount.update({
            where: {
                id: bankId,
            },
            data,
        });
    }
    /* =========================
       DELETE ACCOUNT
    ========================= */
    static async deleteBankAccount(bankId) {
        return prisma_1.default.bankAccount.delete({
            where: {
                id: bankId,
            },
        });
    }
    /* =========================
       SEARCH ACCOUNT
    ========================= */
    static async searchAccounts(search) {
        return prisma_1.default.bankAccount.findMany({
            where: {
                OR: [
                    {
                        accountHolderName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        bankName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        accountNumber: {
                            contains: search,
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================
       ADMIN ALL BANKS
    ========================= */
    static async getAllBankAccounts(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [accounts, total] = await Promise.all([
            prisma_1.default.bankAccount.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma_1.default.bankAccount.count(),
        ]);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            accounts,
        };
    }
    /* =========================
       BANK ANALYTICS
    ========================= */
    static async getBankAnalytics() {
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
}
exports.BankRepository = BankRepository;
