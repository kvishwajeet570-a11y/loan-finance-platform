"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class TransactionService {
    /**
     * Create Transaction
     */
    async createTransaction(data) {
        return prisma_1.default.transaction.create({
            data: {
                userId: data.userId,
                amount: data.amount,
                type: data.type,
                category: data.category,
                remark: data.remark,
                referenceId: data.referenceId,
                status: "SUCCESS",
            },
        });
    }
    /**
     * Credit Wallet
     */
    async creditWallet(userId, amount, remark) {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { userId },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "CREDIT",
                    category: "WALLET",
                    remark,
                    status: "SUCCESS",
                },
            });
            return transaction;
        });
    }
    /**
     * Debit Wallet
     */
    async debitWallet(userId, amount, remark) {
        return prisma_1.default.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });
            if (!wallet) {
                throw new Error("Wallet not found");
            }
            if (wallet.balance < amount) {
                throw new Error("Insufficient balance");
            }
            await tx.wallet.update({
                where: { userId },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "DEBIT",
                    category: "WALLET",
                    remark,
                    status: "SUCCESS",
                },
            });
            return transaction;
        });
    }
    /**
     * Loan Disbursement
     */
    async loanDisbursement(userId, loanId, amount) {
        return this.creditWallet(userId, amount, `Loan Disbursement #${loanId}`);
    }
    /**
     * EMI Collection
     */
    async emiCollection(userId, loanId, amount) {
        return this.debitWallet(userId, amount, `EMI Payment #${loanId}`);
    }
    /**
     * Commission Credit
     */
    async commissionCredit(userId, amount) {
        return this.creditWallet(userId, amount, "Commission Credit");
    }
    /**
     * Referral Bonus Credit
     */
    async referralBonus(userId, amount) {
        return this.creditWallet(userId, amount, "Referral Bonus");
    }
    /**
     * Get Transaction By ID
     */
    async getTransactionById(transactionId) {
        return prisma_1.default.transaction.findUnique({
            where: {
                id: transactionId,
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
        });
    }
    /**
     * User Transactions
     */
    async getUserTransactions(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma_1.default.transaction.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    userId,
                },
            }),
        ]);
        return {
            transactions,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * All Transactions
     */
    async getAllTransactions(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma_1.default.transaction.findMany({
                skip,
                take: limit,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.transaction.count(),
        ]);
        return {
            transactions,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Transaction Analytics
     */
    async getTransactionStats() {
        const [totalTransactions, creditTransactions, debitTransactions, totalCredit, totalDebit,] = await Promise.all([
            prisma_1.default.transaction.count(),
            prisma_1.default.transaction.count({
                where: {
                    type: "CREDIT",
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    type: "DEBIT",
                },
            }),
            prisma_1.default.transaction.aggregate({
                where: {
                    type: "CREDIT",
                },
                _sum: {
                    amount: true,
                },
            }),
            prisma_1.default.transaction.aggregate({
                where: {
                    type: "DEBIT",
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalTransactions,
            creditTransactions,
            debitTransactions,
            totalCredit: totalCredit._sum.amount || 0,
            totalDebit: totalDebit._sum.amount || 0,
        };
    }
    /**
     * Monthly Transaction Report
     */
    async monthlyTransactionReport() {
        const year = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_transactions,
      SUM(amount) as total_amount
      FROM "Transaction"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;
    }
    /**
     * Top Earners
     */
    async topEarners() {
        return prisma_1.default.transaction.groupBy({
            by: ["userId"],
            where: {
                type: "CREDIT",
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
            take: 10,
        });
    }
}
exports.default = new TransactionService();
