import prisma from "../../prisma/prisma";

interface CreateRoleDTO {
  name: string;
  slug: string;
  description?: string;
}

class RoleService {
  /**
   * Create Role
   */
  async createRole(
    data: CreateRoleDTO
  ) {
    const existingRole =
      await prisma.role.findFirst({
        where: {
          OR: [
            { name: data.name },
            { slug: data.slug },
          ],
        },
      });

    if (existingRole) {
      throw new Error(
        "Role already exists"
      );
    }

    return prisma.role.create({
      data,
    });
  }

  /**
   * Get Role By ID
   */
  async getRoleById(
    roleId: string
  ) {
    return prisma.role.findUnique({
      where: {
        id: roleId,
      },

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },

        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get All Roles
   */
  async getAllRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },

        _count: {
          select: {
            users: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Update Role
   */
  async updateRole(
    roleId: string,
    payload: Partial<CreateRoleDTO>
  ) {
    return prisma.role.update({
      where: {
        id: roleId,
      },

      data: payload,
    });
  }

  /**
   * Delete Role
   */
  async deleteRole(
    roleId: string
  ) {
    const users =
      await prisma.user.count({
        where: {
          roleId,
        },
      });

    if (users > 0) {
      throw new Error(
        "Users assigned to this role"
      );
    }

    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    return prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }

  /**
   * Assign Role To User
   */
  async assignRoleToUser(
    userId: string,
    roleId: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        roleId,
      },
    });
  }

  /**
   * Remove User Role
   */
  async removeRoleFromUser(
    userId: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        roleId: null,
      },
    });
  }

  /**
   * Assign Permission To Role
   */
  async assignPermission(
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
   * Remove Permission
   */
  async removePermission(
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
   * Role Users
   */
  async getRoleUsers(
    roleId: string
  ) {
    return prisma.user.findMany({
      where: {
        roleId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
      },
    });
  }

  /**
   * Clone Role
   */
  async cloneRole(
    roleId: string,
    newRoleName: string,
    newRoleSlug: string
  ) {
    const role =
      await prisma.role.findUnique({
        where: {
          id: roleId,
        },

        include: {
          permissions: true,
        },
      });

    if (!role) {
      throw new Error(
        "Role not found"
      );
    }

    const newRole =
      await prisma.role.create({
        data: {
          name: newRoleName,
          slug: newRoleSlug,
          description:
            role.description,
        },
      });

    if (
      role.permissions.length
    ) {
      await prisma.rolePermission.createMany({
        data:
          role.permissions.map(
            (permission) => ({
              roleId:
                newRole.id,
              permissionId:
                permission.permissionId,
            })
          ),
      });
    }

    return newRole;
  }

  /**
   * Role Analytics
   */
  async getRoleStats() {
    const [
      totalRoles,
      totalUsers,
      totalPermissions,
      totalMappings,
    ] = await Promise.all([
      prisma.role.count(),

      prisma.user.count(),

      prisma.permission.count(),

      prisma.rolePermission.count(),
    ]);

    return {
      totalRoles,
      totalUsers,
      totalPermissions,
      totalMappings,
    };
  }

  /**
   * Seed Default Roles
   */
  async seedDefaultRoles() {
    const roles = [
      {
        name: "Super Admin",
        slug: "super_admin",
      },
      {
        name: "Admin",
        slug: "admin",
      },
      {
        name: "Manager",
        slug: "manager",
      },
      {
        name: "DSA",
        slug: "dsa",
      },
      {
        name: "Partner",
        slug: "partner",
      },
      {
        name: "Customer",
        slug: "customer",
      },
    ];

    for (const role of roles) {
      await prisma.role.upsert({
        where: {
          slug: role.slug,
        },

        update: {},

        create: role,
      });
    }

    return {
      success: true,
      rolesCreated:
        roles.length,
    };
  }
}

export default new RoleService();