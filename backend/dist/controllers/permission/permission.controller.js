"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionAnalytics = exports.togglePermissionStatus = exports.removePermissionFromRole = exports.assignPermissionToRole = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE PERMISSION
 */
const createPermission = async (req, res) => {
    try {
        const { name, code, module, description, } = req.body;
        const exists = await prisma_1.default.permission.findUnique({
            where: { code },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Permission already exists",
            });
            return;
        }
        const permission = await prisma_1.default.permission.create({
            data: {
                name,
                code,
                module,
                description,
            },
        });
        res.status(201).json({
            success: true,
            data: permission,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create permission",
        });
    }
};
exports.createPermission = createPermission;
/**
 * GET ALL PERMISSIONS
 */
const getAllPermissions = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const search = String(req.query.search || "");
        const skip = (page - 1) * limit;
        const where = {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    module: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        };
        const [permissions, total] = await Promise.all([
            prisma_1.default.permission.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.permission.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: permissions,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch permissions",
        });
    }
};
exports.getAllPermissions = getAllPermissions;
/**
 * GET PERMISSION BY ID
 */
const getPermissionById = async (req, res) => {
    try {
        const permission = await prisma_1.default.permission.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!permission) {
            res.status(404).json({
                success: false,
                message: "Permission not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: permission,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getPermissionById = getPermissionById;
/**
 * ASSIGN TO ROLE
 */
const assignPermissionToRole = async (req, res) => {
    try {
        const { roleId, permissionId, } = req.body;
        const assigned = await prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
        });
        res.status(201).json({
            success: true,
            data: assigned,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Assignment failed",
        });
    }
};
exports.assignPermissionToRole = assignPermissionToRole;
/**
 * REMOVE FROM ROLE
 */
const removePermissionFromRole = async (req, res) => {
    try {
        const { roleId, permissionId, } = req.body;
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission removed",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Removal failed",
        });
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
/**
 * TOGGLE STATUS
 */
const togglePermissionStatus = async (req, res) => {
    try {
        const permission = await prisma_1.default.permission.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!permission) {
            res.status(404).json({
                success: false,
                message: "Permission not found",
            });
            return;
        }
        const updated = await prisma_1.default.permission.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: !permission.isActive,
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
            message: "Update failed",
        });
    }
};
exports.togglePermissionStatus = togglePermissionStatus;
/**
 * ANALYTICS
 */
const permissionAnalytics = async (req, res) => {
    try {
        const [totalPermissions, activePermissions, assignedPermissions,] = await Promise.all([
            prisma_1.default.permission.count(),
            prisma_1.default.permission.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.rolePermission.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalPermissions,
                activePermissions,
                assignedPermissions,
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
exports.permissionAnalytics = permissionAnalytics;
