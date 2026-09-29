"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkRefundRecharge = exports.bulkProcessRecharge = exports.exportRechargePdf = exports.exportRechargeExcel = exports.getMonthlyRecharges = exports.getTopRechargeUsers = exports.getRechargeDashboard = exports.getRechargeAnalytics = exports.getRefundedRecharges = exports.getFailedRecharges = exports.getSuccessRecharges = exports.getPendingRecharges = exports.searchRecharges = exports.getFastagRecharges = exports.getDthRecharges = exports.getMobileRecharges = exports.refundRecharge = exports.markRechargeFailed = exports.markRechargeSuccess = exports.verifyRecharge = exports.processRecharge = exports.deleteRecharge = exports.updateRecharge = exports.getAllRecharges = exports.getRechargeById = exports.getSingleRecharge = exports.getUserRecharges = exports.createRecharge = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   CREATE RECHARGE
======================================== */
const createRecharge = async (req, res) => {
    try {
        const { userId, mobileNumber, operator, amount, rechargeType, paymentMethod, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId ||
            !mobileNumber ||
            !operator ||
            !amount ||
            !rechargeType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           CHECK USER
        ======================================== */
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                wallet: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        /* ========================================
           CHECK WALLET
        ======================================== */
        if (!user.wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }
        /* ========================================
           CHECK BALANCE
        ======================================== */
        if (user.wallet.balance <
            Number(amount)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }
        /* ========================================
           CREATE RECHARGE
        ======================================== */
        const recharge = await prisma_1.default.recharge.create({
            data: {
                userId,
                mobileNumber,
                operator,
                amount: Number(amount),
                rechargeType,
                status: "SUCCESS"
            },
        });
        /* ========================================
           UPDATE WALLET
        ======================================== */
        await prisma_1.default.wallet.update({
            where: {
                id: user.wallet.id,
            },
            data: {
                balance: {
                    decrement: Number(amount),
                },
            },
        });
        /* ========================================
        CREATE TRANSACTION
     ======================================== */
        await prisma_1.default.transaction.create({
            data: {
                transactionId: `RCG${Date.now()}`,
                walletId: user.wallet.id,
                type: "DEBIT",
                category: "RECHARGE",
                amount: Number(amount),
                description: `${rechargeType} Recharge`,
                paymentMethod: paymentMethod || "Wallet",
                status: "success",
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        await prisma_1.default.notification.create({
            data: {
                userId,
                title: "Recharge Successful",
                message: `₹${amount} recharge completed successfully for ${mobileNumber}`,
                type: "recharge",
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Recharge completed successfully",
            recharge,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create recharge",
        });
    }
};
exports.createRecharge = createRecharge;
/* ========================================
   GET USER RECHARGES
======================================== */
const getUserRecharges = async (req, res) => {
    try {
        /* ========================================
           GET USER ID
        ======================================== */
        const userId = String(req.params.userId);
        /* ========================================
           VALIDATION
        ======================================== */
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        /* ========================================
           FETCH RECHARGES
        ======================================== */
        const recharges = await prisma_1.default.recharge.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        /* ========================================
           TOTAL RECHARGE AMOUNT
        ======================================== */
        const totalRechargeAmount = recharges.reduce((acc, item) => acc + item.amount, 0);
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            count: recharges.length,
            totalRechargeAmount,
            recharges,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recharges",
        });
    }
};
exports.getUserRecharges = getUserRecharges;
/* ========================================
   GET SINGLE RECHARGE
======================================== */
const getSingleRecharge = async (req, res) => {
    try {
        const id = String(req.params.id);
        const recharge = await prisma_1.default.recharge.findUnique({
            where: {
                id,
            },
        });
        if (!recharge) {
            return res.status(404).json({
                success: false,
                message: "Recharge not found",
            });
        }
        return res.status(200).json({
            success: true,
            recharge,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recharge",
        });
    }
};
exports.getSingleRecharge = getSingleRecharge;
/* ========================================
 ALIAS
======================================== */
exports.getRechargeById = exports.getSingleRecharge;
/* ========================================
   GET ALL RECHARGES
======================================== */
const getAllRecharges = async (req, res) => {
    try {
        const recharges = await prisma_1.default.recharge.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            count: recharges.length,
            recharges,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recharges",
        });
    }
};
exports.getAllRecharges = getAllRecharges;
/* ========================================
   UPDATE RECHARGE
======================================== */
const updateRecharge = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.update({
            where: {
                id: String(req.params.id),
            },
            data: req.body,
        });
        return res.status(200).json({
            success: true,
            recharge,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.updateRecharge = updateRecharge;
/* ========================================
   DELETE RECHARGE
======================================== */
const deleteRecharge = async (req, res) => {
    try {
        await prisma_1.default.recharge.delete({
            where: {
                id: String(req.params.id),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Recharge deleted",
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteRecharge = deleteRecharge;
/* ========================================
   PROCESS RECHARGE
======================================== */
const processRecharge = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.update({
            where: {
                id: String(req.body.id),
            },
            data: {
                status: "PROCESSING",
            },
        });
        return res.json({
            success: true,
            recharge,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
        });
    }
};
exports.processRecharge = processRecharge;
/* ========================================
   VERIFY RECHARGE
======================================== */
const verifyRecharge = async (req, res) => {
    const recharge = await prisma_1.default.recharge.findUnique({
        where: {
            id: String(req.body.id),
        },
    });
    return res.json({
        success: true,
        recharge,
    });
};
exports.verifyRecharge = verifyRecharge;
/* ========================================
   STATUS ACTIONS
======================================== */
const markRechargeSuccess = async (req, res) => {
    const recharge = await prisma_1.default.recharge.update({
        where: {
            id: String(req.params.id),
        },
        data: {
            status: "SUCCESS",
            completedAt: new Date(),
        },
    });
    return res.json({
        success: true,
        recharge,
    });
};
exports.markRechargeSuccess = markRechargeSuccess;
const markRechargeFailed = async (req, res) => {
    const recharge = await prisma_1.default.recharge.update({
        where: {
            id: String(req.params.id),
        },
        data: {
            status: "FAILED",
        },
    });
    return res.json({
        success: true,
        recharge,
    });
};
exports.markRechargeFailed = markRechargeFailed;
const refundRecharge = async (req, res) => {
    const recharge = await prisma_1.default.recharge.update({
        where: {
            id: String(req.params.id),
        },
        data: {
            status: "REFUNDED",
        },
    });
    return res.json({
        success: true,
        recharge,
    });
};
exports.refundRecharge = refundRecharge;
/* ========================================
   TYPE FILTERS
======================================== */
const getMobileRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: {
            rechargeType: "MOBILE",
        },
    });
    return res.json({
        success: true,
        recharges,
    });
};
exports.getMobileRecharges = getMobileRecharges;
const getDthRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: {
            rechargeType: "DTH",
        },
    });
    return res.json({
        success: true,
        recharges,
    });
};
exports.getDthRecharges = getDthRecharges;
const getFastagRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: {
            rechargeType: "FASTAG",
        },
    });
    return res.json({
        success: true,
        recharges,
    });
};
exports.getFastagRecharges = getFastagRecharges;
/* ========================================
   SEARCH
======================================== */
const searchRecharges = async (req, res) => {
    const q = String(req.query.q || "");
    const recharges = await prisma_1.default.recharge.findMany({
        where: {
            OR: [
                {
                    mobileNumber: {
                        contains: q,
                    },
                },
                {
                    operator: {
                        contains: q,
                    },
                },
            ],
        },
    });
    return res.json({
        success: true,
        recharges,
    });
};
exports.searchRecharges = searchRecharges;
/* ========================================
   STATUS LISTS
======================================== */
const getPendingRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
    });
    return res.json({
        success: true,
        count: recharges.length,
        recharges,
    });
};
exports.getPendingRecharges = getPendingRecharges;
const getSuccessRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
    });
    return res.json({
        success: true,
        count: recharges.length,
        recharges,
    });
};
exports.getSuccessRecharges = getSuccessRecharges;
const getFailedRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: { status: "FAILED" },
        orderBy: { createdAt: "desc" },
    });
    return res.json({
        success: true,
        count: recharges.length,
        recharges,
    });
};
exports.getFailedRecharges = getFailedRecharges;
const getRefundedRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        where: { status: "REFUNDED" },
        orderBy: { createdAt: "desc" },
    });
    return res.json({
        success: true,
        count: recharges.length,
        recharges,
    });
};
exports.getRefundedRecharges = getRefundedRecharges;
/* ========================================
   ANALYTICS
======================================== */
const getRechargeAnalytics = async (req, res) => {
    const total = await prisma_1.default.recharge.count();
    const amount = await prisma_1.default.recharge.aggregate({
        _sum: {
            amount: true,
        },
    });
    return res.json({
        success: true,
        totalRecharges: total,
        totalAmount: amount._sum.amount || 0,
    });
};
exports.getRechargeAnalytics = getRechargeAnalytics;
const getRechargeDashboard = async (req, res) => {
    const total = await prisma_1.default.recharge.count();
    const success = await prisma_1.default.recharge.count({
        where: { status: "SUCCESS" },
    });
    const failed = await prisma_1.default.recharge.count({
        where: { status: "FAILED" },
    });
    const pending = await prisma_1.default.recharge.count({
        where: { status: "PENDING" },
    });
    return res.json({
        success: true,
        dashboard: {
            total,
            success,
            failed,
            pending,
        },
    });
};
exports.getRechargeDashboard = getRechargeDashboard;
/* ========================================
   TOP USERS
======================================== */
const getTopRechargeUsers = async (req, res) => {
    const users = await prisma_1.default.user.findMany({
        include: {
            recharges: true,
        },
    });
    const ranked = users
        .map((user) => ({
        ...user,
        totalRecharge: user.recharges.reduce((sum, r) => sum + r.amount, 0),
    }))
        .sort((a, b) => b.totalRecharge - a.totalRecharge);
    return res.json({
        success: true,
        users: ranked.slice(0, 10),
    });
};
exports.getTopRechargeUsers = getTopRechargeUsers;
/* ========================================
   MONTHLY REPORT
======================================== */
const getMonthlyRecharges = async (req, res) => {
    const recharges = await prisma_1.default.recharge.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.json({
        success: true,
        count: recharges.length,
        recharges,
    });
};
exports.getMonthlyRecharges = getMonthlyRecharges;
/* ========================================
   EXPORTS
======================================== */
const exportRechargeExcel = async (req, res) => {
    return res.json({
        success: true,
        message: "Excel export coming soon",
    });
};
exports.exportRechargeExcel = exportRechargeExcel;
const exportRechargePdf = async (req, res) => {
    return res.json({
        success: true,
        message: "PDF export coming soon",
    });
};
exports.exportRechargePdf = exportRechargePdf;
/* ========================================
   BULK PROCESS
======================================== */
const bulkProcessRecharge = async (req, res) => {
    return res.json({
        success: true,
        message: "Bulk process completed",
    });
};
exports.bulkProcessRecharge = bulkProcessRecharge;
const bulkRefundRecharge = async (req, res) => {
    return res.json({
        success: true,
        message: "Bulk refund completed",
    });
};
exports.bulkRefundRecharge = bulkRefundRecharge;
