"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.restoreSettings = exports.toggleMaintenanceMode = exports.getMaintenanceSettings = exports.updateSecuritySettings = exports.getSecuritySettings = exports.updateKycSettings = exports.getKycSettings = exports.updateReferralSettings = exports.getReferralSettings = exports.updateCommissionSettings = exports.getCommissionSettings = exports.updateLoanSettings = exports.getLoanSettings = exports.updatePaymentGatewaySettings = exports.getPaymentGatewaySettings = exports.updateNotificationSettings = exports.getNotificationSettings = exports.updateWhatsappSettings = exports.getWhatsappSettings = exports.updateSmsSettings = exports.getSmsSettings = exports.updateEmailSettings = exports.getEmailSettings = exports.updateSeoSettings = exports.getSeoSettings = exports.updateWebsiteSettings = exports.getWebsiteSettings = exports.updateCompanySettings = exports.getCompanySettings = exports.updateSystemSettings = exports.getSystemSettings = exports.bulkDeleteSettings = exports.bulkUpdateSettings = exports.deleteSetting = exports.updateSetting = exports.createSetting = exports.getSettingByKey = exports.getAllSettings = exports.searchSettings = exports.exportSettingsPdf = exports.exportSettingsExcel = exports.updateMaintenanceSettings = exports.getAuditLogs = exports.getSettingAnalytics = exports.getSettingDashboard = exports.castValueByDataType = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ============================================================
   HELPERS
