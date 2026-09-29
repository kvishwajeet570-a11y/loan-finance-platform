"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPermissionsPdf = exports.exportPermissionsExcel = exports.bulkRemovePermissions = exports.bulkAssignPermissions = exports.getActions = exports.getModules = exports.getPermissionDashboard = exports.getPermissionAnalytics = exports.searchPermissions = exports.removePermissionFromUser = exports.assignPermissionToUser = exports.getUserPermissions = exports.getRolePermissions = exports.removePermissionFromRole = exports.assignPermissionToRole = exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* =========================================
   CREATE PERMISSION
========================================= */
const createPermission = async (req, res) => {
    try {
        const permission = await prisma_1.default.permission.create({
            data: {
                name: req.body.name,
                code: req.body.code,
                module: req.body.module,
                action: req.body.action,
                description: req.body.description,
                status: req.body.status ?? "ACTIVE",
                slug: req.body.slug,
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
            message: error.message,
        });
    }
};
exports.createPermission = createPermission;
/* =========================================
   GET ALL PERMISSIONS
========================================= */
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await prisma_1.default.permission.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: permissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllPermissions = getAllPermissions;
/* =========================================
   GET PERMISSION BY ID
========================================= */
const getPermissionById = async (req, res) => {
    try {
        const permission = await prisma_1.default.permission.findUnique({
            where: {
                id: String(req.params.id),
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
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getPermissionById = getPermissionById;
/* =========================================
   UPDATE PERMISSION
========================================= */
const updatePermission = async (req, res) => {
    try {
        const permission = await prisma_1.default.permission.update({
            where: {
                id: String(req.params.id),
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: permission,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updatePermission = updatePermission;
/* =========================================
   DELETE PERMISSION
========================================= */
const deletePermission = async (req, res) => {
    try {
        await prisma_1.default.permission.delete({
            where: {
                id: String(req.params.id),
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deletePermission = deletePermission;
/* =========================================
   ASSIGN PERMISSION TO ROLE
========================================= */
const assignPermissionToRole = async (req, res) => {
    try {
        const { permissionId } = req.body;
        const role = String(req.params.roleId);
        const result = await prisma_1.default.rolePermission.create({
            data: {
                roleId: role,
                permissionId,
            },
        });
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.assignPermissionToRole = assignPermissionToRole;
/* =========================================
   REMOVE PERMISSION FROM ROLE
========================================= */
const removePermissionFromRole = async (req, res) => {
    try {
        const role = String(req.params.roleId);
        const permissionId = String(req.params.permissionId);
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId: role,
                permissionId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission removed successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
/* =========================================
   GET ROLE PERMISSIONS
========================================= */
const getRolePermissions = async (req, res) => {
    try {
        const role = String(req.params.roleId);
        const permissions = await prisma_1.default.rolePermission.findMany({
            where: {
                roleId: role,
            },
            include: {
                Role: true,
                permission: true,
            },
        });
        res.status(200).json({
            success: true,
            data: permissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getRolePermissions = getRolePermissions;
/* =========================================
   USER PERMISSIONS
========================================= */
const getUserPermissions = async (req, res) => {
    const userId = String(req.params.userId);
    const permissions = await prisma_1.default.userPermission.findMany({
        where: {
            userId,
        },
        include: {
            permission: true,
        },
    });
    res.json({
        success: true,
        data: permissions,
    });
};
exports.getUserPermissions = getUserPermissions;
const assignPermissionToUser = async (req, res) => {
    const userId = String(req.params.userId);
    const result = await prisma_1.default.userPermission.create({
        data: {
            userId,
            permissionId: req.body.permissionId,
        },
    });
    res.json({
        success: true,
        data: result,
    });
};
exports.assignPermissionToUser = assignPermissionToUser;
const removePermissionFromUser = async (req, res) => {
    const userId = String(req.params.userId);
    const permissionId = String(req.params.permissionId);
    await prisma_1.default.userPermission.deleteMany({
        where: {
            userId,
            permissionId,
        },
    });
    res.json({
        success: true,
        message: "Removed successfully",
    });
};
exports.removePermissionFromUser = removePermissionFromUser;
/* =========================================
   SEARCH PERMISSIONS
========================================= */
const searchPermissions = async (req, res) => {
    try {
        const search = String(req.query.search || "");
        const permissions = await prisma_1.default.permission.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        module: {
                            contains: search,
                        },
                    },
                    {
                        code: {
                            contains: search,
                        },
                    },
                ],
            },
        });
        res.status(200).json({
            success: true,
            data: permissions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.searchPermissions = searchPermissions;
/* =========================================
   ANALYTICS
========================================= */
const getPermissionAnalytics = async (req, res) => {
    try {
        const totalPermissions = await prisma_1.default.permission.count();
        const totalRolePermissions = await prisma_1.default.rolePermission.count();
        const totalUserPermissions = await prisma_1.default.userPermission.count();
        res.status(200).json({
            success: true,
            data: {
                totalPermissions,
                totalRolePermissions,
                totalUserPermissions,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getPermissionAnalytics = getPermissionAnalytics;
/* =========================================
   DASHBOARD
========================================= */
const getPermissionDashboard = async (req, res) => {
    try {
        const permissions = await prisma_1.default.permission.findMany();
        const roles = await prisma_1.default.rolePermission.count();
        const users = await prisma_1.default.userPermission.count();
        res.status(200).json({
            success: true,
            data: {
                permissions,
                roles,
                users,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getPermissionDashboard = getPermissionDashboard;
/* =========================================
   GET MODULES
========================================= */
const getModules = async (req, res) => {
    try {
        const modules = await prisma_1.default.permission.findMany({
            select: {
                module: true,
            },
            distinct: ["module"],
        });
        res.status(200).json({
            success: true,
            data: modules,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getModules = getModules;
/* =========================================
   GET ACTIONS
========================================= */
const getActions = async (req, res) => {
    try {
        const actions = await prisma_1.default.permission.findMany({
            select: {
                action: true,
            },
            distinct: ["action"],
        });
        res.status(200).json({
            success: true,
            data: actions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getActions = getActions;
/* =========================================
   BULK ASSIGN
========================================= */
const bulkAssignPermissions = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;
        await prisma_1.default.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
            skipDuplicates: true,
        });
        res.status(200).json({
            success: true,
            message: "Permissions assigned",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.bulkAssignPermissions = bulkAssignPermissions;
/* =========================================
   BULK REMOVE
========================================= */
const bulkRemovePermissions = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId: {
                    in: permissionIds,
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Permissions removed",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.bulkRemovePermissions = bulkRemovePermissions;
/* =========================================
   EXPORT EXCEL
========================================= */
const exportPermissionsExcel = async (req, res) => {
    try {
        const permissions = await prisma_1.default.permission.findMany();
        res.status(200).json({
            success: true,
            data: permissions,
            message: "Excel export ready",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.exportPermissionsExcel = exportPermissionsExcel;
/* =========================================
   EXPORT PDF
========================================= */
const exportPermissionsPdf = async (req, res) => {
    try {
        const permissions = await prisma_1.default.permission.findMany();
        res.status(200).json({
            success: true,
            data: permissions,
            message: "PDF export ready",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.exportPermissionsPdf = exportPermissionsPdf;
