import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/**
 * ASSIGN PERMISSION TO ROLE
 */
export const assignPermission = async (
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

    const exists = await prisma.rolePermission.findFirst({
      where: {
        roleId,
        permissionId,
      },
    });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Permission already assigned",
      });
      return;
    }

    const mapping = await prisma.rolePermission.create({
  data: {
    roleId,
    permissionId,
  },
  include: {
    Role: true,
    permission: true,
  },
});

    res.status(201).json({
      success: true,
      message: "Permission assigned successfully",
      data: mapping,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Assignment failed",
    });
  }
};

/**
 * BULK ASSIGN PERMISSIONS
 */
export const bulkAssignPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionIds } = req.body;

    if (!roleId || !Array.isArray(permissionIds)) {
      res.status(400).json({
        success: false,
        message: "Invalid request",
      });
      return;
    }

    const data = permissionIds.map((permissionId: string) => ({
      roleId,
      permissionId,
    }));

    await prisma.rolePermission.createMany({
      data,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Bulk assignment failed",
    });
  }
};

/**
 * GET ROLE PERMISSIONS
 */
export const getRolePermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = String(req.params.roleId);

    const permissions = await prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
    Role: true,
    permission: true,
},
    });

    res.status(200).json({
      success: true,
      message: "Role permissions fetched successfully",
      count: permissions.length,
      data: permissions,
    });
  } catch (error) {
    console.error("Get Role Permissions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};

/**
 * REMOVE PERMISSION
 */
export const removePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionId } = req.body;

    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Permission removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Removal failed",
    });
  }
};
/**
 * REMOVE ALL ROLE PERMISSIONS
 */
export const removeAllPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = String(req.params.roleId);

    const result = await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    res.status(200).json({
      success: true,
      message: "All permissions removed successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Remove All Permissions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove permissions",
      error:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
};
/**
 * ROLE PERMISSION ANALYTICS
 */
export const rolePermissionAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [totalMappings, totalRoles, totalPermissions] =
      await Promise.all([
        prisma.rolePermission.count(),
        prisma.role.count(),
        prisma.permission.count(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalMappings,
        totalRoles,
        totalPermissions,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};