"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAuditLogs = exports.getActionLogs = exports.getModuleLogs = exports.createAuditLog = exports.deleteOldLogs = exports.getAuditStats = exports.getAdminAuditLogs = exports.getUserAuditLogs = exports.getAuditLogs = void 0;
const audit_service_1 = __importDefault(require("../../services/audit/audit.service"));
const getAuditLogs = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const search = String(req.query.search || "");
        const result = await audit_service_1.default.getLogs(page, limit, search);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("[AUDIT_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
        });
    }
};
exports.getAuditLogs = getAuditLogs;
const getUserAuditLogs = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const logs = await audit_service_1.default.getUserLogs(userId);
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        console.error("[USER_AUDIT_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user audit logs",
        });
    }
};
exports.getUserAuditLogs = getUserAuditLogs;
const getAdminAuditLogs = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        if (!adminId) {
            res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
            return;
        }
        const logs = await audit_service_1.default.getAdminLogs(adminId);
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        console.error("[ADMIN_AUDIT_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin audit logs",
        });
    }
};
exports.getAdminAuditLogs = getAdminAuditLogs;
const getAuditStats = async (req, res) => {
    try {
        const stats = await audit_service_1.default.getAuditStats();
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        console.error("[AUDIT_STATS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit stats",
        });
    }
};
exports.getAuditStats = getAuditStats;
const deleteOldLogs = async (req, res) => {
    try {
        const days = Number(req.query.days) || 90;
        const result = await audit_service_1.default.deleteOldLogs(days);
        res.status(200).json({
            success: true,
            deletedCount: result.count,
            message: "Old audit logs deleted successfully",
        });
    }
    catch (error) {
        console.error("[DELETE_AUDIT_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete old audit logs",
        });
    }
};
exports.deleteOldLogs = deleteOldLogs;
const createAuditLog = async (req, res) => {
    try {
        const log = await audit_service_1.default.createLog(req.body);
        res.status(201).json({
            success: true,
            data: log,
        });
    }
    catch (error) {
        console.error("[CREATE_AUDIT_LOG_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to create audit log",
        });
    }
};
exports.createAuditLog = createAuditLog;
const getModuleLogs = async (req, res) => {
    try {
        const module = String(req.params.module);
        const logs = await audit_service_1.default.getByModule(module);
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        console.error("[GET_MODULE_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch module logs",
        });
    }
};
exports.getModuleLogs = getModuleLogs;
const getActionLogs = async (req, res) => {
    try {
        const action = String(req.params.action);
        const logs = await audit_service_1.default.getByAction(action);
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
        });
    }
    catch (error) {
        console.error("[GET_ACTION_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch action logs",
        });
    }
};
exports.getActionLogs = getActionLogs;
const searchAuditLogs = async (req, res) => {
    try {
        const keyword = String(req.params.keyword);
        const result = await audit_service_1.default.getLogs(1, 100, keyword);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("[SEARCH_AUDIT_LOGS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to search audit logs",
        });
    }
};
exports.searchAuditLogs = searchAuditLogs;
