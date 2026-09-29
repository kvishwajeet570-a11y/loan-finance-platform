import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ========================================
   DASHBOARD & ANALYTICS
======================================== */

export const getRoleDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [totalRoles, activeRoles, inactiveRoles, systemRoles, customRoles] =
      await Promise.all([
        prisma.role.count(),
        prisma.role.count({ where: { isActive: true } }),
        prisma.role.count({ where: { isActive: false } }),
        prisma.role.count({ where: { isSystem: true } }),
        prisma.role.count({ where: { isSystem: false } }),
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
  } catch (error: any) {
    console.error("GET ROLE DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
};

export const roleAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalRoles,
      activeRoles,
      inactiveRoles,
      totalPermissionsAssigned,
      totalUsersWithRole,
    ] = await Promise.all([
      prisma.role.count(),
      prisma.role.count({ where: { isActive: true } }),
      prisma.role.count({ where: { isActive: false } }),
      prisma.rolePermission.count(),
      prisma.user.count({ where: { roleId: { not: null } } }),
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
  } catch (error: any) {
    console.error("ROLE ANALYTICS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Analytics operation failed",
    });
  }
};

export const getRoleHierarchy = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
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
  } catch (error: any) {
    console.error("GET ROLE HIERARCHY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch role hierarchy",
    });
  }
};

export const getRoleAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
  prisma.auditLog.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  }),
  prisma.auditLog.count(),
]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error: any) {
    console.error("GET ROLE AUDIT LOGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch audit logs",
    });
  }
};

/* ========================================
   ROLE TYPES (SYSTEM / CUSTOM / CATEGORIES)
======================================== */

export const getSystemRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const systemRoles = await prisma.role.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      data: systemRoles,
    });
  } catch (error: any) {
    console.error("GET SYSTEM ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch system roles",
    });
  }
};

export const getCustomRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customRoles = await prisma.role.findMany({
      where: { isSystem: false },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: customRoles,
    });
  } catch (error: any) {
    console.error("GET CUSTOM ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch custom roles",
    });
  }
};

export const getAdminRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      where: { category: "ADMIN" },
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error("GET ADMIN ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin roles",
    });
  }
};

export const getCustomerRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      where: { category: "CUSTOMER" },
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error("GET CUSTOMER ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch customer roles",
    });
  }
};

export const getDsaRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      where: { category: "DSA" },
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error("GET DSA ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch DSA roles",
    });
  }
};

export const getPartnerRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      where: { category: "PARTNER" },
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error("GET PARTNER ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch partner roles",
    });
  }
};

/* ========================================
   ROLE SEARCH
======================================== */

export const searchRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = String(req.query.q || req.query.query || "").trim();

    if (!query) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { code: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      },
      take: 20,
    });

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error: any) {
    console.error("SEARCH ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Search failed",
    });
  }
};

/* ========================================
   ROLE EXPORTS
======================================== */

export const exportRolesExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
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
  } catch (error: any) {
    console.error("EXPORT EXCEL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Excel export failed",
    });
  }
};

export const exportRolesPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      select: { id: true, name: true, code: true, isActive: true },
    });

    res.status(200).json({
      success: true,
      message: "Roles payload generated for PDF stream",
      data: roles,
    });
  } catch (error: any) {
    console.error("EXPORT PDF ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "PDF export failed",
    });
  }
};

/* ========================================
   ROLE CRUD
======================================== */

export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      res.status(400).json({
        success: false,
        message: "Name and code are required",
      });
      return;
    }

    const existingRole = await prisma.role.findFirst({
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

    const role = await prisma.role.create({
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
  } catch (error: any) {
    console.error("CREATE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create role",
    });
  }
};

export const getAllRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 20, 1);
    const search = String(req.query.search || "").trim();
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { code: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
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
      prisma.role.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: roles,
    });
  } catch (error: any) {
    console.error("GET ALL ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch roles",
    });
  }
};

export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const role = await prisma.role.findUnique({
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
  } catch (error: any) {
    console.error("GET ROLE BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch role",
    });
  }
};

export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { name, code, description, isActive } = req.body;

    const existingRole = await prisma.role.findUnique({ where: { id } });

    if (!existingRole) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    if (code) {
      const duplicateRole = await prisma.role.findFirst({
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

    const updatedRole = await prisma.role.update({
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
  } catch (error: any) {
    console.error("UPDATE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Update failed",
    });
  }
};

export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    const assignedUsers = await prisma.user.count({
      where: { roleId: id },
    });

    if (assignedUsers > 0) {
      res.status(400).json({
        success: false,
        message: "Role is assigned to users. Remove assignments first.",
      });
      return;
    }

    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    await prisma.role.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Delete failed",
    });
  }
};

/* ========================================
   ROLE STATUS ACTIONS & CLONE
======================================== */

export const activateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { isActive: true },
    });

    res.status(200).json({
      success: true,
      message: "Role activated successfully",
      data: updatedRole,
    });
  } catch (error: any) {
    console.error("ACTIVATE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to activate role",
    });
  }
};

