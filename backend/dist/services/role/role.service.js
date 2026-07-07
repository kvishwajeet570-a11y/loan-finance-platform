"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RoleService {
    /**
     * Create Role
     */
    async createRole(data) {
        const existingRole = await prisma_1.default.role.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { slug: data.slug },
                ],
            },
        });
        if (existingRole) {
            throw new Error("Role already exists");
        }
        return prisma_1.default.role.create({
            data,
        });
    }
    /**
     * Get Role By ID
     */
    async getRoleById(roleId) {
        return prisma_1.default.role.findUnique({
            where: {
                id: roleId,
            },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    /**
     * Get All Roles
     */
    async getAllRoles() {
        return prisma_1.default.role.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    /**
     * Update Role
     */
    async updateRole(roleId, payload) {
        return prisma_1.default.role.update({
            where: {
                id: roleId,
            },
            data: payload,
        });
    }
    /**
     * Delete Role
     */
    async deleteRole(roleId) {
        const users = await prisma_1.default.user.count({
            where: {
                roleId,
            },
        });
        if (users > 0) {
            throw new Error("Users assigned to this role");
        }
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
            },
        });
        return prisma_1.default.role.delete({
            where: {
                id: roleId,
            },
        });
    }
    /**
     * Assign Role To User
     */
    async assignRoleToUser(userId, roleId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                roleId,
            },
        });
    }
    /**
     * Remove User Role
     */
    async removeRoleFromUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                roleId: null,
            },
        });
    }
    /**
     * Assign Permission To Role
     */
    async assignPermission(roleId, permissionId) {
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
     * Remove Permission
     */
    async removePermission(roleId, permissionId) {
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
     * Role Users
     */
    async getRoleUsers(roleId) {
        return prisma_1.default.user.findMany({
            where: {
                roleId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
            },
        });
    }
    /**
     * Clone Role
     */
    async cloneRole(roleId, newRoleName, newRoleSlug) {
        const role = await prisma_1.default.role.findUnique({
            where: {
                id: roleId,
            },
            include: {
                permissions: true,
            },
        });
        if (!role) {
            throw new Error("Role not found");
        }
        const newRole = await prisma_1.default.role.create({
            data: {
                name: newRoleName,
                slug: newRoleSlug,
                description: role.description,
            },
        });
        if (role.permissions.length) {
            await prisma_1.default.rolePermission.createMany({
                data: role.permissions.map((permission) => ({
                    roleId: newRole.id,
                    permissionId: permission.permissionId,
                })),
            });
        }
        return newRole;
    }
    /**
     * Role Analytics
     */
    async getRoleStats() {
        const [totalRoles, totalUsers, totalPermissions, totalMappings,] = await Promise.all([
            prisma_1.default.role.count(),
            prisma_1.default.user.count(),
            prisma_1.default.permission.count(),
            prisma_1.default.rolePermission.count(),
        ]);
        return {
            totalRoles,
            totalUsers,
            totalPermissions,
            totalMappings,
        };
    }
    /**
     * Seed Default Roles
     */
    async seedDefaultRoles() {
        const roles = [
            {
                name: "Super Admin",
                slug: "super_admin",
            },
            {
                name: "Admin",
                slug: "admin",
            },
            {
                name: "Manager",
                slug: "manager",
            },
            {
                name: "DSA",
                slug: "dsa",
            },
            {
                name: "Partner",
                slug: "partner",
            },
            {
                name: "Customer",
                slug: "customer",
            },
        ];
        for (const role of roles) {
            await prisma_1.default.role.upsert({
                where: {
                    slug: role.slug,
                },
                update: {},
                create: role,
            });
        }
        return {
            success: true,
            rolesCreated: roles.length,
        };
    }
}
exports.default = new RoleService();
