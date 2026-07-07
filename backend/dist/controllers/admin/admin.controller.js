"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLoans = exports.getAllUsers = exports.getAdminDashboard = void 0;
const admin_service_1 = __importDefault(require("./admin.service"));
const getAdminDashboard = async (req, res) => {
    try {
        const dashboard = await admin_service_1.default.getDashboardStats();
        return res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        console.error("[ADMIN_DASHBOARD_ERROR]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard",
        });
    }
};
exports.getAdminDashboard = getAdminDashboard;
const getAllUsers = async (req, res) => {
    try {
        const users = await admin_service_1.default.getAllUsers();
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getAllLoans = async (req, res) => {
    try {
        const loans = await admin_service_1.default.getAllLoans();
        return res.status(200).json({
            success: true,
            count: loans.length,
            data: loans,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loans",
        });
    }
};
exports.getAllLoans = getAllLoans;
