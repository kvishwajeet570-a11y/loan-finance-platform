"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditAnalytics = exports.deleteCreditScore = exports.getCreditScoreById = exports.getAllCreditScores = exports.checkCreditScore = void 0;
const creditScore_service_1 = __importDefault(require("../../services/credit-score/creditScore.service"));
const checkCreditScore = async (req, res) => {
    try {
        const { panNo } = req.body;
        const result = await creditScore_service_1.default.checkCreditScore(panNo);
        res.status(200).json({
            success: true,
            message: "Credit score fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.checkCreditScore = checkCreditScore;
const getAllCreditScores = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const result = await creditScore_service_1.default.getAllCreditScores({
            page,
            limit,
            search,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch records",
        });
    }
};
exports.getAllCreditScores = getAllCreditScores;
const getCreditScoreById = async (req, res) => {
    try {
        const data = await creditScore_service_1.default.getCreditScoreById(req.params.id);
        if (!data) {
            res.status(404).json({
                success: false,
                message: "Record not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch record",
        });
    }
};
exports.getCreditScoreById = getCreditScoreById;
const deleteCreditScore = async (req, res) => {
    try {
        await creditScore_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Record deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete record",
        });
    }
};
exports.deleteCreditScore = deleteCreditScore;
const getCreditAnalytics = async (req, res) => {
    try {
        const analytics = await creditScore_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getCreditAnalytics = getCreditAnalytics;
