import prisma from "../../prisma/prisma";

export class PermissionRepository {
  /* =========================================
     CREATE
  ========================================= */

  static async create(data: {
    name: string;
    code: string;
    module: string;
    action: string;
    description?: string;
    slug?: string;
    status?: string;
  }) {
    return prisma.permission.create({
      data: {
        name: data.name,
        code: data.code,
        module: data.module,
        action: data.action,
        description: data.description,
        slug: data.slug,
        status: data.status ?? "ACTIVE",
      },
    });
  }

  /* =========================================
     GET BY ID
  ========================================= */

  static async findById(id: string) {
    return prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: true,
        userPermissions: true,
      },
    });
  }

  /* =========================================
     GET BY CODE
  ========================================= */

  static async findByCode(code: string) {
    return prisma.permission.findUnique({
      where: { code },
    });
  }

  /* =========================================
     GET BY SLUG
  ========================================= */

  static async findBySlug(slug: string) {
    return prisma.permission.findUnique({
      where: { slug },
    });
  }

  /* =========================================
     GET ALL
  ========================================= */

  static async findAll() {
    return prisma.permission.findMany({
      include: {
        rolePermissions: true,
        userPermissions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================
     UPDATE
  ========================================= */

  static async update(
    id: string,
    data: {
      name?: string;
      code?: string;
      module?: string;
      action?: string;
      description?: string;
      slug?: string;
      status?: string;
    }
  ) {
    return prisma.permission.update({
      where: { id },
      data,
    });
  }

  /* =========================================
     DELETE
  ========================================= */

  static async delete(id: string) {
    await prisma.rolePermission.deleteMany({
      where: {
        permissionId: id,
      },
    });

    await prisma.userPermission.deleteMany({
      where: {
        permissionId: id,
      },
    });

    return prisma.permission.delete({
      where: { id },
    });
  }

  /* =========================================
     SEARCH
  ========================================= */

  static async search(keyword: string) {
    return prisma.permission.findMany({
      where: {
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            code: {
              contains: keyword,
            },
          },
          {
            module: {
              contains: keyword,
            },
          },
          {
            action: {
              contains: keyword,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================
     ROLE PERMISSIONS
  ========================================= */

  static async assignPermissionToRole(
    role: string,
    permissionId: string
  ) {
    return prisma.rolePermission.create({
      data: {
        roleId: role,
        permissionId,
      },
    });
  }

  static async removePermissionFromRole(
    role: string,
    permissionId: string
  ) {
    return prisma.rolePermission.deleteMany({
      where: {
        roleId: role,
        permissionId,
      },
    });
  }

  static async getRolePermissions(role: string) {
    return prisma.rolePermission.findMany({
      where: {
        roleId: role,
      },
      include: {
        permission: true,
      },
    });
  }

  /* =========================================
     USER PERMISSIONS
  ========================================= */

  static async assignPermissionToUser(
    userId: string,
    permissionId: string
  ) {
    return prisma.userPermission.create({
      data: {
        userId,
        permissionId,
      },
    });
  }

  static async removePermissionFromUser(
    userId: string,
    permissionId: string
  ) {
    return prisma.userPermission.deleteMany({
      where: {
        userId,
        permissionId,
      },
    });
  }

  static async getUserPermissions(userId: string) {
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
     BULK ASSIGN
  ========================================= */

  static async bulkAssignPermissions(
    role: string,
    permissionIds: string[]
  ) {
    return prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId: role,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }

  /* =========================================
     MODULE PERMISSIONS
  ========================================= */

  static async getModulePermissions(
    module: string
  ) {
    return prisma.permission.findMany({
      where: {
        module,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================================
     ANALYTICS
  ========================================= */

  static async getAnalytics() {
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
}

export default PermissionRepository;