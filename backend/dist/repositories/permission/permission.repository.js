"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class PermissionRepository {
    /* =========================
        CREATE PERMISSION
    ========================= */
    static async createPermission(data) {
        return prisma_1.prisma.permission.create({
            data
        });
    }
    /* =========================
        GET PERMISSION BY ID
    ========================= */
    static async getPermissionById(id) {
        return prisma_1.prisma.permission.findUnique({
            where: { id }
        });
    }
    /* =========================
        GET PERMISSION BY CODE
    ========================= */
    static async getPermissionByCode(code) {
        return prisma_1.prisma.permission.findUnique({
            where: { code }
        });
    }
    /* =========================
        GET ALL PERMISSIONS
    ========================= */
    static async getAllPermissions() {
        return prisma_1.prisma.permission.findMany({
            orderBy: {
                module: "asc"
            }
        });
    }
    /* =========================
        GET MODULE PERMISSIONS
    ========================= */
    static async getModulePermissions(module) {
        return prisma_1.prisma.permission.findMany({
            where: {
                module
            }
        });
    }
    /* =========================
        UPDATE PERMISSION
    ========================= */
    static async updatePermission(id, data) {
        return prisma_1.prisma.permission.update({
            where: {
                id
            },
            data
        });
    }
    /* =========================
        DELETE PERMISSION
    ========================= */
    static async deletePermission(id) {
        return prisma_1.prisma.permission.delete({
            where: { id }
        });
    }
    /* =========================
        ASSIGN ROLE PERMISSION
    ========================= */
    static async assignPermissionToRole(role, permissionId) {
        return prisma_1.prisma.rolePermission.create({
            data: {
                role,
                permissionId
            }
        });
    }
    /* =========================
        REMOVE ROLE PERMISSION
    ========================= */
    static async removePermissionFromRole(role, permissionId) {
        return prisma_1.prisma.rolePermission.deleteMany({
            where: {
                role,
                permissionId
            }
        });
    }
    /* =========================
        ROLE PERMISSIONS
    ========================= */
    static async getRolePermissions(role) {
        return prisma_1.prisma.rolePermission.findMany({
            where: {
                role
            },
            include: {
                permission: true
            }
        });
    }
    /* =========================
        CHECK ROLE PERMISSION
    ========================= */
    static async hasPermission(role, code) {
        const permission = await prisma_1.prisma.rolePermission.findFirst({
            where: {
                role,
                permission: {
                    code
                }
            },
            include: {
                permission: true
            }
        });
        return !!permission;
    }
    /* =========================
        BULK ASSIGN
    ========================= */
    static async bulkAssignPermissions(role, permissionIds) {
        return prisma_1.prisma.rolePermission.createMany({
            data: permissionIds.map(id => ({
                role,
                permissionId: id
            })),
            skipDuplicates: true
        });
    }
    /* =========================
        GET ROLES
    ========================= */
    static async getRoles() {
        return [
            "SUPER_ADMIN",
            "ADMIN",
            "EMPLOYEE",
            "DSA",
            "PARTNER",
            "CUSTOMER"
        ];
    }
    /* =========================
        SEARCH PERMISSIONS
    ========================= */
    static async searchPermissions(keyword) {
        return prisma_1.prisma.permission.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        code: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        module: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        PERMISSION ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalPermissions, totalRolePermissions] = await Promise.all([
            prisma_1.prisma.permission.count(),
            prisma_1.prisma.rolePermission.count()
        ]);
        return {
            totalPermissions,
            totalRolePermissions
        };
    }
}
exports.PermissionRepository = PermissionRepository;
