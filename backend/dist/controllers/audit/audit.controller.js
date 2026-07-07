"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditStats = exports.getUserAuditLogs = exports.getAuditLogs = void 0;
const audit_service_1 = __importDefault(require("../../services/audit/audit.service"));
const getAuditLogs = async (req, res) => {
    try {
        const logs = await audit_service_1.default.getAll();
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs,
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
        const { userId } = req.params;
        const logs = await audit_service_1.default.getByUserId(userId);
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
const getAuditStats = async (req, res) => {
    try {
        const stats = await audit_service_1.default.getStats();
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
