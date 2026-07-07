"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankAnalytics = exports.deleteBank = exports.updateBank = exports.createBank = exports.getBankById = exports.getBanks = void 0;
const bank_service_1 = __importDefault(require("../../services/bank/bank.service"));
const getBanks = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const search = String(req.query.search || "");
        const status = String(req.query.status || "");
        const result = await bank_service_1.default.getBanks({
            page,
            limit,
            search,
            status,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("[GET_BANKS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banks",
        });
    }
};
exports.getBanks = getBanks;
const getBankById = async (req, res) => {
    try {
        const bank = await bank_service_1.default.getBankById(req.params.id);
        if (!bank) {
            res.status(404).json({
                success: false,
                message: "Bank not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: bank,
        });
    }
    catch (error) {
        console.error("[GET_BANK_BY_ID_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bank",
        });
    }
};
exports.getBankById = getBankById;
const createBank = async (req, res) => {
    try {
        const bank = await bank_service_1.default.createBank(req.body);
        res.status(201).json({
            success: true,
            message: "Bank created successfully",
            data: bank,
        });
    }
    catch (error) {
        console.error("[CREATE_BANK_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to create bank",
        });
    }
};
exports.createBank = createBank;
const updateBank = async (req, res) => {
    try {
        const bank = await bank_service_1.default.updateBank(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Bank updated successfully",
            data: bank,
        });
    }
    catch (error) {
        console.error("[UPDATE_BANK_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to update bank",
        });
    }
};
exports.updateBank = updateBank;
const deleteBank = async (req, res) => {
    try {
        await bank_service_1.default.deleteBank(req.params.id);
        res.status(200).json({
            success: true,
            message: "Bank deleted successfully",
        });
    }
    catch (error) {
        console.error("[DELETE_BANK_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete bank",
        });
    }
};
exports.deleteBank = deleteBank;
const getBankAnalytics = async (req, res) => {
    try {
        const analytics = await bank_service_1.default.getBankAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error("[BANK_ANALYTICS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getBankAnalytics = getBankAnalytics;
