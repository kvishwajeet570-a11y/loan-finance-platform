import prisma from "../../prisma/prisma";

interface CreatePermissionDTO {
  name: string;
  code: string;
  module: string;
  action: string;
  slug?: string;
  description?: string;
  status?: string;
}

class PermissionService {
  /* =========================================
     CREATE PERMISSION
  ========================================= */

  async createPermission(
    data: CreatePermissionDTO
  ) {
    const exists =
      await prisma.permission.findUnique({
        where: {
          code: data.code,
        },
      });

    if (exists) {
      throw new Error(
        "Permission already exists"
      );
    }

    return prisma.permission.create({
      data: {
        name: data.name,
        code: data.code,
        module: data.module,
        action: data.action,
        slug: data.slug,
        description: data.description,
        status: data.status ?? "ACTIVE",
      },
    });
  }

  /* =========================================
     GET PERMISSION BY ID
  ========================================= */

  async getPermissionById(
    permissionId: string
  ) {
    return prisma.permission.findUnique({
      where: {
        id: permissionId,
      },

      include: {
        rolePermissions: true,
        userPermissions: true,
      },
    });
  }

  /* =========================================
     GET ALL PERMISSIONS
  ========================================= */

  async getAllPermissions(
    page = 1,
    limit = 20,
    search = ""
  ) {
    const skip =
      (page - 1) * limit;

    const where = search
      ? {
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
            {
              action: {
                contains: search,
              },
            },
          ],
        }
      : undefined;

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

    return {
      permissions,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /* =========================================
     ASSIGN PERMISSION TO ROLE
  ========================================= */

  async assignPermissionToRole(
    roleId: string,
    permissionId: string
  ) {
    const exists =
      await prisma.rolePermission.findFirst({
        where: {
          roleId,
          permissionId,
        },
      });

    if (exists) {
      throw new Error(
        "Permission already assigned"
      );
    }

    return prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  /* =========================================
     REMOVE PERMISSION FROM ROLE
  ========================================= */

  async removePermissionFromRole(
    roleId: string,
    permissionId: string
  ) {
    return prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }

  /* =========================================
     GET ROLE PERMISSIONS
  ========================================= */

  async getRolePermissions(
    roleId: string
  ) {
    return prisma.rolePermission.findMany({
      where: {
        roleId,
      },

      include: {
        permission: true,
      },
    });
  }

  /* =========================================
     CHECK ROLE PERMISSION
  ========================================= */

  async hasPermission(
    roleId: string,
    permissionSlug: string
  ) {
    const permission =
      await prisma.rolePermission.findFirst({
        where: {
          roleId,

          permission: {
            slug: permissionSlug,
          },
        },
      });

    return !!permission;
  }

  /* =========================================
     USER PERMISSIONS
  ========================================= */

  async getUserPermissions(
    userId: string
  ) {
    return prisma.userPermission.findMany({
      where: {
        userId,
      },

      include: {
        permission: true,
      },
    });
  }

  /* =========================================
     UPDATE PERMISSION
  ========================================= */

  async updatePermission(
    permissionId: string,
    payload: any
  ) {
    return prisma.permission.update({
      where: {
        id: permissionId,
      },

      data: payload,
    });
  }

  /* =========================================
     DELETE PERMISSION
  ========================================= */

  async deletePermission(
    permissionId: string
  ) {
    await prisma.rolePermission.deleteMany({
      where: {
        permissionId,
      },
    });

    await prisma.userPermission.deleteMany({
      where: {
        permissionId,
      },
    });

    return prisma.permission.delete({
      where: {
        id: permissionId,
      },
    });
  }

  /* =========================================
     ANALYTICS
  ========================================= */

  async getPermissionStats() {
    const [
      totalPermissions,
      totalRolePermissions,
      totalUserPermissions,
    ] = await Promise.all([
      prisma.permission.count(),
      prisma.rolePermission.count(),
      prisma.userPermission.count(),
    ]);

    return {
      totalPermissions,
      totalRolePermissions,
      totalUserPermissions,
    };
  }

  /* =========================================
     MODULE PERMISSIONS
  ========================================= */

  async getModulePermissions(
    module: string
  ) {
    return prisma.permission.findMany({
      where: {
        module,
      },
    });
  }

  async bulkAssignPermissions(
  roleId: string,
  permissionIds: string[]
) {
  return prisma.rolePermission.createMany({
    data: permissionIds.map(
      (permissionId) => ({
        roleId,
        permissionId,
      })
    ),
    skipDuplicates: true,
  });
}

}

export default new PermissionService();