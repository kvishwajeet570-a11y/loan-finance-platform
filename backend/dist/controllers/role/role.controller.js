"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAssignRoles = exports.bulkDeleteRoles = exports.bulkCreateRoles = exports.removePermissionFromRole = exports.assignPermissionToRole = exports.getRolePermissions = exports.getRoleUsers = exports.getUserRoles = exports.removeMultipleRoles = exports.assignMultipleRoles = exports.removeRoleFromUser = exports.assignRoleToUser = exports.cloneRole = exports.toggleRoleStatus = exports.deactivateRole = exports.activateRole = exports.deleteRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = exports.exportRolesPdf = exports.exportRolesExcel = exports.searchRoles = exports.getPartnerRoles = exports.getDsaRoles = exports.getCustomerRoles = exports.getAdminRoles = exports.getCustomRoles = exports.getSystemRoles = exports.getRoleAuditLogs = exports.getRoleHierarchy = exports.roleAnalytics = exports.getRoleDashboard = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   DASHBOARD & ANALYTICS
======================================== */
const getRoleDashboard = async (req, res) => {
    try {
        const [totalRoles, activeRoles, inactiveRoles, systemRoles, customRoles] = await Promise.all([
            prisma_1.default.role.count(),
            prisma_1.default.role.count({ where: { isActive: true } }),
            prisma_1.default.role.count({ where: { isActive: false } }),
            prisma_1.default.role.count({ where: { isSystem: true } }),
            prisma_1.default.role.count({ where: { isSystem: false } }),
        ]);
        res.status(200).json({
            success: true,
            message: "Role dashboard fetched successfully",
            data: {
                totalRoles,
                activeRoles,
                inactiveRoles,
                systemRoles,
                customRoles,
            },
        });
    }
    catch (error) {
        console.error("GET ROLE DASHBOARD ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dashboard data",
        });
    }
};
exports.getRoleDashboard = getRoleDashboard;
const roleAnalytics = async (req, res) => {
    try {
        const [totalRoles, activeRoles, inactiveRoles, totalPermissionsAssigned, totalUsersWithRole,] = await Promise.all([
            prisma_1.default.role.count(),
            prisma_1.default.role.count({ where: { isActive: true } }),
            prisma_1.default.role.count({ where: { isActive: false } }),
            prisma_1.default.rolePermission.count(),
            prisma_1.default.user.count({ where: { roleId: { not: null } } }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalRoles,
                activeRoles,
                inactiveRoles,
                totalPermissionsAssigned,
                totalUsersWithRole,
            },
        });
    }
    catch (error) {
        console.error("ROLE ANALYTICS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Analytics operation failed",
        });
    }
};
exports.roleAnalytics = roleAnalytics;
const getRoleHierarchy = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                code: true,
                parentRoleId: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Role hierarchy fetched successfully",
            data: roles,
        });
    }
    catch (error) {
        console.error("GET ROLE HIERARCHY ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch role hierarchy",
        });
    }
};
exports.getRoleHierarchy = getRoleHierarchy;
const getRoleAuditLogs = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 20, 1);
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.auditLog.count(),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: logs,
        });
    }
    catch (error) {
        console.error("GET ROLE AUDIT LOGS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch audit logs",
        });
    }
};
exports.getRoleAuditLogs = getRoleAuditLogs;
/* ========================================
   ROLE TYPES (SYSTEM / CUSTOM / CATEGORIES)
======================================== */
const getSystemRoles = async (req, res) => {
    try {
        const systemRoles = await prisma_1.default.role.findMany({
            where: { isSystem: true },
            orderBy: { name: "asc" },
        });
        res.status(200).json({
            success: true,
            data: systemRoles,
        });
    }
    catch (error) {
        console.error("GET SYSTEM ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch system roles",
        });
    }
};
exports.getSystemRoles = getSystemRoles;
const getCustomRoles = async (req, res) => {
    try {
        const customRoles = await prisma_1.default.role.findMany({
            where: { isSystem: false },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            data: customRoles,
        });
    }
    catch (error) {
        console.error("GET CUSTOM ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch custom roles",
        });
    }
};
exports.getCustomRoles = getCustomRoles;
const getAdminRoles = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            where: { category: "ADMIN" },
        });
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        console.error("GET ADMIN ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch admin roles",
        });
    }
};
exports.getAdminRoles = getAdminRoles;
const getCustomerRoles = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            where: { category: "CUSTOMER" },
        });
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        console.error("GET CUSTOMER ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch customer roles",
        });
    }
};
exports.getCustomerRoles = getCustomerRoles;
const getDsaRoles = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            where: { category: "DSA" },
        });
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        console.error("GET DSA ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch DSA roles",
        });
    }
};
exports.getDsaRoles = getDsaRoles;
const getPartnerRoles = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            where: { category: "PARTNER" },
        });
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        console.error("GET PARTNER ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch partner roles",
        });
    }
};
exports.getPartnerRoles = getPartnerRoles;
/* ========================================
   ROLE SEARCH
======================================== */
const searchRoles = async (req, res) => {
    try {
        const query = String(req.query.q || req.query.query || "").trim();
        if (!query) {
            res.status(200).json({ success: true, data: [] });
            return;
        }
        const roles = await prisma_1.default.role.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { code: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 20,
        });
        res.status(200).json({
            success: true,
            count: roles.length,
            data: roles,
        });
    }
    catch (error) {
        console.error("SEARCH ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Search failed",
        });
    }
};
exports.searchRoles = searchRoles;
/* ========================================
   ROLE EXPORTS
======================================== */
const exportRolesExcel = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            include: {
                _count: { select: { users: true, permissions: true } },
            },
        });
        res.status(200).json({
            success: true,
            message: "Roles exported for Excel processing",
            data: roles.map((r) => ({
                ID: r.id,
                Name: r.name,
                Code: r.code,
                Status: r.isActive ? "Active" : "Inactive",
                UsersCount: r._count.users,
                PermissionsCount: r._count.permissions,
                CreatedAt: r.createdAt,
            })),
        });
    }
    catch (error) {
        console.error("EXPORT EXCEL ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Excel export failed",
        });
    }
};
exports.exportRolesExcel = exportRolesExcel;
const exportRolesPdf = async (req, res) => {
    try {
        const roles = await prisma_1.default.role.findMany({
            select: { id: true, name: true, code: true, isActive: true },
        });
        res.status(200).json({
            success: true,
            message: "Roles payload generated for PDF stream",
            data: roles,
        });
    }
    catch (error) {
        console.error("EXPORT PDF ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "PDF export failed",
        });
    }
};
exports.exportRolesPdf = exportRolesPdf;
/* ========================================
   ROLE CRUD
======================================== */
const createRole = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        if (!name || !code) {
            res.status(400).json({
                success: false,
                message: "Name and code are required",
            });
            return;
        }
        const existingRole = await prisma_1.default.role.findFirst({
            where: {
                OR: [{ code }, { name }],
            },
        });
        if (existingRole) {
            res.status(409).json({
                success: false,
                message: "Role already exists",
            });
            return;
        }
        const role = await prisma_1.default.role.create({
            data: {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                description: description?.trim() || null,
            },
        });
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    }
    catch (error) {
        console.error("CREATE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create role",
        });
    }
};
exports.createRole = createRole;
const getAllRoles = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 20, 1);
        const search = String(req.query.search || "").trim();
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const [roles, total] = await Promise.all([
            prisma_1.default.role.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    permissions: {
                        include: { permission: true },
                    },
                },
            }),
            prisma_1.default.role.count({ where }),
        ]);
        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: roles,
        });
    }
    catch (error) {
        console.error("GET ALL ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch roles",
        });
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const role = await prisma_1.default.role.findUnique({
            where: { id },
            include: {
                permissions: {
                    include: { permission: true },
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                        isActive: true,
                        createdAt: true,
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
    catch (error) {
        console.error("GET ROLE BY ID ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch role",
        });
    }
};
exports.getRoleById = getRoleById;
const updateRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, code, description, isActive } = req.body;
        const existingRole = await prisma_1.default.role.findUnique({ where: { id } });
        if (!existingRole) {
            res.status(404).json({
                success: false,
                message: "Role not found",
            });
            return;
        }
        if (code) {
            const duplicateRole = await prisma_1.default.role.findFirst({
                where: {
                    code,
                    NOT: { id },
                },
            });
            if (duplicateRole) {
                res.status(409).json({
                    success: false,
                    message: "Role code already exists",
                });
                return;
            }
        }
        const updatedRole = await prisma_1.default.role.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(code !== undefined && { code: code.toUpperCase() }),
                ...(description !== undefined && { description }),
                ...(isActive !== undefined && { isActive }),
            },
        });
        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: updatedRole,
        });
    }
    catch (error) {
        console.error("UPDATE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Update failed",
        });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const role = await prisma_1.default.role.findUnique({ where: { id } });
        if (!role) {
            res.status(404).json({
                success: false,
                message: "Role not found",
            });
            return;
        }
        const assignedUsers = await prisma_1.default.user.count({
            where: { roleId: id },
        });
        if (assignedUsers > 0) {
            res.status(400).json({
                success: false,
                message: "Role is assigned to users. Remove assignments first.",
            });
            return;
        }
        await prisma_1.default.rolePermission.deleteMany({
            where: { roleId: id },
        });
        await prisma_1.default.role.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    }
    catch (error) {
        console.error("DELETE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Delete failed",
        });
    }
};
exports.deleteRole = deleteRole;
/* ========================================
   ROLE STATUS ACTIONS & CLONE
======================================== */
const activateRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const updatedRole = await prisma_1.default.role.update({
            where: { id },
            data: { isActive: true },
        });
        res.status(200).json({
            success: true,
            message: "Role activated successfully",
            data: updatedRole,
        });
    }
    catch (error) {
        console.error("ACTIVATE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to activate role",
        });
    }
};
exports.activateRole = activateRole;
const deactivateRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const updatedRole = await prisma_1.default.role.update({
            where: { id },
            data: { isActive: false },
        });
        res.status(200).json({
            success: true,
            message: "Role deactivated successfully",
            data: updatedRole,
        });
    }
    catch (error) {
        console.error("DEACTIVATE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to deactivate role",
        });
    }
};
exports.deactivateRole = deactivateRole;
const toggleRoleStatus = async (req, res) => {
    try {
        const id = String(req.params.id);
        const role = await prisma_1.default.role.findUnique({ where: { id } });
        if (!role) {
            res.status(404).json({
                success: false,
                message: "Role not found",
            });
            return;
        }
        const updatedRole = await prisma_1.default.role.update({
            where: { id },
            data: { isActive: !role.isActive },
        });
        res.status(200).json({
            success: true,
            message: `Role ${updatedRole.isActive ? "activated" : "deactivated"} successfully`,
            data: updatedRole,
        });
    }
    catch (error) {
        console.error("TOGGLE ROLE STATUS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Status update failed",
        });
    }
};
exports.toggleRoleStatus = toggleRoleStatus;
const cloneRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { newName, newCode } = req.body;
        if (!newName || !newCode) {
            res.status(400).json({
                success: false,
                message: "newName and newCode are required to clone a role",
            });
            return;
        }
        const sourceRole = await prisma_1.default.role.findUnique({
            where: { id },
            include: { permissions: true },
        });
        if (!sourceRole) {
            res.status(404).json({
                success: false,
                message: "Source role not found",
            });
            return;
        }
        const clonedRole = await prisma_1.default.$transaction(async (tx) => {
            const newRole = await tx.role.create({
                data: {
                    name: newName.trim(),
                    code: newCode.trim().toUpperCase(),
                    description: `Cloned from ${sourceRole.name}`,
                },
            });
            if (sourceRole.permissions.length > 0) {
                await tx.rolePermission.createMany({
                    data: sourceRole.permissions.map((p) => ({
                        roleId: newRole.id,
                        permissionId: p.permissionId,
                    })),
                });
            }
            return newRole;
        });
        res.status(201).json({
            success: true,
            message: "Role cloned successfully",
            data: clonedRole,
        });
    }
    catch (error) {
        console.error("CLONE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to clone role",
        });
    }
};
exports.cloneRole = cloneRole;
/* ========================================
   USER ROLE MANAGEMENT
======================================== */
const assignRoleToUser = async (req, res) => {
    try {
        const userId = String(req.body.userId);
        const roleId = String(req.body.roleId);
        if (!userId || !roleId) {
            res.status(400).json({
                success: false,
                message: "userId and roleId are required",
            });
            return;
        }
        const [user, role] = await Promise.all([
            prisma_1.default.user.findUnique({ where: { id: userId } }),
            prisma_1.default.role.findUnique({ where: { id: roleId } }),
        ]);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (!role) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { roleId },
            include: { roleRef: true },
        });
        res.status(200).json({
            success: true,
            message: "Role assigned successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("ASSIGN ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to assign role",
        });
    }
};
exports.assignRoleToUser = assignRoleToUser;
const removeRoleFromUser = async (req, res) => {
    try {
        const userId = String(req.body.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "userId is required",
            });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: { roleId: null },
            include: { roleRef: true },
        });
        res.status(200).json({
            success: true,
            message: "Role removed successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("REMOVE ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to remove role",
        });
    }
};
exports.removeRoleFromUser = removeRoleFromUser;
const assignMultipleRoles = async (req, res) => {
    try {
        const userIds = req.body.userIds.map(String);
        const roleId = String(req.body.roleId);
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "userIds array is required",
            });
            return;
        }
        const role = await prisma_1.default.role.findUnique({ where: { id: roleId } });
        if (!role) {
            res.status(404).json({ success: false, message: "Role not found" });
            return;
        }
        const result = await prisma_1.default.user.updateMany({
            where: { id: { in: userIds } },
            data: { roleId },
        });
        res.status(200).json({
            success: true,
            message: "Roles assigned successfully",
            affectedUsers: result.count,
        });
    }
    catch (error) {
        console.error("ASSIGN MULTIPLE ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to assign roles",
        });
    }
};
exports.assignMultipleRoles = assignMultipleRoles;
const removeMultipleRoles = async (req, res) => {
    try {
        const userIds = req.body.userIds.map(String);
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "userIds array is required",
            });
            return;
        }
        const result = await prisma_1.default.user.updateMany({
            where: { id: { in: userIds } },
            data: { roleId: null },
        });
        res.status(200).json({
            success: true,
            message: "Roles removed successfully",
            affectedUsers: result.count,
        });
    }
    catch (error) {
        console.error("REMOVE MULTIPLE ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to remove roles",
        });
    }
};
exports.removeMultipleRoles = removeMultipleRoles;
const getUserRoles = async (req, res) => {
    try {
        const userId = String(req.params.userId);
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { roleRef: true },
        });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({
            success: true,
            data: user.roleRef,
        });
    }
    catch (error) {
        console.error("GET USER ROLE ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user role",
        });
    }
};
exports.getUserRoles = getUserRoles;
const getRoleUsers = async (req, res) => {
    try {
        const roleId = String(req.params.roleId);
        const users = await prisma_1.default.user.findMany({
            where: { roleId },
            include: { roleRef: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            total: users.length,
            data: users,
        });
    }
    catch (error) {
        console.error("GET ROLE USERS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch role users",
        });
    }
};
exports.getRoleUsers = getRoleUsers;
/* ========================================
   PERMISSION MANAGEMENT
======================================== */
const getRolePermissions = async (req, res) => {
    try {
        const roleId = String(req.params.roleId);
        const permissions = await prisma_1.default.rolePermission.findMany({
            where: { roleId },
            include: { permission: true },
        });
        res.status(200).json({
            success: true,
            total: permissions.length,
            data: permissions.map((p) => p.permission),
        });
    }
    catch (error) {
        console.error("GET ROLE PERMISSIONS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch permissions",
        });
    }
};
exports.getRolePermissions = getRolePermissions;
const assignPermissionToRole = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        if (!roleId || !permissionId) {
            res.status(400).json({
                success: false,
                message: "roleId and permissionId are required",
            });
            return;
        }
        const assigned = await prisma_1.default.rolePermission.create({
            data: {
                roleId,
                permissionId,
            },
            include: {
                permission: true,
                Role: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission assigned to role successfully",
            data: assigned,
        });
    }
    catch (error) {
        console.error("ASSIGN PERMISSION ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to assign permission",
        });
    }
};
exports.assignPermissionToRole = assignPermissionToRole;
const removePermissionFromRole = async (req, res) => {
    try {
        const { roleId, permissionId } = req.body;
        if (!roleId || !permissionId) {
            res.status(400).json({
                success: false,
                message: "roleId and permissionId are required",
            });
            return;
        }
        await prisma_1.default.rolePermission.deleteMany({
            where: {
                roleId,
                permissionId,
            },
        });
        res.status(200).json({
            success: true,
            message: "Permission removed from role successfully",
        });
    }
    catch (error) {
        console.error("REMOVE PERMISSION ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to remove permission",
        });
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
/* ========================================
   BULK OPERATIONS
======================================== */
const bulkCreateRoles = async (req, res) => {
    try {
        const { roles } = req.body;
        if (!Array.isArray(roles) || roles.length === 0) {
            res.status(400).json({
                success: false,
                message: "roles array is required",
            });
            return;
        }
        const createdRoles = await prisma_1.default.role.createMany({
            data: roles.map((r) => ({
                name: r.name,
                code: String(r.code).toUpperCase(),
                description: r.description || null,
            })),
            skipDuplicates: true,
        });
        res.status(201).json({
            success: true,
            message: "Bulk role creation completed",
            count: createdRoles.count,
        });
    }
    catch (error) {
        console.error("BULK CREATE ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Bulk creation failed",
        });
    }
};
exports.bulkCreateRoles = bulkCreateRoles;
const bulkDeleteRoles = async (req, res) => {
    try {
        const { roleIds } = req.body;
        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            res.status(400).json({
                success: false,
                message: "roleIds array is required",
            });
            return;
        }
        await prisma_1.default.rolePermission.deleteMany({
            where: { roleId: { in: roleIds } },
        });
        const deleted = await prisma_1.default.role.deleteMany({
            where: { id: { in: roleIds } },
        });
        res.status(200).json({
            success: true,
            message: "Bulk role deletion completed",
            count: deleted.count,
        });
    }
    catch (error) {
        console.error("BULK DELETE ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Bulk deletion failed",
        });
    }
};
exports.bulkDeleteRoles = bulkDeleteRoles;
const bulkAssignRoles = async (req, res) => {
    try {
        const { assignments } = req.body; // e.g., [{ userId: "1", roleId: "2" }]
        if (!Array.isArray(assignments) || assignments.length === 0) {
            res.status(400).json({
                success: false,
                message: "assignments array is required",
            });
            return;
        }
        const operations = assignments.map((item) => prisma_1.default.user.update({
            where: { id: item.userId },
            data: { roleId: item.roleId },
        }));
        await prisma_1.default.$transaction(operations);
        res.status(200).json({
            success: true,
            message: "Bulk role assignment completed",
            count: assignments.length,
        });
    }
    catch (error) {
        console.error("BULK ASSIGN ROLES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Bulk assignment failed",
        });
    }
};
exports.bulkAssignRoles = bulkAssignRoles;
