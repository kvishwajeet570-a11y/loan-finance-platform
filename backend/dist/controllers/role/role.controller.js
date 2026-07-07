"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleAnalytics = exports.deleteRole = exports.toggleRoleStatus = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE ROLE
 */
const createRole = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        const existingRole = await prisma_1.default.role.findUnique({
            where: { code },
        });
        if (existingRole) {
            res.status(400).json({
                success: false,
                message: "Role already exists",
            });
            return;
        }
        const role = await prisma_1.default.role.create({
            data: {
                name,
                code,
                description,
            },
        });
        res.status(201).json({
            success: true,
            data: role,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create role",
        });
    }
};
exports.createRole = createRole;
/**
 * GET ALL ROLES
 */
const getAllRoles = async (req, res) => {
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
                    code: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        };
        const [roles, total] = await Promise.all([
            prisma_1.default.role.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            }),
            prisma_1.default.role.count({
                where,
            }),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: roles,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch roles",
        });
    }
};
exports.getAllRoles = getAllRoles;
/**
 * GET ROLE BY ID
 */
const getRoleById = async (req, res) => {
    try {
        const role = await prisma_1.default.role.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
        if (!role) {
            res.status(404).json({
                success: false,
                message: "Role not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: role,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getRoleById = getRoleById;
/**
 * UPDATE ROLE
 */
const updateRole = async (req, res) => {
    try {
        const role = await prisma_1.default.role.update({
            where: {
                id: req.params.id,
            },
            data: {
                ...req.body,
            },
        });
        res.status(200).json({
            success: true,
            message: "Role updated",
            data: role,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.updateRole = updateRole;
/**
 * TOGGLE ROLE STATUS
 */
const toggleRoleStatus = async (req, res) => {
    try {
        const role = await prisma_1.default.role.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!role) {
            res.status(404).json({
                success: false,
                message: "Role not found",
            });
            return;
        }
        const updatedRole = await prisma_1.default.role.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: !role.isActive,
            },
        });
        res.status(200).json({
            success: true,
            data: updatedRole,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Status update failed",
        });
    }
};
exports.toggleRoleStatus = toggleRoleStatus;
/**
 * DELETE ROLE
 */
const deleteRole = async (req, res) => {
    try {
        await prisma_1.default.role.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Role deleted",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteRole = deleteRole;
/**
 * ROLE ANALYTICS
 */
const roleAnalytics = async (req, res) => {
    try {
        const [totalRoles, activeRoles, totalAssignments,] = await Promise.all([
            prisma_1.default.role.count(),
            prisma_1.default.role.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.rolePermission.count(),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalRoles,
                activeRoles,
                totalAssignments,
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
exports.roleAnalytics = roleAnalytics;
