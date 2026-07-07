import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE ROLE
 */
export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, code, description } = req.body;

    const existingRole =
      await prisma.role.findUnique({
        where: { code },
      });

    if (existingRole) {
      res.status(400).json({
        success: false,
        message: "Role already exists",
      });
      return;
    }

    const role = await prisma.role.create({
      data: {
        name,
        code,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create role",
    });
  }
};

/**
 * GET ALL ROLES
 */
export const getAllRoles = async (
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
          code: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [roles, total] =
      await Promise.all([
        prisma.role.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        }),
        prisma.role.count({
          where,
        }),
      ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: roles,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};

/**
 * GET ROLE BY ID
 */
export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        permissions: {
          include: {
            permission: true,
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
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

/**
 * UPDATE ROLE
 */
export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await prisma.role.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });

    res.status(200).json({
      success: true,
      message: "Role updated",
      data: role,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/**
 * TOGGLE ROLE STATUS
 */
export const toggleRoleStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    const updatedRole =
      await prisma.role.update({
        where: {
          id: req.params.id,
        },
        data: {
          isActive: !role.isActive,
        },
      });

    res.status(200).json({
      success: true,
      data: updatedRole,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

/**
 * DELETE ROLE
 */
export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.role.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Role deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/**
 * ROLE ANALYTICS
 */
export const roleAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalRoles,
      activeRoles,
      totalAssignments,
    ] = await Promise.all([
      prisma.role.count(),
      prisma.role.count({
        where: {
          isActive: true,
        },
      }),
      prisma.rolePermission.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRoles,
        activeRoles,
        totalAssignments,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};