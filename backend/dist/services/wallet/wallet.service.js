"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class WalletService {
    /**
     * Create Wallet
     */
    async createWallet(userId) {
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { userId },
        });
        if (wallet) {
            return wallet;
        }
        return prisma_1.default.wallet.create({
            data: {
                userId,
                balance: 0,
            },
        });
    }
    /**
     * Get Wallet
     */
    async getWallet(userId) {
        return prisma_1.default.wallet.findUnique({
            where: { userId },
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
     * Credit Wallet
     */
    async creditWallet(userId, amount, remark, category = "WALLET") {
        return prisma_1.default.$transaction(async (tx) => {
            await tx.wallet.upsert({
                where: { userId },
                update: {
                    balance: {
                        increment: amount,
                    },
                },
                create: {
                    userId,
                    balance: amount,
                },
            });
            await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "CREDIT",
                    category,
                    remark,
                    status: "SUCCESS",
                },
            });
            return tx.wallet.findUnique({
                where: { userId },
            });
        });
    }
    /**
     * Debit Wallet
     */
    async debitWallet(userId, amount, remark, category = "WALLET") {
        return prisma_1.default.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });
            if (!wallet) {
                throw new Error("Wallet not found");
            }
            if (wallet.balance < amount) {
                throw new Error("Insufficient wallet balance");
            }
            await tx.wallet.update({
                where: { userId },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });
            await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "DEBIT",
                    category,
                    remark,
                    status: "SUCCESS",
                },
            });
            return tx.wallet.findUnique({
                where: { userId },
            });
        });
    }
    /**
     * Transfer Wallet Balance
     */
    async transferBalance(senderId, receiverId, amount) {
        return prisma_1.default.$transaction(async (tx) => {
            const sender = await tx.wallet.findUnique({
                where: {
                    userId: senderId,
                },
            });
            if (!sender) {
                throw new Error("Sender wallet not found");
            }
            if (sender.balance < amount) {
                throw new Error("Insufficient balance");
            }
            await tx.wallet.update({
                where: {
                    userId: senderId,
                },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });
            await tx.wallet.upsert({
                where: {
                    userId: receiverId,
                },
                update: {
                    balance: {
                        increment: amount,
                    },
                },
                create: {
                    userId: receiverId,
                    balance: amount,
                },
            });
            await tx.transaction.createMany({
                data: [
                    {
                        userId: senderId,
                        amount,
                        type: "DEBIT",
                        category: "TRANSFER",
                        remark: "Wallet Transfer Sent",
                        status: "SUCCESS",
                    },
                    {
                        userId: receiverId,
                        amount,
                        type: "CREDIT",
                        category: "TRANSFER",
                        remark: "Wallet Transfer Received",
                        status: "SUCCESS",
                    },
                ],
            });
            return {
                success: true,
                amount,
            };
        });
    }
    /**
     * Loan Disbursement
     */
    async loanDisbursement(userId, loanId, amount) {
        return this.creditWallet(userId, amount, `Loan Disbursed #${loanId}`, "LOAN");
    }
    /**
     * EMI Collection
     */
    async payEMI(userId, loanId, amount) {
        return this.debitWallet(userId, amount, `EMI Payment #${loanId}`, "EMI");
    }
    /**
     * Referral Bonus
     */
    async referralBonus(userId, amount) {
        return this.creditWallet(userId, amount, "Referral Bonus", "REFERRAL");
    }
    /**
     * Commission Credit
     */
    async commissionCredit(userId, amount) {
        return this.creditWallet(userId, amount, "Commission Earned", "COMMISSION");
    }
    /**
     * Recharge Debit
     */
    async rechargePayment(userId, amount) {
        return this.debitWallet(userId, amount, "Recharge Payment", "RECHARGE");
    }
    /**
     * Wallet Statement
     */
    async walletStatement(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            prisma_1.default.transaction.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.transaction.count({
                where: { userId },
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
     * Wallet Analytics
     */
    async walletAnalytics() {
        const [totalWallets, totalBalance, activeWallets,] = await Promise.all([
            prisma_1.default.wallet.count(),
            prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            }),
            prisma_1.default.wallet.count({
                where: {
                    balance: {
                        gt: 0,
                    },
                },
            }),
        ]);
        return {
            totalWallets,
            activeWallets,
            totalBalance: totalBalance._sum
                .balance || 0,
        };
    }
    /**
     * Top Wallet Holders
     */
    async topWalletUsers() {
        return prisma_1.default.wallet.findMany({
            take: 10,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                balance: "desc",
            },
        });
    }
    /**
     * Recent Wallet Transactions
     */
    async recentTransactions() {
        return prisma_1.default.transaction.findMany({
            take: 20,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.default = new WalletService();