export const deactivateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { isActive: false },
    });

    res.status(200).json({
      success: true,
      message: "Role deactivated successfully",
      data: updatedRole,
    });
  } catch (error: any) {
    console.error("DEACTIVATE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to deactivate role",
    });
  }
};

export const toggleRoleStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: { isActive: !role.isActive },
    });

    res.status(200).json({
      success: true,
      message: `Role ${updatedRole.isActive ? "activated" : "deactivated"} successfully`,
      data: updatedRole,
    });
  } catch (error: any) {
    console.error("TOGGLE ROLE STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Status update failed",
    });
  }
};

export const cloneRole = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const sourceRole = await prisma.role.findUnique({
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

    const clonedRole = await prisma.$transaction(async (tx) => {
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
  } catch (error: any) {
    console.error("CLONE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clone role",
    });
  }
};

/* ========================================
   USER ROLE MANAGEMENT
======================================== */

export const assignRoleToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.role.findUnique({ where: { id: roleId } }),
    ]);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!role) {
      res.status(404).json({ success: false, message: "Role not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { roleRef: true },
    });

    res.status(200).json({
      success: true,
      message: "Role assigned successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("ASSIGN ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign role",
    });
  }
};

export const removeRoleFromUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.body.userId);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId: null },
      include: { roleRef: true },
    });

    res.status(200).json({
      success: true,
      message: "Role removed successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("REMOVE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove role",
    });
  }
};

export const assignMultipleRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userIds = (req.body.userIds as string[]).map(String);
    const roleId = String(req.body.roleId);

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "userIds array is required",
      });
      return;
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!role) {
      res.status(404).json({ success: false, message: "Role not found" });
      return;
    }

    const result = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { roleId },
    });

    res.status(200).json({
      success: true,
      message: "Roles assigned successfully",
      affectedUsers: result.count,
    });
  } catch (error: any) {
    console.error("ASSIGN MULTIPLE ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign roles",
    });
  }
};

export const removeMultipleRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userIds = (req.body.userIds as string[]).map(String);

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "userIds array is required",
      });
      return;
    }

    const result = await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { roleId: null },
    });

    res.status(200).json({
      success: true,
      message: "Roles removed successfully",
      affectedUsers: result.count,
    });
  } catch (error: any) {
    console.error("REMOVE MULTIPLE ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove roles",
    });
  }
};

export const getUserRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
    console.error("GET USER ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user role",
    });
  }
};

export const getRoleUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = String(req.params.roleId);

    const users = await prisma.user.findMany({
      where: { roleId },
      include: { roleRef: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error("GET ROLE USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch role users",
    });
  }
};

/* ========================================
   PERMISSION MANAGEMENT
======================================== */

export const getRolePermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = String(req.params.roleId);

    const permissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });

    res.status(200).json({
      success: true,
      total: permissions.length,
      data: permissions.map((p) => p.permission),
    });
  } catch (error: any) {
    console.error("GET ROLE PERMISSIONS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch permissions",
    });
  }
};

export const assignPermissionToRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      res.status(400).json({
        success: false,
        message: "roleId and permissionId are required",
      });
      return;
    }

    const assigned = await prisma.rolePermission.create({
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
  } catch (error: any) {
    console.error("ASSIGN PERMISSION ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign permission",
    });
  }
};

export const removePermissionFromRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
      res.status(400).json({
        success: false,
        message: "roleId and permissionId are required",
      });
      return;
    }

    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Permission removed from role successfully",
    });
  } catch (error: any) {
    console.error("REMOVE PERMISSION ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to remove permission",
    });
  }
};

/* ========================================
   BULK OPERATIONS
======================================== */

export const bulkCreateRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles) || roles.length === 0) {
      res.status(400).json({
        success: false,
        message: "roles array is required",
      });
      return;
    }

    const createdRoles = await prisma.role.createMany({
      data: roles.map((r: any) => ({
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
  } catch (error: any) {
    console.error("BULK CREATE ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Bulk creation failed",
    });
  }
};

export const bulkDeleteRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "roleIds array is required",
      });
      return;
    }

    await prisma.rolePermission.deleteMany({
      where: { roleId: { in: roleIds } },
    });

    const deleted = await prisma.role.deleteMany({
      where: { id: { in: roleIds } },
    });

    res.status(200).json({
      success: true,
      message: "Bulk role deletion completed",
      count: deleted.count,
    });
  } catch (error: any) {
    console.error("BULK DELETE ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Bulk deletion failed",
    });
  }
};

export const bulkAssignRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assignments } = req.body; // e.g., [{ userId: "1", roleId: "2" }]

    if (!Array.isArray(assignments) || assignments.length === 0) {
      res.status(400).json({
        success: false,
        message: "assignments array is required",
      });
      return;
    }

    const operations = assignments.map((item: { userId: string; roleId: string }) =>
      prisma.user.update({
        where: { id: item.userId },
        data: { roleId: item.roleId },
      })
    );

    await prisma.$transaction(operations);

    res.status(200).json({
      success: true,
      message: "Bulk role assignment completed",
      count: assignments.length,
    });
  } catch (error: any) {
    console.error("BULK ASSIGN ROLES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Bulk assignment failed",
    });
  }
};