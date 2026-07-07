"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rechargeAnalytics = exports.markRechargeFailed = exports.markRechargeSuccess = exports.getRechargeById = exports.getAllRecharges = exports.createRecharge = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE RECHARGE
 */
const createRecharge = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.create({
            data: {
                rechargeId: `RCG-${Date.now()}`,
                userId: req.body.userId,
                mobileNumber: req.body.mobileNumber,
                operator: req.body.operator,
                circle: req.body.circle,
                rechargeType: req.body.rechargeType,
                amount: Number(req.body.amount),
            },
        });
        res.status(201).json({
            success: true,
            data: recharge,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Recharge creation failed",
        });
    }
};
exports.createRecharge = createRecharge;
/**
 * GET ALL RECHARGES
 */
const getAllRecharges = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        const [recharges, total] = await Promise.all([
            prisma_1.default.recharge.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phoneNo: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.recharge.count(),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: recharges,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recharges",
        });
    }
};
exports.getAllRecharges = getAllRecharges;
/**
 * GET RECHARGE BY ID
 */
const getRechargeById = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: true,
            },
        });
        if (!recharge) {
            res.status(404).json({
                success: false,
                message: "Recharge not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: recharge,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recharge",
        });
    }
};
exports.getRechargeById = getRechargeById;
/**
 * MARK SUCCESS
 */
const markRechargeSuccess = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: "SUCCESS",
                transactionId: req.body.transactionId,
                apiResponse: req.body.apiResponse,
                processedAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: "Recharge successful",
            data: recharge,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Status update failed",
        });
    }
};
exports.markRechargeSuccess = markRechargeSuccess;
/**
 * MARK FAILED
 */
const markRechargeFailed = async (req, res) => {
    try {
        const recharge = await prisma_1.default.recharge.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: "FAILED",
                remarks: req.body.remarks,
            },
        });
        res.status(200).json({
            success: true,
            message: "Recharge marked failed",
            data: recharge,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.markRechargeFailed = markRechargeFailed;
/**
 * ANALYTICS
 */
const rechargeAnalytics = async (req, res) => {
    try {
        const [totalRecharges, successRecharges, failedRecharges, volume,] = await Promise.all([
            prisma_1.default.recharge.count(),
            prisma_1.default.recharge.count({
                where: {
                    status: "SUCCESS",
                },
            }),
            prisma_1.default.recharge.count({
                where: {
                    status: "FAILED",
                },
            }),
            prisma_1.default.recharge.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: "SUCCESS",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalRecharges,
                successRecharges,
                failedRecharges,
                totalVolume: volume._sum.amount || 0,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.rechargeAnalytics = rechargeAnalytics;
