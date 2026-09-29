"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RolePermissionService {
    /* =========================================
       ASSIGN SINGLE PERMISSION
    ========================================= */
    static async assignPermission(roleId, permissionId) {
        const role = await prisma_1.default.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new Error("Role not found");
        }
        const permission = await prisma_1.default.permission.findUnique({
            where: { id: permissionId },
        });
        if (!permission) {
            throw new Error("Permission not found");
        }
        const exists = await prisma_1.default.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
        if (exists) {
            throw new Error("Permission already assigned to this role");
        }
        return prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
            include: {
                Role: true,
                permission: true,
            },
        });
    }
    /* =========================================
       BULK ASSIGN PERMISSIONS
    ========================================= */
    static async bulkAssignPermissions(roleId, permissionIds) {
        if (!permissionIds.length) {
            throw new Error("Permission list is empty");
        }
        const role = await prisma_1.default.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new Error("Role not found");
        }
        const permissions = await prisma_1.default.permission.findMany({
            where: {
                id: {
                    in: permissionIds,
                },
            },
            select: {
                id: true,
            },
        });
        const validPermissionIds = permissions.map((permission) => permission.id);
        if (!validPermissionIds.length) {
            throw new Error("No valid permissions found");
        }
        await prisma_1.default.rolePermission.createMany({
            data: validPermissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
            skipDuplicates: true,
        });
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                Role: true,
                permission: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       GET ROLE PERMISSIONS
    ========================================= */
    static async getRolePermissions(roleId) {
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                Role: true,
                permission: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       REMOVE SINGLE PERMISSION
    ========================================= */
    static async removePermission(roleId, permissionId) {
        const exists = await prisma_1.default.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
        if (!exists) {
            throw new Error("Role permission not found");
        }
        await prisma_1.default.rolePermission.delete({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
        return {
            success: true,
            message: "Permission removed successfully",
        };
    }
    /* =========================================
       REMOVE ALL ROLE PERMISSIONS
    ========================================= */
    static async removeAllPermissions(roleId) {
        const role = await prisma_1.default.role.findUnique({
            where: {
                id: roleId,
            },
        });
        if (!role) {
            throw new Error("Role not found");
        }
        const result = await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
            },
        });
        return {
            success: true,
            deletedCount: result.count,
            message: "All role permissions removed successfully",
        };
    }
    /* =========================================
       COPY ROLE PERMISSIONS
    ========================================= */
    static async copyRolePermissions(sourceRoleId, targetRoleId) {
        if (sourceRoleId === targetRoleId) {
            throw new Error("Source and target roles cannot be the same");
        }
        const [sourceRole, targetRole] = await Promise.all([
            prisma_1.default.role.findUnique({
                where: {
                    id: sourceRoleId,
                },
            }),
            prisma_1.default.role.findUnique({
                where: {
                    id: targetRoleId,
                },
            }),
        ]);
        if (!sourceRole) {
            throw new Error("Source role not found");
        }
        if (!targetRole) {
            throw new Error("Target role not found");
        }
        const permissions = await prisma_1.default.rolePermission.findMany({
            where: {
                roleId: sourceRoleId,
            },
            select: {
                permissionId: true,
            },
        });
        if (!permissions.length) {
            throw new Error("Source role has no permissions");
        }
        await prisma_1.default.rolePermission.createMany({
            data: permissions.map((item) => ({
                roleId: targetRoleId,
                permissionId: item.permissionId,
            })),
            skipDuplicates: true,
        });
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId: targetRoleId,
            },
            include: {
                Role: true,
                permission: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
     GET ROLES BY PERMISSION
  ========================================= */
    static async getPermissionRoles(permissionId) {
        return prisma_1.default.rolePermission.findMany({
            where: {
                permissionId,
            },
            include: {
                Role: true,
                permission: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       CHECK ROLE HAS PERMISSION
    ========================================= */
    static async hasPermission(roleId, permissionId) {
        const mapping = await prisma_1.default.rolePermission.findUnique({
            where: {
                roleId_permissionId: {
                    roleId,
                    permissionId,
                },
            },
        });
        return !!mapping;
    }
    /* =========================================
       GET ROLE PERMISSION COUNT
    ========================================= */
    static async getRolePermissionCount(roleId) {
        return prisma_1.default.rolePermission.count({
            where: {
                roleId,
            },
        });
    }
    /* =========================================
       ROLE PERMISSION ANALYTICS
    ========================================= */
    static async getAnalytics() {
        const [totalMappings, totalRoles, totalPermissions,] = await Promise.all([
            prisma_1.default.rolePermission.count(),
            prisma_1.default.role.count(),
            prisma_1.default.permission.count(),
        ]);
        const topRoles = await prisma_1.default.role.findMany({
            include: {
                _count: {
                    select: {
                        permissions: true,
                    },
                },
            },
            orderBy: {
                permissions: {
                    _count: "desc",
                },
            },
            take: 10,
        });
        return {
            totalMappings,
            totalRoles,
            totalPermissions,
            topRoles,
        };
    }
}
exports.RolePermissionService = RolePermissionService;
exports.default = RolePermissionService;
