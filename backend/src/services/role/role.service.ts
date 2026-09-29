import prisma from "../../prisma/prisma";

interface CreateRoleDTO {
  name: string;
  code: string;
  description?: string;
}

class RoleService {
  async createRole(
    data: CreateRoleDTO
  ) {
    const existingRole =
      await prisma.role.findFirst({
        where: {
          OR: [
            { name: data.name },
            { code: data.code },
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

  async cloneRole(
    roleId: string,
    newRoleName: string,
    newRoleCode: string
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
  code: newRoleCode,
  description: role.description,
},
      });

    if (
      role.permissions.length
    ) {
      await prisma.rolePermission.createMany({
        data:
          role.permissions.map(
            (permission) => ({
  roleId: newRole.id,
  permissionId: permission.permissionId,
})
          ),
      });
    }

    return newRole;
  }

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

  async seedDefaultRoles() {
   const roles = [
  {
    name: "Super Admin",
    code: "super_admin",
  },
  {
    name: "Admin",
    code: "admin",
  },
  {
    name: "Manager",
    code: "manager",
  },
  {
    name: "DSA",
    code: "dsa",
  },
  {
    name: "Partner",
    code: "partner",
  },
  {
    name: "Customer",
    code: "customer",
  },
];

    for (const role of roles) {
      await prisma.role.upsert({
       where: {
  code: role.code,
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