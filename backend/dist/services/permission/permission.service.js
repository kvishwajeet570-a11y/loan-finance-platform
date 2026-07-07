"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PermissionService {
    /**
     * Create Permission
     */
    async createPermission(data) {
        const exists = await prisma_1.default.permission.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (exists) {
            throw new Error("Permission already exists");
        }
        return prisma_1.default.permission.create({
            data,
        });
    }
    /**
     * Get Permission By Id
     */
    async getPermissionById(permissionId) {
        return prisma_1.default.permission.findUnique({
            where: {
                id: permissionId,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    /**
     * Get All Permissions
     */
    async getAllPermissions(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
        const where = search
            ? {
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
            }
            : {};
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
    /**
     * Assign Permission To Role
     */
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
    /**
     * Remove Permission From Role
     */
    async removePermissionFromRole(roleId, permissionId) {
        return prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
    }
    /**
     * Get Role Permissions
     */
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
    /**
     * Check Permission
     */
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
    /**
     * Get User Permissions
     */
    async getUserPermissions(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user.role.permissions.map((item) => item.permission);
    }
    /**
     * Update Permission
     */
    async updatePermission(permissionId, payload) {
        return prisma_1.default.permission.update({
            where: {
                id: permissionId,
            },
            data: payload,
        });
    }
    /**
     * Delete Permission
     */
    async deletePermission(permissionId) {
        await prisma_1.default.rolePermission.deleteMany({
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
    /**
     * Permission Analytics
     */
    async getPermissionStats() {
        const [totalPermissions, totalRoles, totalMappings,] = await Promise.all([
            prisma_1.default.permission.count(),
            prisma_1.default.role.count(),
            prisma_1.default.rolePermission.count(),
        ]);
        return {
            totalPermissions,
            totalRoles,
            totalMappings,
        };
    }
    /**
     * Module Permissions
     */
    async getModulePermissions(module) {
        return prisma_1.default.permission.findMany({
            where: {
                module,
            },
        });
    }
    /**
     * Bulk Assign Permissions
     */
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
