"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestmentAnalytics = exports.closeInvestment = exports.rejectInvestment = exports.approveInvestment = exports.createInvestment = exports.getInvestmentById = exports.getInvestments = void 0;
const investment_service_1 = __importDefault(require("../../services/investment/investment.service"));
const getInvestments = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const type = String(req.query.type || "");
        const result = await investment_service_1.default.getInvestments({
            page,
            limit,
            search,
            type,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch investments",
        });
    }
};
exports.getInvestments = getInvestments;
const getInvestmentById = async (req, res) => {
    try {
        const investment = await investment_service_1.default.getInvestmentById(req.params.id);
        if (!investment) {
            return void res.status(404).json({
                success: false,
                message: "Investment not found",
            });
        }
        res.status(200).json({
            success: true,
            data: investment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch investment",
        });
    }
};
exports.getInvestmentById = getInvestmentById;
const createInvestment = async (req, res) => {
    try {
        const investment = await investment_service_1.default.createInvestment(req.body);
        res.status(201).json({
            success: true,
            message: "Investment created successfully",
            data: investment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createInvestment = createInvestment;
const approveInvestment = async (req, res) => {
    try {
        const investment = await investment_service_1.default.approveInvestment(req.params.id);
        res.status(200).json({
            success: true,
            message: "Investment approved successfully",
            data: investment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approveInvestment = approveInvestment;
const rejectInvestment = async (req, res) => {
    try {
        const investment = await investment_service_1.default.rejectInvestment(req.params.id, req.body.reason);
        res.status(200).json({
            success: true,
            message: "Investment rejected",
            data: investment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectInvestment = rejectInvestment;
const closeInvestment = async (req, res) => {
    try {
        const investment = await investment_service_1.default.closeInvestment(req.params.id);
        res.status(200).json({
            success: true,
            message: "Investment closed successfully",
            data: investment,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Closure failed",
        });
    }
};
exports.closeInvestment = closeInvestment;
const getInvestmentAnalytics = async (req, res) => {
    try {
        const analytics = await investment_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.getInvestmentAnalytics = getInvestmentAnalytics;
