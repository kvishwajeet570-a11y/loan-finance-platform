"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class BankRepository {
    /* =========================
        CREATE BANK ACCOUNT
    ========================= */
    static async createBankAccount(data) {
        return prisma_1.prisma.bankAccount.create({
            data
        });
    }
    /* =========================
        GET USER BANKS
    ========================= */
    static async getUserBankAccounts(userId) {
        return prisma_1.prisma.bankAccount.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        GET BANK BY ID
    ========================= */
    static async getBankById(bankId) {
        return prisma_1.prisma.bankAccount.findUnique({
            where: {
                id: bankId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true
                    }
                }
            }
        });
    }
    /* =========================
        VERIFY BANK ACCOUNT
    ========================= */
    static async verifyBankAccount(bankId, pennyDropRef) {
        return prisma_1.prisma.bankAccount.update({
            where: {
                id: bankId
            },
            data: {
                isVerified: true,
                pennyDropRef
            }
        });
    }
    /* =========================
        SET PRIMARY ACCOUNT
    ========================= */
    static async setPrimaryAccount(userId, bankId) {
        await prisma_1.prisma.bankAccount.updateMany({
            where: {
                userId
            },
            data: {
                isPrimary: false
            }
        });
        return prisma_1.prisma.bankAccount.update({
            where: {
                id: bankId
            },
            data: {
                isPrimary: true
            }
        });
    }
    /* =========================
        UPDATE BANK ACCOUNT
    ========================= */
    static async updateBankAccount(bankId, data) {
        return prisma_1.prisma.bankAccount.update({
            where: {
                id: bankId
            },
            data
        });
    }
    /* =========================
        DELETE ACCOUNT
    ========================= */
    static async deleteBankAccount(bankId) {
        return prisma_1.prisma.bankAccount.delete({
            where: {
                id: bankId
            }
        });
    }
    /* =========================
        SEARCH ACCOUNT
    ========================= */
    static async searchAccounts(search) {
        return prisma_1.prisma.bankAccount.findMany({
            where: {
                OR: [
                    {
                        accountHolder: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        bankName: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        accountNumber: {
                            contains: search
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        ADMIN ALL BANKS
    ========================= */
    static async getAllBankAccounts(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [accounts, total] = await Promise.all([
            prisma_1.prisma.bankAccount.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma_1.prisma.bankAccount.count()
        ]);
        return {
            total,
            page,
            limit,
            accounts
        };
    }
    /* =========================
        BANK ANALYTICS
    ========================= */
    static async getBankAnalytics() {
        const [totalAccounts, verifiedAccounts, pendingAccounts, primaryAccounts] = await Promise.all([
            prisma_1.prisma.bankAccount.count(),
            prisma_1.prisma.bankAccount.count({
                where: {
                    isVerified: true
                }
            }),
            prisma_1.prisma.bankAccount.count({
                where: {
                    isVerified: false
                }
            }),
            prisma_1.prisma.bankAccount.count({
                where: {
                    isPrimary: true
                }
            })
        ]);
        return {
            totalAccounts,
            verifiedAccounts,
            pendingAccounts,
            primaryAccounts
        };
    }
}
exports.BankRepository = BankRepository;
