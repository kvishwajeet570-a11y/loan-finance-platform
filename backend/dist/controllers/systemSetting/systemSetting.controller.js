"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleEncryption = exports.toggleSystemSettingStatus = exports.bulkUpdateSystemSettings = exports.deleteSystemSetting = exports.updateSystemSetting = exports.getSystemSettingByKey = exports.getSystemSettingById = exports.getAllSystemSettings = exports.createSystemSetting = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const systemSetting_dto_1 = require("../../dto/systemSetting/systemSetting.dto");
/* ======================================================
   CREATE SYSTEM SETTING
====================================================== */
const createSystemSetting = async (req, res) => {
    try {
        const validated = systemSetting_dto_1.createSystemSettingSchema.parse(req.body);
        const existing = await prisma_1.default.systemSetting.findUnique({
            where: {
                key: validated.key,
            },
        });
        if (existing) {
            res.status(409).json({
                success: false,
                message: "Setting key already exists.",
            });
            return;
        }
        const setting = await prisma_1.default.systemSetting.create({
            data: {
                category: validated.category,
                key: validated.key,
                value: validated.value,
                dataType: validated.dataType,
                description: validated.description,
                isEditable: validated.isEditable,
                isEncrypted: validated.isEncrypted,
            },
        });
        res.status(201).json({
            success: true,
            message: "System setting created successfully.",
            data: setting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create system setting.",
            error: error.message,
        });
    }
};
exports.createSystemSetting = createSystemSetting;
/* ======================================================
   GET ALL SYSTEM SETTINGS
====================================================== */
const getAllSystemSettings = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const key = req.query.key;
        const where = {};
        if (category)
            where.category = category;
        if (key)
            where.key = {
                contains: key,
                mode: "insensitive",
            };
        const [settings, total] = await Promise.all([
            prisma_1.default.systemSetting.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    updatedAt: "desc",
                },
            }),
            prisma_1.default.systemSetting.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: settings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings.",
            error: error.message,
        });
    }
};
exports.getAllSystemSettings = getAllSystemSettings;
/* ======================================================
   GET SYSTEM SETTING BY ID
====================================================== */
const getSystemSettingById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: setting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch system setting.",
            error: error.message,
        });
    }
};
exports.getSystemSettingById = getSystemSettingById;
/* ======================================================
   GET SYSTEM SETTING BY KEY
====================================================== */
const getSystemSettingByKey = async (req, res) => {
    try {
        const key = String(req.params.key);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                key,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: setting,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch system setting.",
            error: error.message,
        });
    }
};
exports.getSystemSettingByKey = getSystemSettingByKey;
/* ======================================================
   UPDATE SYSTEM SETTING
====================================================== */
const updateSystemSetting = async (req, res) => {
    try {
        const id = String(req.params.id);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        if (!setting.isEditable) {
            res.status(403).json({
                success: false,
                message: "This setting cannot be modified.",
            });
            return;
        }
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data: {
                category: req.body.category ?? setting.category,
                key: req.body.key ?? setting.key,
                value: req.body.value ?? setting.value,
                dataType: req.body.dataType ?? setting.dataType,
                description: req.body.description ?? setting.description,
                isEditable: req.body.isEditable ?? setting.isEditable,
                isEncrypted: req.body.isEncrypted ?? setting.isEncrypted,
                requiresRestart: req.body.requiresRestart ??
                    setting.requiresRestart,
                isActive: req.body.isActive ?? setting.isActive,
                updatedBy: req.body.updatedBy,
            },
        });
        res.status(200).json({
            success: true,
            message: "System setting updated successfully.",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update system setting.",
            error: error.message,
        });
    }
};
exports.updateSystemSetting = updateSystemSetting;
/* ======================================================
   DELETE SYSTEM SETTING
====================================================== */
const deleteSystemSetting = async (req, res) => {
    try {
        const id = String(req.params.id);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        await prisma_1.default.systemSetting.delete({
            where: {
                id,
            },
        });
        res.status(200).json({
            success: true,
            message: "System setting deleted successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete system setting.",
            error: error.message,
        });
    }
};
exports.deleteSystemSetting = deleteSystemSetting;
/* ======================================================
   BULK UPDATE SYSTEM SETTINGS
====================================================== */
const bulkUpdateSystemSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        if (!Array.isArray(settings) || settings.length === 0) {
            res.status(400).json({
                success: false,
                message: "Settings array is required.",
            });
            return;
        }
        const updated = [];
        for (const item of settings) {
            const setting = await prisma_1.default.systemSetting.findUnique({
                where: {
                    key: item.key,
                },
            });
            if (!setting || !setting.isEditable) {
                continue;
            }
            const result = await prisma_1.default.systemSetting.update({
                where: {
                    key: item.key,
                },
                data: {
                    value: item.value,
                    updatedBy: req.body.updatedBy,
                },
            });
            updated.push(result);
        }
        res.status(200).json({
            success: true,
            message: "Bulk update completed successfully.",
            updatedCount: updated.length,
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Bulk update failed.",
            error: error.message,
        });
    }
};
exports.bulkUpdateSystemSettings = bulkUpdateSystemSettings;
/* ======================================================
   TOGGLE ACTIVE STATUS
====================================================== */
const toggleSystemSettingStatus = async (req, res) => {
    try {
        const id = String(req.params.id);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data: {
                isActive: !setting.isActive,
            },
        });
        res.status(200).json({
            success: true,
            message: "Status updated successfully.",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update status.",
            error: error.message,
        });
    }
};
exports.toggleSystemSettingStatus = toggleSystemSettingStatus;
/* ======================================================
   TOGGLE ENCRYPTION
====================================================== */
const toggleEncryption = async (req, res) => {
    try {
        const id = String(req.params.id);
        const setting = await prisma_1.default.systemSetting.findUnique({
            where: {
                id,
            },
        });
        if (!setting) {
            res.status(404).json({
                success: false,
                message: "System setting not found.",
            });
            return;
        }
        const updated = await prisma_1.default.systemSetting.update({
            where: {
                id,
            },
            data: {
                isEncrypted: !setting.isEncrypted,
            },
        });
        res.status(200).json({
            success: true,
            message: "Encryption status updated successfully.",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update encryption status.",
            error: error.message,
        });
    }
};
exports.toggleEncryption = toggleEncryption;
