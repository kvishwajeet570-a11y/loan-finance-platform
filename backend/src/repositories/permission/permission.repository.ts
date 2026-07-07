import { prisma } from "../../prisma/prisma";

export class PermissionRepository {

  /* =========================
      CREATE PERMISSION
  ========================= */

  static async createPermission(data: {
    name: string;
    code: string;
    module: string;
    description?: string;
  }) {

    return prisma.permission.create({
      data
    });
  }

  /* =========================
      GET PERMISSION BY ID
  ========================= */

  static async getPermissionById(
    id: string
  ) {

    return prisma.permission.findUnique({
      where: { id }
    });
  }

  /* =========================
      GET PERMISSION BY CODE
  ========================= */

  static async getPermissionByCode(
    code: string
  ) {

    return prisma.permission.findUnique({
      where: { code }
    });
  }

  /* =========================
      GET ALL PERMISSIONS
  ========================= */

  static async getAllPermissions() {

    return prisma.permission.findMany({

      orderBy: {
        module: "asc"
      }
    });
  }

  /* =========================
      GET MODULE PERMISSIONS
  ========================= */

  static async getModulePermissions(
    module: string
  ) {

    return prisma.permission.findMany({

      where: {
        module
      }
    });
  }

  /* =========================
      UPDATE PERMISSION
  ========================= */

  static async updatePermission(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      module: string;
      description: string;
    }>
  ) {

    return prisma.permission.update({

      where: {
        id
      },

      data
    });
  }

  /* =========================
      DELETE PERMISSION
  ========================= */

  static async deletePermission(
    id: string
  ) {

    return prisma.permission.delete({
      where: { id }
    });
  }

  /* =========================
      ASSIGN ROLE PERMISSION
  ========================= */

  static async assignPermissionToRole(
    role: string,
    permissionId: string
  ) {

    return prisma.rolePermission.create({

      data: {
        role,
        permissionId
      }
    });
  }

  /* =========================
      REMOVE ROLE PERMISSION
  ========================= */

  static async removePermissionFromRole(
    role: string,
    permissionId: string
  ) {

    return prisma.rolePermission.deleteMany({

      where: {
        role,
        permissionId
      }
    });
  }

  /* =========================
      ROLE PERMISSIONS
  ========================= */

  static async getRolePermissions(
    role: string
  ) {

    return prisma.rolePermission.findMany({

      where: {
        role
      },

      include: {
        permission: true
      }
    });
  }

  /* =========================
      CHECK ROLE PERMISSION
  ========================= */

  static async hasPermission(
    role: string,
    code: string
  ) {

    const permission =
      await prisma.rolePermission.findFirst({

        where: {

          role,

          permission: {
            code
          }
        },

        include: {
          permission: true
        }
      });

    return !!permission;
  }

  /* =========================
      BULK ASSIGN
  ========================= */

  static async bulkAssignPermissions(
    role: string,
    permissionIds: string[]
  ) {

    return prisma.rolePermission.createMany({

      data:
        permissionIds.map(id => ({
          role,
          permissionId: id
        })),

      skipDuplicates: true
    });
  }

  /* =========================
      GET ROLES
  ========================= */

  static async getRoles() {

    return [

      "SUPER_ADMIN",
      "ADMIN",
      "EMPLOYEE",
      "DSA",
      "PARTNER",
      "CUSTOMER"
    ];
  }

  /* =========================
      SEARCH PERMISSIONS
  ========================= */

  static async searchPermissions(
    keyword: string
  ) {

    return prisma.permission.findMany({

      where: {

        OR: [

          {
            name: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            code: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            module: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      PERMISSION ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalPermissions,
      totalRolePermissions
    ] = await Promise.all([

      prisma.permission.count(),

      prisma.rolePermission.count()
    ]);

    return {
      totalPermissions,
      totalRolePermissions
    };
  }
}