"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRechargeFailed = exports.markRechargeSuccess = exports.getAllRechargeHistories = exports.createRecharge = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/**
 * 1. CREATE RECHARGE WITH HISTORY AUDIT
 * Handles creation and logs the initial 'PENDING' state in history safely inside a transaction.
 */
const createRecharge = async (req, res) => {
    try {
        const { userId, mobileNumber, operator, rechargeType, amount, planDetails, serviceType } = req.body;
        // Client meta data (IP & Device)
        const ipAddress = req.ip || req.socket.remoteAddress || null;
        const deviceInfo = req.headers["user-agent"] || null;
        // Database transaction to ensure both records are created or both fail
        const result = await prisma_1.default.$transaction(async (tx) => {
            // 1. Create the main recharge record
            const newRecharge = await tx.recharge.create({
                data: {
                    userId,
                    mobileNumber,
                    operator,
                    rechargeType,
                    amount: Number(amount),
                    status: client_1.RechargeStatus.PENDING,
                },
            });
            // 2. Create the initial tracking history
            await tx.rechargeHistory.create({
                data: {
                    userId,
                    rechargeId: newRecharge.id,
                    mobileNumber,
                    operator,
                    rechargeType,
                    amount: Number(amount),
                    planDetails,
                    currentStatus: client_1.RechargeStatus.PENDING,
                    action: "INITIAL_REQUEST",
                    remarks: "Recharge request initiated by user",
                    serviceType,
                    ipAddress,
                    deviceInfo,
                    createdBy: userId,
                },
            });
            return newRecharge;
        });
        res.status(201).json({
            success: true,
            message: "Recharge initiated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Recharge creation failed",
            error: error.message,
        });
    }
};
exports.createRecharge = createRecharge;
/**
 * 2. GET ALL RECHARGE HISTORIES (With Advanced Dynamic Filters & Pagination)
 */
const getAllRechargeHistories = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        // Dynamic Filter Construction
        const { status, search, userId, operator, } = req.query;
        const whereClause = {};
        if (typeof status === "string") {
            whereClause.currentStatus = status;
        }
        if (typeof userId === "string") {
            whereClause.userId = userId;
        }
        if (typeof operator === "string") {
            whereClause.operator = operator;
        }
        if (typeof search === "string") {
            whereClause.OR = [
                {
                    mobileNumber: {
                        contains: search,
                    },
                },
                {
                    transactionRef: {
                        contains: search,
                    },
                },
                {
                    operatorTxnId: {
                        contains: search,
                    },
                },
            ];
        }
        const [histories, total] = await Promise.all([
            prisma_1.default.rechargeHistory.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    user: {
                        select: { id: true, name: true, phoneNo: true },
                    },
                    recharge: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.default.rechargeHistory.count({ where: whereClause }),
        ]);
        res.status(200).json({
            success: true,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            data: histories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch recharge histories",
            error: error.message,
        });
    }
};
exports.getAllRechargeHistories = getAllRechargeHistories;
const markRechargeSuccess = async (req, res) => {
    try {
        const rechargeId = String(req.params.id);
        const { transactionId, operatorTxnId, commissionAmount, apiProvider, apiRequest, apiResponse, updatedBy, } = req.body;
        const result = await prisma_1.default.$transaction(async (tx) => {
            const existingRecharge = await tx.recharge.findUnique({
                where: {
                    id: rechargeId,
                },
            });
            if (!existingRecharge) {
                throw new Error("Recharge record not found");
            }
            const updatedRecharge = await tx.recharge.update({
                where: {
                    id: rechargeId,
                },
                data: {
                    status: client_1.RechargeStatus.SUCCESS,
                    transactionRef: transactionId,
                    operatorTxnId,
                    commissionAmount: Number(commissionAmount || 0),
                    processedAt: new Date(),
                    completedAt: new Date(),
                },
            });
            await tx.rechargeHistory.create({
                data: {
                    userId: existingRecharge.userId,
                    rechargeId: existingRecharge.id,
                    mobileNumber: existingRecharge.mobileNumber,
                    operator: existingRecharge.operator,
                    rechargeType: existingRecharge.rechargeType,
                    amount: existingRecharge.amount,
                    previousStatus: existingRecharge.status,
                    currentStatus: client_1.RechargeStatus.SUCCESS,
                    transactionRef: transactionId,
                    operatorTxnId,
                    commissionAmount: Number(commissionAmount || 0),
                    action: "STATUS_UPDATE_SUCCESS",
                    remarks: "Recharge processed successfully",
                    apiProvider,
                    apiRequest,
                    apiResponse,
                    updatedBy,
                },
            });
            return updatedRecharge;
        });
        res.status(200).json({
            success: true,
            message: "Recharge marked as SUCCESS",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.markRechargeSuccess = markRechargeSuccess;
const markRechargeFailed = async (req, res) => {
    try {
        const rechargeId = String(req.params.id);
        const { failureReason, remarks, apiResponse, updatedBy, } = req.body;
        const result = await prisma_1.default.$transaction(async (tx) => {
            const existingRecharge = await tx.recharge.findUnique({
                where: {
                    id: rechargeId,
                },
            });
            if (!existingRecharge) {
                throw new Error("Recharge record not found");
            }
            const updatedRecharge = await tx.recharge.update({
                where: {
                    id: rechargeId,
                },
                data: {
                    status: client_1.RechargeStatus.FAILED,
                    failureReason,
                    remarks: remarks || failureReason,
                    refundedAt: new Date(),
                    refundedBy: updatedBy || "SYSTEM_AUTO",
                    processedAt: new Date(),
                },
            });
            await tx.rechargeHistory.create({
                data: {
                    userId: existingRecharge.userId,
                    rechargeId: existingRecharge.id,
                    mobileNumber: existingRecharge.mobileNumber,
                    operator: existingRecharge.operator,
                    rechargeType: existingRecharge.rechargeType,
                    amount: existingRecharge.amount,
                    previousStatus: existingRecharge.status,
                    currentStatus: client_1.RechargeStatus.FAILED,
                    failureReason,
                    refundAmount: existingRecharge.amount,
                    refundedAt: new Date(),
                    refundedBy: updatedBy || "SYSTEM_AUTO",
                    action: "STATUS_UPDATE_FAILED",
                    remarks: remarks || "Recharge failed",
                    apiResponse,
                    updatedBy,
                },
            });
            return updatedRecharge;
        });
        res.status(200).json({
            success: true,
            message: "Recharge marked as FAILED",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.markRechargeFailed = markRechargeFailed;
