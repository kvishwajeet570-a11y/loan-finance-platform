import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* =========================================
   CREATE PERMISSION
========================================= */

export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission = await prisma.permission.create({
      data: {
        name: req.body.name,
        code: req.body.code,
        module: req.body.module,
        action: req.body.action,
        description: req.body.description,
        status: req.body.status ?? "ACTIVE",
        slug: req.body.slug,
      },
    });

    res.status(201).json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET ALL PERMISSIONS
========================================= */

export const getAllPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET PERMISSION BY ID
========================================= */

export const getPermissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: String(req.params.id),
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   UPDATE PERMISSION
========================================= */

export const updatePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permission = await prisma.permission.update({
      where: {
        id: String(req.params.id),
      },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DELETE PERMISSION
========================================= */

export const deletePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.permission.delete({
      where: {
        id: String(req.params.id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   ASSIGN PERMISSION TO ROLE
========================================= */

export const assignPermissionToRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { permissionId } = req.body;
    const role = String(req.params.roleId);

    const result = await prisma.rolePermission.create({
      data: {
  roleId: role,
  permissionId,
},
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   REMOVE PERMISSION FROM ROLE
========================================= */

export const removePermissionFromRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = String(req.params.roleId);
    const permissionId = String(req.params.permissionId);

    await prisma.rolePermission.deleteMany({
      where: {
  roleId: role,
  permissionId,
},
    });

    res.status(200).json({
      success: true,
      message: "Permission removed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET ROLE PERMISSIONS
========================================= */

export const getRolePermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = String(req.params.roleId);

    const permissions =
      await prisma.rolePermission.findMany({
        where: {
  roleId: role,
},
include: {
  Role: true,
  permission: true,
},
      });

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   USER PERMISSIONS
========================================= */

export const getUserPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = String(req.params.userId);

  const permissions =
    await prisma.userPermission.findMany({
      where: {
        userId,
      },
      include: {
        permission: true,
      },
    });

  res.json({
    success: true,
    data: permissions,
  });
};

export const assignPermissionToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = String(req.params.userId);

  const result =
    await prisma.userPermission.create({
      data: {
        userId,
        permissionId: req.body.permissionId,
      },
    });

  res.json({
    success: true,
    data: result,
  });
};

export const removePermissionFromUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = String(req.params.userId);
  const permissionId =
    String(req.params.permissionId);

  await prisma.userPermission.deleteMany({
    where: {
      userId,
      permissionId,
    },
  });

  res.json({
    success: true,
    message: "Removed successfully",
  });
};

/* =========================================
   SEARCH PERMISSIONS
========================================= */

export const searchPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = String(req.query.search || "");

    const permissions = await prisma.permission.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            module: {
              contains: search,
            },
          },
          {
            code: {
              contains: search,
            },
          },
        ],
      },
    });

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   ANALYTICS
========================================= */

export const getPermissionAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalPermissions =
      await prisma.permission.count();

    const totalRolePermissions =
      await prisma.rolePermission.count();

    const totalUserPermissions =
      await prisma.userPermission.count();

    res.status(200).json({
      success: true,
      data: {
        totalPermissions,
        totalRolePermissions,
        totalUserPermissions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DASHBOARD
========================================= */

export const getPermissionDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions =
      await prisma.permission.findMany();

    const roles =
      await prisma.rolePermission.count();

    const users =
      await prisma.userPermission.count();

    res.status(200).json({
      success: true,
      data: {
        permissions,
        roles,
        users,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET MODULES
========================================= */

export const getModules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const modules =
      await prisma.permission.findMany({
        select: {
          module: true,
        },
        distinct: ["module"],
      });

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET ACTIONS
========================================= */

export const getActions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const actions =
      await prisma.permission.findMany({
        select: {
          action: true,
        },
        distinct: ["action"],
      });

    res.status(200).json({
      success: true,
      data: actions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   BULK ASSIGN
========================================= */

export const bulkAssignPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionIds } =
      req.body;

    await prisma.rolePermission.createMany({
      data: permissionIds.map(
        (permissionId: string) => ({
          roleId,
          permissionId,
        })
      ),
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Permissions assigned",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   BULK REMOVE
========================================= */

export const bulkRemovePermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleId, permissionIds } =
      req.body;

    await prisma.rolePermission.deleteMany({
      where: {
  roleId,
  permissionId: {
    in: permissionIds,
  },
},
    });

    res.status(200).json({
      success: true,
      message: "Permissions removed",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   EXPORT EXCEL
========================================= */

export const exportPermissionsExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions =
      await prisma.permission.findMany();

    res.status(200).json({
      success: true,
      data: permissions,
      message: "Excel export ready",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   EXPORT PDF
========================================= */

export const exportPermissionsPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions =
      await prisma.permission.findMany();

    res.status(200).json({
      success: true,
      data: permissions,
      message: "PDF export ready",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};