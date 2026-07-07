import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE PERMISSION
 */
export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      module,
      description,
    } = req.body;

    const exists =
      await prisma.permission.findUnique({
        where: { code },
      });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Permission already exists",
      });
      return;
    }

    const permission =
      await prisma.permission.create({
        data: {
          name,
          code,
          module,
          description,
        },
      });

    res.status(201).json({
      success: true,
      data: permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create permission",
    });
  }
};

/**
 * GET ALL PERMISSIONS
 */
export const getAllPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = String(req.query.search || "");

    const skip = (page - 1) * limit;

    const where = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          module: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [permissions, total] =
      await Promise.all([
        prisma.permission.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.permission.count({
          where,
        }),
      ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: permissions,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
    });
  }
};

/**
 * GET PERMISSION BY ID
 */
export const getPermissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission =
      await prisma.permission.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!permission) {
      res.status(404).json({
        success: false,
        message: "Permission not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

/**
 * ASSIGN TO ROLE
 */
export const assignPermissionToRole =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        roleId,
        permissionId,
      } = req.body;

      const assigned =
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        });

      res.status(201).json({
        success: true,
        data: assigned,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Assignment failed",
      });
    }
  };

/**
 * REMOVE FROM ROLE
 */
export const removePermissionFromRole =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        roleId,
        permissionId,
      } = req.body;

      await prisma.rolePermission.deleteMany({
        where: {
          roleId,
          permissionId,
        },
      });

      res.status(200).json({
        success: true,
        message: "Permission removed",
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Removal failed",
      });
    }
  };

/**
 * TOGGLE STATUS
 */
export const togglePermissionStatus =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const permission =
        await prisma.permission.findUnique({
          where: {
            id: req.params.id,
          },
        });

      if (!permission) {
        res.status(404).json({
          success: false,
          message: "Permission not found",
        });
        return;
      }

      const updated =
        await prisma.permission.update({
          where: {
            id: req.params.id,
          },
          data: {
            isActive:
              !permission.isActive,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Update failed",
      });
    }
  };

/**
 * ANALYTICS
 */
export const permissionAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const [
        totalPermissions,
        activePermissions,
        assignedPermissions,
      ] = await Promise.all([
        prisma.permission.count(),
        prisma.permission.count({
          where: {
            isActive: true,
          },
        }),
        prisma.rolePermission.count(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalPermissions,
          activePermissions,
          assignedPermissions,
        },
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });
    }
  };