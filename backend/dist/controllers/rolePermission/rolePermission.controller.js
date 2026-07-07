"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionAnalytics = exports.removeAllPermissions = exports.removePermission = exports.getRolePermissions = exports.bulkAssignPermissions = exports.assignPermission = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * ASSIGN PERMISSION TO ROLE
 */
const assignPermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        const exists = await prisma_1.default.rolePermission.findFirst({
            where: {
                roleId,
                permissionId,
            },
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Permission already assigned",
            });
            return;
        }
        const mapping = await prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId,
                assignedBy: req.user?.id,
            },
            include: {
                role: true,
                permission: true,
            },
        });
        res.status(201).json({
            success: true,
            data: mapping,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Assignment failed",
        });
    }
};
exports.assignPermission = assignPermission;
/**
 * BULK ASSIGN PERMISSIONS
 */
const bulkAssignPermissions = async (req, res) => {
    try {
        const { roleId, permissionIds, } = req.body;
        const data = permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
            assignedBy: req.user?.id,
        }));
        await prisma_1.default.rolePermission.createMany({
            data,
            skipDuplicates: true,
        });
        res.status(200).json({
            success: true,
            message: "Permissions assigned successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Bulk assignment failed",
        });
    }
};
exports.bulkAssignPermissions = bulkAssignPermissions;
/**
 * GET ROLE PERMISSIONS
 */
const getRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.roleId;
        const permissions = await prisma_1.default.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                permission: true,
            },
        });
        res.status(200).json({
            success: true,
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
exports.getRolePermissions = getRolePermissions;
/**
 * REMOVE PERMISSION
 */
const removePermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission removed successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Removal failed",
        });
    }
};
exports.removePermission = removePermission;
/**
 * REMOVE ALL ROLE PERMISSIONS
 */
const removeAllPermissions = async (req, res) => {
    try {
        const roleId = req.params.roleId;
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
            },
        });
        res.status(200).json({
            success: true,
            message: "All permissions removed",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Operation failed",
        });
    }
};
exports.removeAllPermissions = removeAllPermissions;
/**
 * ROLE PERMISSION ANALYTICS
 */
const rolePermissionAnalytics = async (req, res) => {
    try {
        const [totalMappings, totalRoles, totalPermissions,] = await Promise.all([
            prisma_1.default.rolePermission.count(),
            prisma_1.default.role.count(),
            prisma_1.default.permission.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalMappings,
                totalRoles,
                totalPermissions,
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
exports.rolePermissionAnalytics = rolePermissionAnalytics;
