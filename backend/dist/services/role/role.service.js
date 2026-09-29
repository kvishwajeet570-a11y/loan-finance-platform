"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RoleService {
    async createRole(data) {
        const existingRole = await prisma_1.default.role.findFirst({
            where: {
                OR: [
                    { name: data.name },
                    { code: data.code },
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
    async updateRole(roleId, payload) {
        return prisma_1.default.role.update({
            where: {
                id: roleId,
            },
            data: payload,
        });
    }
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
    async removePermission(roleId, permissionId) {
        return prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
    }
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
    async cloneRole(roleId, newRoleName, newRoleCode) {
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
                code: newRoleCode,
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
    async seedDefaultRoles() {
        const roles = [
            {
                name: "Super Admin",
                code: "super_admin",
            },
            {
                name: "Admin",
                code: "admin",
            },
            {
                name: "Manager",
                code: "manager",
            },
            {
                name: "DSA",
                code: "dsa",
            },
            {
                name: "Partner",
                code: "partner",
            },
            {
                name: "Customer",
                code: "customer",
            },
        ];
        for (const role of roles) {
            await prisma_1.default.role.upsert({
                where: {
                    code: role.code,
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
