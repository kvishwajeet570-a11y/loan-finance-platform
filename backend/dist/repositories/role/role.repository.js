"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RoleRepository {
    /* =========================
        CREATE ROLE
    ========================= */
    static async createRole(data) {
        return prisma_1.default.role.create({
            data
        });
    }
    /* =========================
        GET ROLE BY ID
    ========================= */
    static async getRoleById(id) {
        return prisma_1.default.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }
    /* =========================
        GET ROLE BY CODE
    ========================= */
    static async getRoleByCode(code) {
        return prisma_1.default.role.findUnique({
            where: {
                code
            },
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });
    }
    /* =========================
        GET ALL ROLES
    ========================= */
    static async getAllRoles() {
        return prisma_1.default.role.findMany({
            include: {
                permissions: {
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =========================
        UPDATE ROLE
    ========================= */
    static async updateRole(id, data) {
        return prisma_1.default.role.update({
            where: {
                id
            },
            data
        });
    }
    /* =========================
        ACTIVATE ROLE
    ========================= */
    static async activateRole(id) {
        return prisma_1.default.role.update({
            where: {
                id
            },
            data: {
                isActive: true
            }
        });
    }
    /* =========================
        DEACTIVATE ROLE
    ========================= */
    static async deactivateRole(id) {
        return prisma_1.default.role.update({
            where: {
                id
            },
            data: {
                isActive: false
            }
        });
    }
    /* =========================
        DELETE ROLE
    ========================= */
    static async deleteRole(id) {
        return prisma_1.default.role.delete({
            where: { id }
        });
    }
    /* =========================
        ASSIGN PERMISSION
    ========================= */
    static async assignPermission(roleId, permissionId) {
        return prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId
            }
        });
    }
    /* =========================
        REMOVE PERMISSION
    ========================= */
    static async removePermission(roleId, permissionId) {
        return prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId
            }
        });
    }
    /* =========================
        ROLE PERMISSIONS
    ========================= */
    static async getRolePermissions(roleId) {
        return prisma_1.default.rolePermission.findMany({
            where: {
                roleId
            },
            include: {
                permission: true
            }
        });
    }
    /* =========================
        BULK ASSIGN
    ========================= */
    static async bulkAssignPermissions(roleId, permissionIds) {
        return prisma_1.default.rolePermission.createMany({
            data: permissionIds.map(permissionId => ({
                roleId,
                permissionId
            })),
            skipDuplicates: true
        });
    }
    /* =========================
        SEARCH ROLES
    ========================= */
    static async searchRoles(keyword) {
        return prisma_1.default.role.findMany({
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
                        description: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* =========================
        ROLE ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalRoles, activeRoles, totalPermissions] = await Promise.all([
            prisma_1.default.role.count(),
            prisma_1.default.role.count({
                where: {
                    isActive: true
                }
            }),
            prisma_1.default.rolePermission.count()
        ]);
        return {
            totalRoles,
            activeRoles,
            totalPermissions
        };
    }
    /* =========================
        ROLE DASHBOARD
    ========================= */
    static async getDashboard() {
        const [analytics, recentRoles] = await Promise.all([
            this.getAnalytics(),
            prisma_1.default.role.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc"
                }
            })
        ]);
        return {
            analytics,
            recentRoles
        };
    }
}
exports.RoleRepository = RoleRepository;
