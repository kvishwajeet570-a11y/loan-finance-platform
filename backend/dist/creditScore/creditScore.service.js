"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditAnalytics = exports.deleteCreditScore = exports.updateCreditScore = exports.getUserCreditHistory = exports.getCreditScoreById = exports.getCreditScores = exports.createCreditScore = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE CREDIT SCORE
 */
const createCreditScore = async (req, res) => {
    try {
        const { userId, score, bureau, remarks, } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        let riskCategory = "HIGH";
        let eligibleAmount = 50000;
        if (score >= 750) {
            riskCategory = "LOW";
            eligibleAmount = 1000000;
        }
        else if (score >= 650) {
            riskCategory = "MEDIUM";
            eligibleAmount = 500000;
        }
        const credit = await prisma_1.default.creditScore.create({
            data: {
                userId,
                score,
                bureau,
                remarks,
                riskCategory,
                eligibleAmount,
            },
        });
        res.status(201).json({
            success: true,
            data: credit,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Credit score creation failed",
            error,
        });
    }
};
exports.createCreditScore = createCreditScore;
/**
 * GET ALL CREDIT SCORES
 */
const getCreditScores = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = String(req.query.search || "");
        const data = await prisma_1.default.creditScore.findMany({
            where: {
                OR: [
                    {
                        bureau: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        user: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
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
            skip,
            take: limit,
            orderBy: {
                checkedAt: "desc",
            },
        });
        const total = await prisma_1.default.creditScore.count();
        res.status(200).json({
            success: true,
            total,
            page,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getCreditScores = getCreditScores;
/**
 * GET SINGLE CREDIT SCORE
 */
const getCreditScoreById = async (req, res) => {
    try {
        const credit = await prisma_1.default.creditScore.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: true,
            },
        });
        if (!credit) {
            res.status(404).json({
                success: false,
                message: "Record not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: credit,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getCreditScoreById = getCreditScoreById;
/**
 * USER CREDIT HISTORY
 */
const getUserCreditHistory = async (req, res) => {
    try {
        const records = await prisma_1.default.creditScore.findMany({
            where: {
                userId: req.params.userId,
            },
            orderBy: {
                checkedAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getUserCreditHistory = getUserCreditHistory;
/**
 * UPDATE CREDIT SCORE
 */
const updateCreditScore = async (req, res) => {
    try {
        const credit = await prisma_1.default.creditScore.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: credit,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.updateCreditScore = updateCreditScore;
/**
 * SOFT DELETE
 */
const deleteCreditScore = async (req, res) => {
    try {
        await prisma_1.default.creditScore.update({
            where: {
                id: req.params.id,
            },
            data: {
                status: "DELETED",
            },
        });
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.deleteCreditScore = deleteCreditScore;
/**
 * CREDIT ANALYTICS
 */
const creditAnalytics = async (req, res) => {
    try {
        const [totalChecks, lowRisk, mediumRisk, highRisk,] = await Promise.all([
            prisma_1.default.creditScore.count(),
            prisma_1.default.creditScore.count({
                where: {
                    riskCategory: "LOW",
                },
            }),
            prisma_1.default.creditScore.count({
                where: {
                    riskCategory: "MEDIUM",
                },
            }),
            prisma_1.default.creditScore.count({
                where: {
                    riskCategory: "HIGH",
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalChecks,
                lowRisk,
                mediumRisk,
                highRisk,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.creditAnalytics = creditAnalytics;
