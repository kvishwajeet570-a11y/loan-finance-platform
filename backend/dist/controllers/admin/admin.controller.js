"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLoan = exports.approveLoan = exports.getLoanById = exports.getRecentLoans = exports.verifyUser = exports.unblockUser = exports.blockUser = exports.getUserById = exports.getDashboardStats = exports.getAllLoans = exports.getAllUsers = exports.getAdminDashboard = void 0;
const admin_service_1 = __importDefault(require("../../services/admin/admin.service"));
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
exports.getDashboardStats = exports.getAdminDashboard;
const getUserById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await admin_service_1.default.getUserById(id);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
exports.getUserById = getUserById;
const blockUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await admin_service_1.default.blockUser(id);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to block user",
        });
    }
};
exports.blockUser = blockUser;
const unblockUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await admin_service_1.default.unblockUser(id);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to unblock user",
        });
    }
};
exports.unblockUser = unblockUser;
const verifyUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await admin_service_1.default.verifyUser(id);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to verify user",
        });
    }
};
exports.verifyUser = verifyUser;
exports.getRecentLoans = exports.getAllLoans;
const getLoanById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const loan = await admin_service_1.default.getLoanById(id);
        return res.json({
            success: true,
            data: loan,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loan",
        });
    }
};
exports.getLoanById = getLoanById;
const approveLoan = async (req, res) => {
    try {
        const id = String(req.params.id);
        const loan = await admin_service_1.default.approveLoan(id);
        return res.json({
            success: true,
            data: loan,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to approve loan",
        });
    }
};
exports.approveLoan = approveLoan;
const rejectLoan = async (req, res) => {
    try {
        const id = String(req.params.id);
        const loan = await admin_service_1.default.rejectLoan(id);
        return res.json({
            success: true,
            data: loan,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to reject loan",
        });
    }
};
exports.rejectLoan = rejectLoan;
