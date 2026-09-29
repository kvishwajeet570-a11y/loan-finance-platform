"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionAnalytics = exports.removeAllPermissions = exports.removePermission = exports.getRolePermissions = exports.bulkAssignPermissions = exports.assignPermission = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/**
 * ASSIGN PERMISSION TO ROLE
 */
const assignPermission = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        if (!roleId || !permissionId) {
            res.status(400).json({
                success: false,
                message: "roleId and permissionId are required",
            });
            return;
        }
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
            },
            include: {
                Role: true,
                permission: true,
            },
        });
        res.status(201).json({
            success: true,
            message: "Permission assigned successfully",
            data: mapping,
        });
    }
    catch (error) {
        console.error(error);
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
        const { roleId, permissionIds } = req.body;
        if (!roleId || !Array.isArray(permissionIds)) {
            res.status(400).json({
                success: false,
                message: "Invalid request",
            });
            return;
        }
        const data = permissionIds.map((permissionId) => ({
            roleId,
            permissionId,
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
    catch (error) {
        console.error(error);
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
        const roleId = String(req.params.roleId);
        const permissions = await prisma_1.default.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                Role: true,
                permission: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Role permissions fetched successfully",
            count: permissions.length,
            data: permissions,
        });
    }
    catch (error) {
        console.error("Get Role Permissions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch role permissions",
            error: error instanceof Error
                ? error.message
                : "Internal Server Error",
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
    catch (error) {
        console.error(error);
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
        const roleId = String(req.params.roleId);
        const result = await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
            },
        });
        res.status(200).json({
            success: true,
            message: "All permissions removed successfully",
            deletedCount: result.count,
        });
    }
    catch (error) {
        console.error("Remove All Permissions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove permissions",
            error: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
};
exports.removeAllPermissions = removeAllPermissions;
/**
 * ROLE PERMISSION ANALYTICS
 */
const rolePermissionAnalytics = async (req, res) => {
    try {
        const [totalMappings, totalRoles, totalPermissions] = await Promise.all([
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
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.rolePermissionAnalytics = rolePermissionAnalytics;
