"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusAnalytics = exports.updateLoanStatus = exports.createStatusEntry = exports.getLoanStatusHistory = void 0;
const loanStatusHistory_service_1 = __importDefault(require("../../services/loan-status-history/loanStatusHistory.service"));
const getLoanStatusHistory = async (req, res) => {
    try {
        const loanId = req.params.loanId;
        const history = await loanStatusHistory_service_1.default.getByLoanId(loanId);
        res.status(200).json({
            success: true,
            data: history,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loan status history",
        });
    }
};
exports.getLoanStatusHistory = getLoanStatusHistory;
const createStatusEntry = async (req, res) => {
    try {
        const history = await loanStatusHistory_service_1.default.create({
            loanId: req.body.loanId,
            status: req.body.status,
            remarks: req.body.remarks,
            changedBy: req.user?.id,
        });
        res.status(201).json({
            success: true,
            message: "Status history created",
            data: history,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createStatusEntry = createStatusEntry;
const updateLoanStatus = async (req, res) => {
    try {
        const history = await loanStatusHistory_service_1.default.updateLoanStatus({
            loanId: req.params.loanId,
            status: req.body.status,
            remarks: req.body.remarks,
            changedBy: req.user?.id,
        });
        res.status(200).json({
            success: true,
            message: "Loan status updated successfully",
            data: history,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateLoanStatus = updateLoanStatus;
const getStatusAnalytics = async (req, res) => {
    try {
        const analytics = await loanStatusHistory_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics fetch failed",
        });
    }
};
exports.getStatusAnalytics = getStatusAnalytics;
