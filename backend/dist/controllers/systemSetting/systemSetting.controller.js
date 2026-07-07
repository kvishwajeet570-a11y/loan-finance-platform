"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemAnalytics = exports.toggleLogin = exports.toggleRegistration = exports.toggleMaintenanceMode = exports.updateSystemSettings = exports.getSystemSettings = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * GET SYSTEM SETTINGS
 */
const getSystemSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findFirst();
        res.status(200).json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch system settings",
            error,
        });
    }
};
exports.getSystemSettings = getSystemSettings;
/**
 * UPDATE SYSTEM SETTINGS
 */
const updateSystemSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findFirst();
        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Settings not found",
            });
            return;
        }
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id: settings.id,
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error,
        });
    }
};
exports.updateSystemSettings = updateSystemSettings;
/**
 * TOGGLE MAINTENANCE MODE
 */
const toggleMaintenanceMode = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findFirst();
        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Settings not found",
            });
            return;
        }
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id: settings.id,
            },
            data: {
                maintenanceMode: !settings.maintenanceMode,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Operation failed",
        });
    }
};
exports.toggleMaintenanceMode = toggleMaintenanceMode;
/**
 * TOGGLE REGISTRATION
 */
const toggleRegistration = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findFirst();
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id: settings.id,
            },
            data: {
                registrationEnabled: !settings.registrationEnabled,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.toggleRegistration = toggleRegistration;
/**
 * TOGGLE LOGIN
 */
const toggleLogin = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findFirst();
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id: settings.id,
            },
            data: {
                loginEnabled: !settings.loginEnabled,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.toggleLogin = toggleLogin;
/**
 * SYSTEM ANALYTICS
 */
const getSystemAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalSessions,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.session.count({
                where: {
                    isActive: true,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLoans,
                activeSessions: totalSessions,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getSystemAnalytics = getSystemAnalytics;