============================================================ */
const success = (res, message, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
const failure = (res, message, statusCode = 500, error) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === "development"
            ? error
            : undefined,
    });
};
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
/* ============================================================
   TYPE CAST
============================================================ */
const castValueByDataType = (value, dataType) => {
    if (value === null || value === undefined) {
        return null;
    }
    switch (dataType.toLowerCase()) {
        case "number":
        case "int":
        case "integer":
        case "float":
        case "double": {
            const num = Number(value);
            return Number.isNaN(num) ? 0 : num;
        }
        case "boolean":
        case "bool":
            return (value === true ||
                value === "true" ||
                value === "1" ||
                value === 1);
        case "array":
            if (Array.isArray(value))
                return value;
            try {
                return JSON.parse(value);
            }
            catch {
                return [];
            }
        case "object":
        case "json":
            if (typeof value === "object")
                return value;
            try {
                return JSON.parse(value);
            }
            catch {
                return {};
            }
        case "string":
        default:
            return String(value);
    }
};
exports.castValueByDataType = castValueByDataType;
/* ============================================================
   PAGINATION
============================================================ */
const getPagination = (req) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
    };
};
/* ============================================================
   NEWLY ADDED / IMPLEMENTED CONTROLLER FUNCTIONS
============================================================ */
// 1. Dashboard Data Handler
exports.getSettingDashboard = asyncHandler(async (_req, res) => {
    try {
        const [totalSettings, activeSettings, publicSettings, encryptedSettings, categories] = await Promise.all([
            prisma_1.default.setting.count(),
            prisma_1.default.setting.count({ where: { isActive: true } }),
            prisma_1.default.setting.count({ where: { isPublic: true } }),
            prisma_1.default.setting.count({ where: { isEncrypted: true } }),
            prisma_1.default.setting.groupBy({
                by: ["category"],
                _count: { key: true },
            }),
        ]);
        const dashboardData = {
            summary: {
                total: totalSettings,
                active: activeSettings,
                inactive: totalSettings - activeSettings,
                public: publicSettings,
                encrypted: encryptedSettings,
            },
            categoriesCount: categories.map((c) => ({
                category: c.category,
                count: c._count.key,
            })),
        };
        return success(res, "Setting dashboard data fetched successfully.", dashboardData);
    }
    catch (error) {
        return failure(res, "Failed to fetch dashboard data.", 500, error);
    }
});
// 2. Analytics Data Handler
exports.getSettingAnalytics = asyncHandler(async (_req, res) => {
    try {
        const [dataTypesCount, recentUpdates] = await Promise.all([
            prisma_1.default.setting.groupBy({
                by: ["dataType"],
                _count: { key: true },
            }),
            prisma_1.default.setting.findMany({
                take: 10,
                orderBy: { updatedAt: "desc" },
                select: {
                    key: true,
                    category: true,
                    dataType: true,
                    updatedAt: true,
                    updatedBy: true,
                },
            }),
        ]);
        const analyticsData = {
            dataTypesBreakdown: dataTypesCount.map((d) => ({
                dataType: d.dataType,
                count: d._count.key,
            })),
            recentlyUpdated: recentUpdates,
        };
        return success(res, "Setting analytics fetched successfully.", analyticsData);
    }
    catch (error) {
        return failure(res, "Failed to fetch analytics data.", 500, error);
    }
});
// 3. Audit Logs Handler
exports.getAuditLogs = asyncHandler(async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        const [logs, total] = await Promise.all([
            prisma_1.default.setting.findMany({
                skip,
                take: limit,
                orderBy: { updatedAt: "desc" },
                select: {
                    key: true,
                    category: true,
                    updatedAt: true,
                    updatedBy: true,
                    createdBy: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.setting.count(),
        ]);
        return success(res, "Audit logs fetched successfully.", {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: skip + limit < total,
                hasPrev: page > 1,
            },
        });
    }
    catch (error) {
        return failure(res, "Failed to fetch audit logs.", 500, error);
    }
});
// 4. Update Maintenance Settings
exports.updateMaintenanceSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        if (Object.keys(updates).length === 0) {
            return failure(res, "No maintenance settings provided.", 400);
        }
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "maintenance",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Maintenance settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update maintenance settings.", 500, error);
    }
});
// 7. Export Settings to Excel JSON
exports.exportSettingsExcel = asyncHandler(async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category)
            where.category = String(category);
        const settings = await prisma_1.default.setting.findMany({
            where,
            orderBy: { category: "asc" },
        });
        const formattedData = settings.map((s) => ({
            Key: s.key,
            Value: typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value),
            Category: s.category,
            Group: s.group || "",
            DataType: s.dataType,
            IsActive: s.isActive,
            IsPublic: s.isPublic,
            Description: s.description || "",
            UpdatedAt: s.updatedAt,
        }));
        return success(res, "Settings exported for Excel successfully.", formattedData);
    }
    catch (error) {
        return failure(res, "Failed to export settings for Excel.", 500, error);
    }
});
// 8. Export Settings to PDF Payload
exports.exportSettingsPdf = asyncHandler(async (req, res) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category)
            where.category = String(category);
        const settings = await prisma_1.default.setting.findMany({
            where,
            select: {
                key: true,
                value: true,
                category: true,
                description: true,
                updatedAt: true,
            },
            orderBy: { category: "asc" },
        });
        return success(res, "Settings exported for PDF successfully.", {
            generatedAt: new Date().toISOString(),
            totalRecords: settings.length,
            items: settings,
        });
    }
    catch (error) {
        return failure(res, "Failed to export settings for PDF.", 500, error);
    }
});
// 9. Search Settings
exports.searchSettings = asyncHandler(async (req, res) => {
    try {
        const { query } = req.query;
        const { page, limit, skip } = getPagination(req);
        if (!query || String(query).trim() === "") {
            return failure(res, "Search query param is required.", 400);
        }
        const searchTerm = String(query).trim();
        const where = {
            OR: [
                { key: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { category: { contains: searchTerm, mode: "insensitive" } },
                { group: { contains: searchTerm, mode: "insensitive" } },
            ],
        };
        const [results, total] = await Promise.all([
            prisma_1.default.setting.findMany({
                where,
                skip,
                take: limit,
                orderBy: { sortOrder: "asc" },
            }),
            prisma_1.default.setting.count({ where }),
        ]);
        return success(res, `Search results for query: "${searchTerm}"`, {
            results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: skip + limit < total,
                hasPrev: page > 1,
            },
        });
    }
    catch (error) {
        return failure(res, "Failed to search settings.", 500, error);
    }
});
/* ============================================================
   GET ALL SETTINGS
============================================================ */
exports.getAllSettings = asyncHandler(async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        const { category, group, isActive, isPublic, search, sortBy = "sortOrder", order = "asc", } = req.query;
        const where = {};
        if (category) {
            where.category = String(category);
        }
        if (group) {
            where.group = String(group);
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        if (isPublic !== undefined) {
            where.isPublic = isPublic === "true";
        }
        if (search) {
            where.OR = [
                {
                    key: {
                        contains: String(search),
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: String(search),
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        contains: String(search),
                        mode: "insensitive",
                    },
                },
                {
                    group: {
                        contains: String(search),
                        mode: "insensitive",
                    },
                },
            ];
        }
        const [settings, total] = await Promise.all([
            prisma_1.default.setting.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [String(sortBy)]: order === "desc" ? "desc" : "asc",
                },
            }),
            prisma_1.default.setting.count({
                where,
            }),
        ]);
        return success(res, "Settings fetched successfully", {
            settings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: skip + limit < total,
                hasPrev: page > 1,
            },
        });
    }
    catch (error) {
        return failure(res, "Failed to fetch settings", 500, error);
    }
});
/* ============================================================
   GET SETTING BY KEY
============================================================ */
exports.getSettingByKey = asyncHandler(async (req, res) => {
    try {
        const key = typeof req.params.key === "string"
            ? req.params.key
            : undefined;
        const setting = await prisma_1.default.setting.findUnique({
            where: {
                key,
            },
        });
        if (!setting) {
            return failure(res, "Setting not found", 404);
        }
        return success(res, "Setting fetched successfully", setting);
    }
    catch (error) {
        return failure(res, "Failed to fetch setting", 500, error);
    }
});
/* ============================================================
   CREATE SETTING
============================================================ */
exports.createSetting = asyncHandler(async (req, res) => {
    try {
        const { key, value, category, group, description, dataType = "string", isActive = true, isPublic = false, isEditable = true, isEncrypted = false, sortOrder = 0, createdBy, } = req.body;
        if (!key || !category) {
            return failure(res, "Key and category are required.", 400);
        }
        const exists = await prisma_1.default.setting.findUnique({
            where: { key },
        });
        if (exists) {
            return failure(res, "Setting already exists.", 409);
        }
        const setting = await prisma_1.default.setting.create({
            data: {
                key,
                value: (0, exports.castValueByDataType)(value, dataType),
                category,
                group,
                description,
                dataType,
                isActive,
                isPublic,
                isEditable,
                isEncrypted,
                sortOrder: Number(sortOrder),
                createdBy,
                updatedBy: createdBy,
            },
        });
        return success(res, "Setting created successfully.", setting, 201);
    }
    catch (error) {
        return failure(res, "Failed to create setting.", 500, error);
    }
});
/* ============================================================
   UPDATE SETTING
============================================================ */
exports.updateSetting = asyncHandler(async (req, res) => {
    try {
        const key = typeof req.params.key === "string"
            ? req.params.key
            : undefined;
        const existing = await prisma_1.default.setting.findUnique({
            where: { key },
        });
        if (!existing) {
            return failure(res, "Setting not found.", 404);
        }
        if (!existing.isEditable) {
            return failure(res, "This setting cannot be edited.", 403);
        }
        const { value, category, group, description, dataType, isActive, isPublic, isEditable, isEncrypted, sortOrder, updatedBy, } = req.body;
        const setting = await prisma_1.default.setting.update({
            where: { key },
            data: {
                value: value !== undefined
                    ? (0, exports.castValueByDataType)(value, dataType || existing.dataType)
                    : undefined,
                category,
                group,
                description,
                dataType,
                isActive,
                isPublic,
                isEditable,
                isEncrypted,
                sortOrder: sortOrder !== undefined
                    ? Number(sortOrder)
                    : undefined,
                updatedBy,
            },
        });
        return success(res, "Setting updated successfully.", setting);
    }
    catch (error) {
        return failure(res, "Failed to update setting.", 500, error);
    }
});
/* ============================================================
   DELETE SETTING
============================================================ */
exports.deleteSetting = asyncHandler(async (req, res) => {
    try {
        const key = typeof req.params.key === "string"
            ? req.params.key
            : undefined;
        const setting = await prisma_1.default.setting.findUnique({
            where: { key },
        });
        if (!setting) {
            return failure(res, "Setting not found.", 404);
        }
        await prisma_1.default.setting.delete({
            where: { key },
        });
        return success(res, "Setting deleted successfully.");
    }
    catch (error) {
        return failure(res, "Failed to delete setting.", 500, error);
    }
});
/* ============================================================
   BULK UPDATE SETTINGS
============================================================ */
exports.bulkUpdateSettings = asyncHandler(async (req, res) => {
    try {
        const { settings, updatedBy } = req.body;
        if (!Array.isArray(settings) || settings.length === 0) {
            return failure(res, "Settings array is required.", 400);
        }
        const result = await prisma_1.default.$transaction(settings.map((item) => prisma_1.default.setting.update({
            where: {
                key: item.key,
            },
            data: {
                value: item.value !== undefined
                    ? (0, exports.castValueByDataType)(item.value, item.dataType || "string")
                    : undefined,
                category: item.category,
                group: item.group,
                description: item.description,
                dataType: item.dataType,
                isActive: item.isActive,
                isPublic: item.isPublic,
                isEditable: item.isEditable,
                isEncrypted: item.isEncrypted,
                sortOrder: item.sortOrder,
                updatedBy,
            },
        })));
        return success(res, `${result.length} settings updated successfully.`, result);
    }
    catch (error) {
        return failure(res, "Bulk update failed.", 500, error);
    }
});
/* ============================================================
   BULK DELETE SETTINGS
============================================================ */
exports.bulkDeleteSettings = asyncHandler(async (req, res) => {
    try {
        const { keys } = req.body;
        if (!Array.isArray(keys) || keys.length === 0) {
            return failure(res, "Keys array is required.", 400);
        }
        const result = await prisma_1.default.setting.deleteMany({
            where: {
                key: {
                    in: keys,
                },
            },
        });
        return success(res, "Settings deleted successfully.", {
            deletedCount: result.count,
        });
    }
    catch (error) {
        return failure(res, "Bulk delete failed.", 500, error);
    }
});
/* ============================================================
   SYSTEM SETTINGS
============================================================ */
exports.getSystemSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "system",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "System settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch system settings.", 500, error);
    }
});
/* ============================================================
   UPDATE SYSTEM SETTINGS
============================================================ */
exports.updateSystemSettings = asyncHandler(async (req, res) => {
    try {
        const updates = req.body;
        const updatedBy = req.body.updatedBy;
        const keys = Object.keys(updates).filter((key) => key !== "updatedBy");
        const result = await prisma_1.default.$transaction(keys.map((key) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: updates[key],
                updatedBy,
            },
            create: {
                key,
                value: updates[key],
                category: "system",
                dataType: typeof updates[key],
                updatedBy,
                createdBy: updatedBy,
            },
        })));
        return success(res, "System settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update system settings.", 500, error);
    }
});
/* ============================================================
   COMPANY SETTINGS
============================================================ */
exports.getCompanySettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "company",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Company settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch company settings.", 500, error);
    }
});
/* ============================================================
   UPDATE COMPANY SETTINGS
============================================================ */
exports.updateCompanySettings = asyncHandler(async (req, res) => {
    try {
        const updates = req.body;
        const updatedBy = req.body.updatedBy;
        const keys = Object.keys(updates).filter((key) => key !== "updatedBy");
        const result = await prisma_1.default.$transaction(keys.map((key) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: updates[key],
                updatedBy,
            },
            create: {
                key,
                value: updates[key],
                category: "company",
                dataType: typeof updates[key],
                updatedBy,
                createdBy: updatedBy,
            },
        })));
        return success(res, "Company settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update company settings.", 500, error);
    }
});
/* ============================================================
   WEBSITE SETTINGS
============================================================ */
exports.getWebsiteSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "website",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Website settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch website settings.", 500, error);
    }
});
/* ============================================================
   UPDATE WEBSITE SETTINGS
============================================================ */
exports.updateWebsiteSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "website",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Website settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update website settings.", 500, error);
    }
});
/* ============================================================
   SEO SETTINGS
============================================================ */
exports.getSeoSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "seo",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "SEO settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch SEO settings.", 500, error);
    }
});
/* ============================================================
   UPDATE SEO SETTINGS
============================================================ */
exports.updateSeoSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "seo",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "SEO settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update SEO settings.", 500, error);
    }
});
/* ============================================================
   EMAIL SETTINGS
============================================================ */
exports.getEmailSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "email",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Email settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch email settings.", 500, error);
    }
});
/* ============================================================
   UPDATE EMAIL SETTINGS
============================================================ */
exports.updateEmailSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "email",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Email settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update email settings.", 500, error);
    }
});
/* ============================================================
   SMS SETTINGS
============================================================ */
exports.getSmsSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "sms",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "SMS settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch SMS settings.", 500, error);
    }
});
/* ============================================================
   UPDATE SMS SETTINGS
============================================================ */
exports.updateSmsSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "sms",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "SMS settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update SMS settings.", 500, error);
    }
});
/* ============================================================
   WHATSAPP SETTINGS
============================================================ */
exports.getWhatsappSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "whatsapp",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "WhatsApp settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch WhatsApp settings.", 500, error);
    }
});
/* ============================================================
   UPDATE WHATSAPP SETTINGS
============================================================ */
exports.updateWhatsappSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "whatsapp",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "WhatsApp settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update WhatsApp settings.", 500, error);
    }
});
/* ============================================================
   NOTIFICATION SETTINGS
============================================================ */
exports.getNotificationSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: {
                category: "notification",
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Notification settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch notification settings.", 500, error);
    }
});
/* ============================================================
   UPDATE NOTIFICATION SETTINGS
============================================================ */
exports.updateNotificationSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "notification",
                dataType: Array.isArray(value)
                    ? "array"
                    : value === null
                        ? "string"
                        : typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Notification settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update notification settings.", 500, error);
    }
});
/* ============================================================
   PAYMENT GATEWAY SETTINGS
============================================================ */
exports.getPaymentGatewaySettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "payment_gateway", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Payment gateway settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch payment gateway settings.", 500, error);
    }
});
exports.updatePaymentGatewaySettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "payment_gateway",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Payment gateway settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update payment gateway settings.", 500, error);
    }
});
/* ============================================================
   LOAN SETTINGS
============================================================ */
exports.getLoanSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "loan", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Loan settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch loan settings.", 500, error);
    }
});
exports.updateLoanSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "loan",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Loan settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update loan settings.", 500, error);
    }
});
/* ============================================================
   COMMISSION SETTINGS
============================================================ */
exports.getCommissionSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "commission", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Commission settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch commission settings.", 500, error);
    }
});
exports.updateCommissionSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "commission",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Commission settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update commission settings.", 500, error);
    }
});
/* ============================================================
   REFERRAL SETTINGS
============================================================ */
exports.getReferralSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "referral", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Referral settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch referral settings.", 500, error);
    }
});
exports.updateReferralSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "referral",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Referral settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update referral settings.", 500, error);
    }
});
/* ============================================================
   KYC SETTINGS
============================================================ */
exports.getKycSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "kyc", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "KYC settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch KYC settings.", 500, error);
    }
});
exports.updateKycSettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "kyc",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "KYC settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update KYC settings.", 500, error);
    }
});
/* ============================================================
   SECURITY SETTINGS
============================================================ */
exports.getSecuritySettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "security", isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Security settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch security settings.", 500, error);
    }
});
exports.updateSecuritySettings = asyncHandler(async (req, res) => {
    try {
        const { updatedBy, ...updates } = req.body;
        const result = await prisma_1.default.$transaction(Object.entries(updates).map(([key, value]) => prisma_1.default.setting.upsert({
            where: { key },
            update: {
                value: value,
                updatedBy,
            },
            create: {
                key,
                value: value,
                category: "security",
                dataType: typeof value,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Security settings updated successfully.", result);
    }
    catch (error) {
        return failure(res, "Failed to update security settings.", 500, error);
    }
});
/* ============================================================
   MAINTENANCE SETTINGS & TOGGLE
============================================================ */
exports.getMaintenanceSettings = asyncHandler(async (_req, res) => {
    try {
        const settings = await prisma_1.default.setting.findMany({
            where: { category: "maintenance" },
            orderBy: { sortOrder: "asc" },
        });
        const data = settings.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
        return success(res, "Maintenance settings fetched successfully.", data);
    }
    catch (error) {
        return failure(res, "Failed to fetch maintenance settings.", 500, error);
    }
});
// Enable/Disable Maintenance Mode Dedicated Toggle
exports.toggleMaintenanceMode = asyncHandler(async (req, res) => {
    try {
        const { enabled, message, allowedIps, updatedBy } = req.body;
        if (typeof enabled !== "boolean") {
            return failure(res, "'enabled' (boolean) status is required.", 400);
        }
        const operations = [
            prisma_1.default.setting.upsert({
                where: { key: "maintenance_mode_enabled" },
                update: { value: enabled, updatedBy },
                create: {
                    key: "maintenance_mode_enabled",
                    value: enabled,
                    category: "maintenance",
                    dataType: "boolean",
                    createdBy: updatedBy,
                    updatedBy,
                },
            }),
        ];
        if (message !== undefined) {
            operations.push(prisma_1.default.setting.upsert({
                where: { key: "maintenance_mode_message" },
                update: { value: message, updatedBy },
                create: {
                    key: "maintenance_mode_message",
                    value: message,
                    category: "maintenance",
                    dataType: "string",
                    createdBy: updatedBy,
                    updatedBy,
                },
            }));
        }
        if (allowedIps !== undefined) {
            operations.push(prisma_1.default.setting.upsert({
                where: { key: "maintenance_allowed_ips" },
                update: { value: allowedIps, updatedBy },
                create: {
                    key: "maintenance_allowed_ips",
                    value: allowedIps,
                    category: "maintenance",
                    dataType: "array",
                    createdBy: updatedBy,
                    updatedBy,
                },
            }));
        }
        await prisma_1.default.$transaction(operations);
        return success(res, `Maintenance mode ${enabled ? "enabled" : "disabled"} successfully.`, { maintenanceMode: enabled });
    }
    catch (error) {
        return failure(res, "Failed to toggle maintenance mode.", 500, error);
    }
});
// Production Grade Restore Settings - Validates & Upserts Backup Data
exports.restoreSettings = asyncHandler(async (req, res) => {
    try {
        const { backupData, updatedBy, clearExisting } = req.body;
        const rawRecords = Array.isArray(backupData)
            ? backupData
            : backupData?.settings;
        if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
            return failure(res, "Invalid payload: backupData array or backup package containing settings is required.", 400);
        }
        if (clearExisting === true) {
            await prisma_1.default.setting.deleteMany({
                where: { isEditable: true },
            });
        }
        const restored = await prisma_1.default.$transaction(rawRecords.map((item) => prisma_1.default.setting.upsert({
            where: { key: item.key },
            update: {
                value: item.value,
                category: item.category || "general",
                group: item.group || null,
                description: item.description || null,
                dataType: item.dataType || typeof item.value,
                isActive: item.isActive ?? true,
                isPublic: item.isPublic ?? false,
                isEditable: item.isEditable ?? true,
                isEncrypted: item.isEncrypted ?? false,
                sortOrder: item.sortOrder ?? 0,
                updatedBy,
            },
            create: {
                key: item.key,
                value: item.value,
                category: item.category || "general",
                group: item.group || null,
                description: item.description || null,
                dataType: item.dataType || typeof item.value,
                isActive: item.isActive ?? true,
                isPublic: item.isPublic ?? false,
                isEditable: item.isEditable ?? true,
                isEncrypted: item.isEncrypted ?? false,
                sortOrder: item.sortOrder ?? 0,
                createdBy: updatedBy,
                updatedBy,
            },
        })));
        return success(res, "Settings restored successfully.", {
            restoredCount: restored.length,
            restoredAt: new Date().toISOString(),
        });
    }
    catch (error) {
        return failure(res, "Failed to restore settings from backup.", 500, error);
    }
});
const resetSettings = async (req, res) => {
    try {
        await prisma_1.default.setting.deleteMany();
        const defaultSettings = [
            {
                key: "site_name",
                value: "DSA FinCorp",
                category: "website",
                description: "Website Name",
            },
            {
                key: "maintenance_mode",
                value: false,
                category: "system",
                description: "Maintenance Mode",
            },
            {
                key: "registration_enabled",
                value: true,
                category: "system",
                description: "Allow User Registration",
            },
        ];
        await prisma_1.default.setting.createMany({
            data: defaultSettings,
            skipDuplicates: true,
        });
        res.status(200).json({
            success: true,
            message: "Settings reset successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset settings.",
            error: error.message,
        });
    }
};
exports.resetSettings = resetSettings;
