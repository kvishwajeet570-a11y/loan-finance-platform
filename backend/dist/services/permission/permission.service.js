"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PermissionService {
    /* =========================================
       CREATE PERMISSION
    ========================================= */
    async createPermission(data) {
        const exists = await prisma_1.default.permission.findUnique({
            where: {
                code: data.code,
            },
        });
        if (exists) {
            throw new Error("Permission already exists");
        }
        return prisma_1.default.permission.create({
            data: {
                name: data.name,
                code: data.code,
                module: data.module,
                action: data.action,
                slug: data.slug,
                description: data.description,
                status: data.status ?? "ACTIVE",
            },
        });
    }
    /* =========================================
       GET PERMISSION BY ID
    ========================================= */
    async getPermissionById(permissionId) {
        return prisma_1.default.permission.findUnique({
            where: {
                id: permissionId,
            },
            include: {
                rolePermissions: true,
                userPermissions: true,
            },
        });
    }
    /* =========================================
       GET ALL PERMISSIONS
    ========================================= */
    async getAllPermissions(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
        const where = search
            ? {
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
                    {
                        action: {
                            contains: search,
                        },
                    },
                ],
            }
            : undefined;
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
        return {
            permissions,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /* =========================================
       ASSIGN PERMISSION TO ROLE
    ========================================= */
    async assignPermissionToRole(roleId, permissionId) {
        const exists = await prisma_1.default.rolePermission.findFirst({
            where: {
                roleId,
                permissionId,
            },
        });
        if (exists) {
            throw new Error("Permission already assigned");
        }
        return prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
        });
    }
    /* =========================================
       REMOVE PERMISSION FROM ROLE
    ========================================= */
    async removePermissionFromRole(roleId, permissionId) {
        return prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
    }
    /* =========================================
       GET ROLE PERMISSIONS
    ========================================= */
    async getRolePermissions(roleId) {
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId,
            },
            include: {
                permission: true,
            },
        });
    }
    /* =========================================
       CHECK ROLE PERMISSION
    ========================================= */
    async hasPermission(roleId, permissionSlug) {
        const permission = await prisma_1.default.rolePermission.findFirst({
            where: {
                roleId,
                permission: {
                    slug: permissionSlug,
                },
            },
        });
        return !!permission;
    }
    /* =========================================
       USER PERMISSIONS
    ========================================= */
    async getUserPermissions(userId) {
        return prisma_1.default.userPermission.findMany({
            where: {
                userId,
            },
            include: {
                permission: true,
            },
        });
    }
    /* =========================================
       UPDATE PERMISSION
    ========================================= */
    async updatePermission(permissionId, payload) {
        return prisma_1.default.permission.update({
            where: {
                id: permissionId,
            },
            data: payload,
        });
    }
    /* =========================================
       DELETE PERMISSION
    ========================================= */
    async deletePermission(permissionId) {
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                permissionId,
            },
        });
        await prisma_1.default.userPermission.deleteMany({
            where: {
                permissionId,
            },
        });
        return prisma_1.default.permission.delete({
            where: {
                id: permissionId,
            },
        });
    }
    /* =========================================
       ANALYTICS
    ========================================= */
    async getPermissionStats() {
        const [totalPermissions, totalRolePermissions, totalUserPermissions,] = await Promise.all([
            prisma_1.default.permission.count(),
            prisma_1.default.rolePermission.count(),
            prisma_1.default.userPermission.count(),
        ]);
        return {
            totalPermissions,
            totalRolePermissions,
            totalUserPermissions,
        };
    }
    /* =========================================
       MODULE PERMISSIONS
    ========================================= */
    async getModulePermissions(module) {
        return prisma_1.default.permission.findMany({
            where: {
                module,
            },
        });
    }
    async bulkAssignPermissions(roleId, permissionIds) {
        return prisma_1.default.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId,
                permissionId,
            })),
            skipDuplicates: true,
        });
    }
}
exports.default = new PermissionService();
