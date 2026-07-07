"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsAnalytics = exports.toggleSettingStatus = exports.updateSetting = exports.createSetting = exports.getSettingByKey = exports.getSettingsByCategory = exports.getAllSettings = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * GET ALL SETTINGS
 */
const getAllSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            orderBy: {
                category: "asc",
            },
        });
        res.status(200).json({
            success: true,
            count: settings.length,
            data: settings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error,
        });
    }
};
exports.getAllSettings = getAllSettings;
/**
 * GET SETTINGS BY CATEGORY
 */
const getSettingsByCategory = async (req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: req.params.category,
            },
        });
        res.status(200).json({
            success: true,
            data: settings,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getSettingsByCategory = getSettingsByCategory;
/**
 * GET SINGLE SETTING
 */
const getSettingByKey = async (req, res) => {
    try {
        const setting = await prisma_1.default.setting.findUnique({
            where: {
                key: req.params.key,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "Setting not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: setting,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getSettingByKey = getSettingByKey;
/**
 * CREATE SETTING
 */
const createSetting = async (req, res) => {
    try {
        const { key, value, category, description, } = req.body;
        const exists = await prisma_1.default.setting.findUnique({
            where: { key },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Key already exists",
            });
            return;
        }
        const setting = await prisma_1.default.setting.create({
            data: {
                key,
                value,
                category,
                description,
            },
        });
        res.status(201).json({
            success: true,
            data: setting,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Create failed",
        });
    }
};
exports.createSetting = createSetting;
/**
 * UPDATE SETTING
 */
const updateSetting = async (req, res) => {
    try {
        const setting = await prisma_1.default.setting.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: setting,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.updateSetting = updateSetting;
/**
 * TOGGLE STATUS
 */
const toggleSettingStatus = async (req, res) => {
    try {
        const setting = await prisma_1.default.setting.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "Not found",
            });
            return;
        }
        const updated = await prisma_1.default.setting.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: !setting.isActive,
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
            message: "Failed",
        });
    }
};
exports.toggleSettingStatus = toggleSettingStatus;
/**
 * SETTINGS ANALYTICS
 */
const settingsAnalytics = async (req, res) => {
    try {
        const [totalSettings, activeSettings, inactiveSettings,] = await Promise.all([
            prisma_1.default.setting.count(),
            prisma_1.default.setting.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.setting.count({
                where: {
                    isActive: false,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalSettings,
                activeSettings,
                inactiveSettings,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.settingsAnalytics = settingsAnalytics;
