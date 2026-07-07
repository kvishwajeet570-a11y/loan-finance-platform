import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * ASSIGN PERMISSION TO ROLE
 */
export const assignPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionId } = req.body;

    const exists =
      await prisma.rolePermission.findFirst({
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

    const mapping =
      await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
          assignedBy: req.user?.id,
        },
        include: {
          role: true,
          permission: true,
        },
      });

    res.status(201).json({
      success: true,
      data: mapping,
    });
  } catch (error) {
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
    const {
      roleId,
      permissionIds,
    } = req.body;

    const data = permissionIds.map(
      (permissionId: string) => ({
        roleId,
        permissionId,
        assignedBy: req.user?.id,
      })
    );

    await prisma.rolePermission.createMany({
      data,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message:
        "Permissions assigned successfully",
    });
  } catch {
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
    const roleId = req.params.roleId;

    const permissions =
      await prisma.rolePermission.findMany({
        where: {
          roleId,
        },
        include: {
          permission: true,
        },
      });

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch permissions",
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
    const { roleId, permissionId } =
      req.body;

    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });

    res.status(200).json({
      success: true,
      message:
        "Permission removed successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Removal failed",
    });
  }
};

/**
 * REMOVE ALL ROLE PERMISSIONS
 */
export const removeAllPermissions =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const roleId =
        req.params.roleId;

      await prisma.rolePermission.deleteMany({
        where: {
          roleId,
        },
      });

      res.status(200).json({
        success: true,
        message:
          "All permissions removed",
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Operation failed",
      });
    }
  };

/**
 * ROLE PERMISSION ANALYTICS
 */
export const rolePermissionAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const [
        totalMappings,
        totalRoles,
        totalPermissions,
      ] = await Promise.all([
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
    } catch {
      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });
    }
  };