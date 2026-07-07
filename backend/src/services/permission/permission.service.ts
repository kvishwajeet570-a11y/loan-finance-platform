import prisma from "../../prisma/prisma";

interface CreatePermissionDTO {
  name: string;
  slug: string;
  module: string;
  description?: string;
}

class PermissionService {
  /**
   * Create Permission
   */
  async createPermission(
    data: CreatePermissionDTO
  ) {
    const exists =
      await prisma.permission.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (exists) {
      throw new Error(
        "Permission already exists"
      );
    }

    return prisma.permission.create({
      data,
    });
  }

  /**
   * Get Permission By Id
   */
  async getPermissionById(
    permissionId: string
  ) {
    return prisma.permission.findUnique({
      where: {
        id: permissionId,
      },

      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Get All Permissions
   */
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
                mode: "insensitive",
              },
            },
            {
              module: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

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

  /**
   * Assign Permission To Role
   */
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

  /**
   * Remove Permission From Role
   */
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

  /**
   * Get Role Permissions
   */
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

  /**
   * Check Permission
   */
  async hasPermission(
    roleId: string,
    permissionSlug: string
  ) {
    const permission =
      await prisma.rolePermission.findFirst({
        where: {
          roleId,

          permission: {
            slug:
              permissionSlug,
          },
        },
      });

    return !!permission;
  }

  /**
   * Get User Permissions
   */
  async getUserPermissions(
    userId: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission:
                    true,
                },
              },
            },
          },
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    return user.role.permissions.map(
      (item) =>
        item.permission
    );
  }

  /**
   * Update Permission
   */
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

  /**
   * Delete Permission
   */
  async deletePermission(
    permissionId: string
  ) {
    await prisma.rolePermission.deleteMany({
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

  /**
   * Permission Analytics
   */
  async getPermissionStats() {
    const [
      totalPermissions,
      totalRoles,
      totalMappings,
    ] = await Promise.all([
      prisma.permission.count(),

      prisma.role.count(),

      prisma.rolePermission.count(),
    ]);

    return {
      totalPermissions,
      totalRoles,
      totalMappings,
    };
  }

  /**
   * Module Permissions
   */
  async getModulePermissions(
    module: string
  ) {
    return prisma.permission.findMany({
      where: {
        module,
      },
    });
  }

  /**
   * Bulk Assign Permissions
   */
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