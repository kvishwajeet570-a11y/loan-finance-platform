"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PermissionRepository {
    /* =========================================
       CREATE
    ========================================= */
    static async create(data) {
        return prisma_1.default.permission.create({
            data: {
                name: data.name,
                code: data.code,
                module: data.module,
                action: data.action,
                description: data.description,
                slug: data.slug,
                status: data.status ?? "ACTIVE",
            },
        });
    }
    /* =========================================
       GET BY ID
    ========================================= */
    static async findById(id) {
        return prisma_1.default.permission.findUnique({
            where: { id },
            include: {
                rolePermissions: true,
                userPermissions: true,
            },
        });
    }
    /* =========================================
       GET BY CODE
    ========================================= */
    static async findByCode(code) {
        return prisma_1.default.permission.findUnique({
            where: { code },
        });
    }
    /* =========================================
       GET BY SLUG
    ========================================= */
    static async findBySlug(slug) {
        return prisma_1.default.permission.findUnique({
            where: { slug },
        });
    }
    /* =========================================
       GET ALL
    ========================================= */
    static async findAll() {
        return prisma_1.default.permission.findMany({
            include: {
                rolePermissions: true,
                userPermissions: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       UPDATE
    ========================================= */
    static async update(id, data) {
        return prisma_1.default.permission.update({
            where: { id },
            data,
        });
    }
    /* =========================================
       DELETE
    ========================================= */
    static async delete(id) {
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                permissionId: id,
            },
        });
        await prisma_1.default.userPermission.deleteMany({
            where: {
                permissionId: id,
            },
        });
        return prisma_1.default.permission.delete({
            where: { id },
        });
    }
    /* =========================================
       SEARCH
    ========================================= */
    static async search(keyword) {
        return prisma_1.default.permission.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: keyword,
                        },
                    },
                    {
                        code: {
                            contains: keyword,
                        },
                    },
                    {
                        module: {
                            contains: keyword,
                        },
                    },
                    {
                        action: {
                            contains: keyword,
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       ROLE PERMISSIONS
    ========================================= */
    static async assignPermissionToRole(role, permissionId) {
        return prisma_1.default.rolePermission.create({
            data: {
                roleId: role,
                permissionId,
            },
        });
    }
    static async removePermissionFromRole(role, permissionId) {
        return prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId: role,
                permissionId,
            },
        });
    }
    static async getRolePermissions(role) {
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId: role,
            },
            include: {
                permission: true,
            },
        });
    }
    /* =========================================
       USER PERMISSIONS
    ========================================= */
    static async assignPermissionToUser(userId, permissionId) {
        return prisma_1.default.userPermission.create({
            data: {
                userId,
                permissionId,
            },
        });
    }
    static async removePermissionFromUser(userId, permissionId) {
        return prisma_1.default.userPermission.deleteMany({
            where: {
                userId,
                permissionId,
            },
        });
    }
    static async getUserPermissions(userId) {
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
       BULK ASSIGN
    ========================================= */
    static async bulkAssignPermissions(role, permissionIds) {
        return prisma_1.default.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId: role,
                permissionId,
            })),
            skipDuplicates: true,
        });
    }
    /* =========================================
       MODULE PERMISSIONS
    ========================================= */
    static async getModulePermissions(module) {
        return prisma_1.default.permission.findMany({
            where: {
                module,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================================
       ANALYTICS
    ========================================= */
    static async getAnalytics() {
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
}
exports.PermissionRepository = PermissionRepository;
exports.default = PermissionRepository;
