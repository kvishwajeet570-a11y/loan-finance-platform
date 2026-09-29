"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveWalletActivities = exports.bulkDeleteWallets = exports.bulkUnfreezeWallets = exports.bulkFreezeWallets = exports.bulkDebitWallets = exports.bulkCreditWallets = exports.getWalletAuditLogs = exports.exportWalletPdf = exports.exportWalletExcel = exports.searchWallets = exports.getWalletReferrals = exports.getWalletCommission = exports.getWalletRevenue = exports.getMonthlyWalletReport = exports.getDailyWalletReport = exports.getHighestBalances = exports.getTopWalletUsers = exports.getWalletAnalytics = exports.getWalletDashboard = exports.rejectWithdrawal = exports.approveWithdrawal = exports.getPendingWithdrawals = exports.getWalletStatement = exports.getWalletTransactions = exports.unblockWallet = exports.blockWallet = exports.unfreezeWallet = exports.freezeWallet = exports.transferMoney = exports.withdrawMoney = exports.addMoney = exports.debitWallet = exports.creditWallet = exports.getWalletBalance = exports.getMyWallet = exports.deleteWallet = exports.updateWallet = exports.getAllWallets = exports.getWalletById = exports.createWallet = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const crypto_1 = __importDefault(require("crypto"));
/* ==========================================================
   CREATE WALLET
========================================================== */
const createWallet = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const existingWallet = await prisma_1.default.wallet.findUnique({
            where: { userId },
        });
        if (existingWallet) {
            return res.status(409).json({
                success: false,
                message: "Wallet already exists",
            });
        }
        const wallet = await prisma_1.default.wallet.create({
            data: {
                userId,
            },
            include: {
                user: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Wallet created successfully",
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create wallet",
        });
    }
};
exports.createWallet = createWallet;
/* ==========================================================
   GET WALLET BY ID
========================================================== */
const getWalletById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                transactions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet",
        });
    }
};
exports.getWalletById = getWalletById;
/* ==========================================================
   GET ALL WALLETS
========================================================== */
const getAllWallets = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const [wallets, total] = await Promise.all([
            prisma_1.default.wallet.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: true,
                },
            }),
            prisma_1.default.wallet.count(),
        ]);
        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: wallets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallets",
        });
    }
};
exports.getAllWallets = getAllWallets;
/* ==========================================================
   UPDATE WALLET
========================================================== */
const updateWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { id },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: {
                id,
            },
            data: req.body,
        });
        return res.status(200).json({
            success: true,
            message: "Wallet updated successfully",
            data: updatedWallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update wallet",
        });
    }
};
exports.updateWallet = updateWallet;
/* ==========================================================
   DELETE WALLET
========================================================== */
const deleteWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { id },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        await prisma_1.default.wallet.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete wallet",
        });
    }
};
exports.deleteWallet = deleteWallet;
/* ==========================================================
   GET MY WALLET
========================================================== */
const getMyWallet = async (req, res) => {
    try {
        const userId = req.user?.id || req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
                transactions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 20,
                },
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet",
        });
    }
};
exports.getMyWallet = getMyWallet;
/* ==========================================================
   GET WALLET BALANCE
========================================================== */
const getWalletBalance = async (req, res) => {
    try {
        const userId = req.user?.id || req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
                balance: true,
                cashback: true,
                rewardBalance: true,
                totalEarnings: true,
                updatedAt: true,
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet balance",
        });
    }
};
exports.getWalletBalance = getWalletBalance;
/* ==========================================================
   CREDIT WALLET
========================================================== */
const creditWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { amount, description } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { id },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                balance: {
                    increment: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                transactionId: crypto_1.default.randomUUID(),
                category: "WALLET",
                walletId: wallet.id,
                userId: wallet.userId,
                amount: Number(amount),
                type: "CREDIT",
                status: "SUCCESS",
                description: "...",
            }
        });
        return res.status(200).json({
            success: true,
            message: "Wallet credited successfully",
            data: updatedWallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to credit wallet",
        });
    }
};
exports.creditWallet = creditWallet;
/* ==========================================================
   DEBIT WALLET
========================================================== */
const debitWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { amount, description } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { id },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        if (wallet.balance < Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                transactionId: crypto_1.default.randomUUID(),
                category: "WALLET",
                walletId: wallet.id,
                userId: wallet.userId,
                amount: Number(amount),
                type: "DEBIT",
                status: "SUCCESS",
                description: description || "Wallet debited",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet debited successfully",
            data: updatedWallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to debit wallet",
        });
    }
};
exports.debitWallet = debitWallet;
/* ==========================================================
   ADD MONEY
========================================================== */
const addMoney = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({
                success: false,
                message: "User ID and amount are required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: { userId },
            data: {
                balance: {
                    increment: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                transactionId: crypto_1.default.randomUUID(),
                category: "WALLET",
                walletId: wallet.id,
                userId: wallet.userId,
                amount: Number(amount),
                type: "CREDIT",
                status: "SUCCESS",
                description: "Money Added",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Money added successfully",
            data: updatedWallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add money",
        });
    }
};
exports.addMoney = addMoney;
/* ==========================================================
   WITHDRAW MONEY
========================================================== */
const withdrawMoney = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({
                success: false,
                message: "User ID and amount are required",
            });
        }
        const wallet = await prisma_1.default.wallet.findUnique({
            where: { userId },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        if (wallet.balance < Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }
        const updatedWallet = await prisma_1.default.wallet.update({
            where: { userId },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        await prisma_1.default.transaction.create({
            data: {
                transactionId: crypto_1.default.randomUUID(),
                category: "WALLET",
                walletId: wallet.id,
                userId: wallet.userId,
                amount: Number(amount),
                type: "DEBIT",
                status: "SUCCESS",
                description: "Money Withdrawn",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Money withdrawn successfully",
            data: updatedWallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to withdraw money",
        });
    }
};
exports.withdrawMoney = withdrawMoney;
/* ==========================================================
   TRANSFER MONEY
========================================================== */
const transferMoney = async (req, res) => {
    try {
        const { fromUserId, toUserId, amount } = req.body;
        if (!fromUserId || !toUserId || !amount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0",
            });
        }
        if (fromUserId === toUserId) {
            return res.status(400).json({
                success: false,
                message: "Cannot transfer money to same wallet",
            });
        }
        await prisma_1.default.$transaction(async (tx) => {
            const sender = await tx.wallet.findUnique({
                where: {
                    userId: fromUserId,
                },
            });
            if (!sender) {
                throw new Error("Sender wallet not found");
            }
            const receiver = await tx.wallet.findUnique({
                where: {
                    userId: toUserId,
                },
            });
            if (!receiver) {
                throw new Error("Receiver wallet not found");
            }
            if (sender.balance < Number(amount)) {
                throw new Error("Insufficient balance");
            }
            await tx.wallet.update({
                where: {
                    userId: fromUserId,
                },
                data: {
                    balance: {
                        decrement: Number(amount),
                    },
                },
            });
            await tx.wallet.update({
                where: {
                    userId: toUserId,
                },
                data: {
                    balance: {
                        increment: Number(amount),
                    },
                },
            });
            await tx.transaction.createMany({
                data: [
                    {
                        transactionId: crypto_1.default.randomUUID(),
                        category: "WALLET",
                        walletId: sender.id,
                        userId: fromUserId,
                        amount: Number(amount),
                        type: "DEBIT",
                        status: "SUCCESS",
                        description: `Transfer to ${toUserId}`,
                    },
                    {
                        transactionId: crypto_1.default.randomUUID(),
                        category: "WALLET",
                        walletId: receiver.id,
                        userId: toUserId,
                        amount: Number(amount),
                        type: "CREDIT",
                        status: "SUCCESS",
                        description: `Received from ${fromUserId}`,
                    },
                ],
            });
        });
        return res.status(200).json({
            success: true,
            message: "Money transferred successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Transfer failed",
        });
    }
};
exports.transferMoney = transferMoney;
/* ==========================================================
   FREEZE WALLET
========================================================== */
const freezeWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet frozen successfully",
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to freeze wallet",
        });
    }
};
exports.freezeWallet = freezeWallet;
/* ==========================================================
   UNFREEZE WALLET
========================================================== */
const unfreezeWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                isFrozen: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet unfrozen successfully",
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to unfreeze wallet",
        });
    }
};
exports.unfreezeWallet = unfreezeWallet;
/* ==========================================================
   BLOCK WALLET
========================================================== */
const blockWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet blocked successfully",
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to block wallet",
        });
    }
};
exports.blockWallet = blockWallet;
/* ==========================================================
   UNBLOCK WALLET
========================================================== */
const unblockWallet = async (req, res) => {
    try {
        const id = String(req.params.id);
        const wallet = await prisma_1.default.wallet.update({
            where: { id },
            data: {
                isBlocked: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallet unblocked successfully",
            data: wallet,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to unblock wallet",
        });
    }
};
exports.unblockWallet = unblockWallet;
/* ==========================================================
   GET WALLET TRANSACTIONS
========================================================== */
const getWalletTransactions = async (req, res) => {
    try {
        const walletId = String(req.params.walletId);
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                walletId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: transactions.length,
            data: transactions,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
};
exports.getWalletTransactions = getWalletTransactions;
/* ==========================================================
   GET WALLET STATEMENT
========================================================== */
const getWalletStatement = async (req, res) => {
    try {
        const walletId = String(req.params.walletId);
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                id: walletId,
            },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        return res.status(200).json({
            success: true,
            statement: {
                walletId: wallet.id,
                balance: wallet.balance,
                cashback: wallet.cashback,
                rewardBalance: wallet.rewardBalance,
                totalEarnings: wallet.totalEarnings,
                transactions: wallet.transactions,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch statement",
        });
    }
};
exports.getWalletStatement = getWalletStatement;
/* ==========================================================
   PENDING WITHDRAWALS
========================================================== */
const getPendingWithdrawals = async (req, res) => {
    try {
        const withdrawals = await prisma_1.default.transaction.findMany({
            where: {
                type: "WITHDRAW",
                status: "PENDING",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: withdrawals.length,
            data: withdrawals,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending withdrawals",
        });
    }
};
exports.getPendingWithdrawals = getPendingWithdrawals;
/* ==========================================================
   APPROVE WITHDRAWAL
========================================================== */
const approveWithdrawal = async (req, res) => {
    try {
        const id = String(req.params.id);
        const transaction = await prisma_1.default.transaction.update({
            where: {
                id,
            },
            data: {
                status: "SUCCESS",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Withdrawal approved",
            data: transaction,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve withdrawal",
        });
    }
};
exports.approveWithdrawal = approveWithdrawal;
/* ==========================================================
   REJECT WITHDRAWAL
========================================================== */
const rejectWithdrawal = async (req, res) => {
    try {
        const id = String(req.params.id);
        const transaction = await prisma_1.default.transaction.update({
            where: {
                id,
            },
            data: {
                status: "REJECTED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Withdrawal rejected",
            data: transaction,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject withdrawal",
        });
    }
};
exports.rejectWithdrawal = rejectWithdrawal;
/* ==========================================================
   WALLET DASHBOARD
========================================================== */
const getWalletDashboard = async (req, res) => {
    try {
        const [totalWallets, totalBalance, totalCashback, totalRewards, totalTransactions,] = await Promise.all([
            prisma_1.default.wallet.count(),
            prisma_1.default.wallet.aggregate({
                _sum: {
                    balance: true,
                },
            }),
            prisma_1.default.wallet.aggregate({
                _sum: {
                    cashback: true,
                },
            }),
            prisma_1.default.wallet.aggregate({
                _sum: {
                    rewardBalance: true,
                },
            }),
            prisma_1.default.transaction.count(),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalWallets,
                totalBalance: totalBalance._sum.balance || 0,
                totalCashback: totalCashback._sum.cashback || 0,
                totalRewards: totalRewards._sum.rewardBalance || 0,
                totalTransactions,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
        });
    }
};
exports.getWalletDashboard = getWalletDashboard;
/* ==========================================================
   WALLET ANALYTICS
========================================================== */
const getWalletAnalytics = async (req, res) => {
    try {
        const analytics = await prisma_1.default.wallet.aggregate({
            _count: true,
            _sum: {
                balance: true,
                cashback: true,
                rewardBalance: true,
                totalEarnings: true,
            },
            _avg: {
                balance: true,
            },
            _max: {
                balance: true,
            },
            _min: {
                balance: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getWalletAnalytics = getWalletAnalytics;
/* ==========================================================
   TOP WALLET USERS
========================================================== */
const getTopWalletUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.wallet.findMany({
            orderBy: {
                balance: "desc",
            },
            take: 10,
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top users",
        });
    }
};
exports.getTopWalletUsers = getTopWalletUsers;
/* ==========================================================
   HIGHEST BALANCES
========================================================== */
const getHighestBalances = async (req, res) => {
    try {
        const wallets = await prisma_1.default.wallet.findMany({
            orderBy: {
                balance: "desc",
            },
            take: 20,
        });
        return res.status(200).json({
            success: true,
            data: wallets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch balances",
        });
    }
};
exports.getHighestBalances = getHighestBalances;
/* ==========================================================
   DAILY REPORT
========================================================== */
const getDailyWalletReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const report = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: today,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: report.length,
            data: report,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch report",
        });
    }
};
exports.getDailyWalletReport = getDailyWalletReport;
/* ==========================================================
   MONTHLY REPORT
========================================================== */
const getMonthlyWalletReport = async (req, res) => {
    try {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const report = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: firstDay,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: report.length,
            data: report,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly report",
        });
    }
};
exports.getMonthlyWalletReport = getMonthlyWalletReport;
/* ==========================================================
   WALLET REVENUE
========================================================== */
const getWalletRevenue = async (req, res) => {
    try {
        const revenue = await prisma_1.default.wallet.aggregate({
            _sum: {
                totalEarnings: true,
            },
        });
        return res.status(200).json({
            success: true,
            revenue: revenue._sum.totalEarnings || 0,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch revenue",
        });
    }
};
exports.getWalletRevenue = getWalletRevenue;
/* ==========================================================
   WALLET COMMISSION
========================================================== */
const getWalletCommission = async (req, res) => {
    try {
        const commission = await prisma_1.default.wallet.aggregate({
            _sum: {
                cashback: true,
            },
        });
        return res.status(200).json({
            success: true,
            commission: commission._sum.cashback || 0,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch commission",
        });
    }
};
exports.getWalletCommission = getWalletCommission;
/* ==========================================================
   WALLET REFERRALS
========================================================== */
const getWalletReferrals = async (req, res) => {
    try {
        const { userId } = req.query;
        const referrals = await prisma_1.default.wallet.findMany({
            where: userId
                ? {
                    userId: String(userId),
                }
                : {},
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            success: true,
            total: referrals.length,
            data: referrals,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch referrals",
        });
    }
};
exports.getWalletReferrals = getWalletReferrals;
/* ==========================================================
   SEARCH WALLETS
========================================================== */
const searchWallets = async (req, res) => {
    try {
        const keyword = String(req.query.q || "");
        const wallets = await prisma_1.default.wallet.findMany({
            where: {
                OR: [
                    {
                        user: {
                            name: {
                                contains: keyword,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        user: {
                            email: {
                                contains: keyword,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            success: true,
            total: wallets.length,
            data: wallets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};
exports.searchWallets = searchWallets;
/* ==========================================================
   EXPORT EXCEL
========================================================== */
const exportWalletExcel = async (req, res) => {
    try {
        const wallets = await prisma_1.default.wallet.findMany({
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Excel export generated",
            total: wallets.length,
            data: wallets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Export failed",
        });
    }
};
exports.exportWalletExcel = exportWalletExcel;
/* ==========================================================
   EXPORT PDF
========================================================== */
const exportWalletPdf = async (req, res) => {
    try {
        const wallets = await prisma_1.default.wallet.findMany({
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "PDF export generated",
            total: wallets.length,
            data: wallets,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Export failed",
        });
    }
};
exports.exportWalletPdf = exportWalletPdf;
/* ==========================================================
   AUDIT LOGS
========================================================== */
const getWalletAuditLogs = async (req, res) => {
    try {
        const logs = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 200,
        });
        return res.status(200).json({
            success: true,
            total: logs.length,
            data: logs,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
        });
    }
};
exports.getWalletAuditLogs = getWalletAuditLogs;
/* ==========================================================
   BULK CREDIT
========================================================== */
const bulkCreditWallets = async (req, res) => {
    try {
        const { walletIds, amount } = req.body;
        await prisma_1.default.wallet.updateMany({
            where: {
                id: {
                    in: walletIds,
                },
            },
            data: {
                balance: {
                    increment: Number(amount),
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Bulk credit completed",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk credit failed",
        });
    }
};
exports.bulkCreditWallets = bulkCreditWallets;
/* ==========================================================
   BULK DEBIT
========================================================== */
const bulkDebitWallets = async (req, res) => {
    try {
        const { walletIds, amount } = req.body;
        await prisma_1.default.wallet.updateMany({
            where: {
                id: {
                    in: walletIds,
                },
            },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Bulk debit completed",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk debit failed",
        });
    }
};
exports.bulkDebitWallets = bulkDebitWallets;
/* ==========================================================
   BULK FREEZE
========================================================== */
const bulkFreezeWallets = async (req, res) => {
    try {
        const { walletIds } = req.body;
        await prisma_1.default.wallet.updateMany({
            where: {
                id: {
                    in: walletIds,
                },
            },
            data: {
                isFrozen: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallets frozen successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk freeze failed",
        });
    }
};
exports.bulkFreezeWallets = bulkFreezeWallets;
/* ==========================================================
   BULK UNFREEZE
========================================================== */
const bulkUnfreezeWallets = async (req, res) => {
    try {
        const { walletIds } = req.body;
        await prisma_1.default.wallet.updateMany({
            where: {
                id: {
                    in: walletIds,
                },
            },
            data: {
                isFrozen: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallets unfrozen successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk unfreeze failed",
        });
    }
};
exports.bulkUnfreezeWallets = bulkUnfreezeWallets;
/* ==========================================================
   BULK DELETE
========================================================== */
const bulkDeleteWallets = async (req, res) => {
    try {
        const { walletIds } = req.body;
        await prisma_1.default.wallet.deleteMany({
            where: {
                id: {
                    in: walletIds,
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Wallets deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Bulk delete failed",
        });
    }
};
exports.bulkDeleteWallets = bulkDeleteWallets;
/* ==========================================================
   LIVE WALLET ACTIVITIES
========================================================== */
const getLiveWalletActivities = async (req, res) => {
    try {
        const activities = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
            include: {
                wallet: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            total: activities.length,
            data: activities,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch live activities",
        });
    }
};
exports.getLiveWalletActivities = getLiveWalletActivities;
