"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.getSingleTransaction = exports.createTransaction = exports.getTransactions = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   GET ALL TRANSACTIONS
======================================== */
const getTransactions = async (req, res) => {
    try {
        /* ========================================
           GET WALLET ID
        ======================================== */
        const walletId = req.params.walletId;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!walletId) {
            return res.status(400).json({
                success: false,
                message: "Wallet ID is required",
            });
        }
        /* ========================================
           CHECK WALLET
        ======================================== */
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                id: walletId,
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        /* ========================================
           FETCH TRANSACTIONS
        ======================================== */
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                walletId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           TRANSACTION STATS
        ======================================== */
        const totalCredit = transactions
            .filter((item) => item.type === "credit")
            .reduce((acc, item) => acc + item.amount, 0);
        const totalDebit = transactions
            .filter((item) => item.type === "debit")
            .reduce((acc, item) => acc + item.amount, 0);
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            count: transactions.length,
            totalCredit,
            totalDebit,
            transactions,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
};
exports.getTransactions = getTransactions;
/* ========================================
   CREATE TRANSACTION
======================================== */
const createTransaction = async (req, res) => {
    try {
        /* ========================================
           GET DATA
        ======================================== */
        const { walletId, type, amount, description, paymentMethod, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!walletId ||
            !type ||
            !amount) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }
        /* ========================================
           CHECK WALLET
        ======================================== */
        const wallet = await prisma_1.default.wallet.findUnique({
            where: {
                id: walletId,
            },
        });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        /* ========================================
           CHECK INSUFFICIENT BALANCE
        ======================================== */
        if (type === "debit" &&
            wallet.balance <
                Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }
        /* ========================================
           CREATE TRANSACTION
        ======================================== */
        const transaction = await prisma_1.default.transaction.create({
            data: {
                walletId,
                type,
                amount: Number(amount),
                description,
                paymentMethod: paymentMethod || "UPI",
                status: "success",
                transactionId: `TXN${Date.now()}`,
            },
        });
        /* ========================================
           UPDATE WALLET BALANCE
        ======================================== */
        if (type === "credit") {
            await prisma_1.default.wallet.update({
                where: {
                    id: walletId,
                },
                data: {
                    balance: {
                        increment: Number(amount),
                    },
                },
            });
        }
        if (type === "debit") {
            await prisma_1.default.wallet.update({
                where: {
                    id: walletId,
                },
                data: {
                    balance: {
                        decrement: Number(amount),
                    },
                },
            });
        }
        /* ========================================
           CREATE WALLET HISTORY
        ======================================== */
        const updatedWallet = await prisma_1.default.wallet.findUnique({
            where: {
                id: walletId,
            },
        });
        if (updatedWallet) {
            await prisma_1.default.walletHistory.create({
                data: {
                    walletId,
                    balance: updatedWallet.balance,
                },
            });
        }
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId: wallet.userId,
                title: "Transaction Successful",
                message: `₹${amount} ${type} transaction completed successfully`,
                type: "transaction",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create transaction",
        });
    }
};
exports.createTransaction = createTransaction;
/* ========================================
   GET SINGLE TRANSACTION
======================================== */
const getSingleTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await prisma_1.default.transaction.findUnique({
            where: {
                id,
            },
        });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        return res.status(200).json({
            success: true,
            transaction,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transaction",
        });
    }
};
exports.getSingleTransaction = getSingleTransaction;
/* ========================================
   DELETE TRANSACTION
======================================== */
const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await prisma_1.default.transaction.findUnique({
            where: {
                id,
            },
        });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }
        await prisma_1.default.transaction.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete transaction",
        });
    }
};
exports.deleteTransaction = deleteTransaction;
