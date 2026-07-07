import { prisma } from "../../prisma";

export class RoleRepository {

  /* =========================
      CREATE ROLE
  ========================= */

  static async createRole(data: {
    name: string;
    code: string;
    description?: string;
  }) {

    return prisma.role.create({
      data
    });
  }

  /* =========================
      GET ROLE BY ID
  ========================= */

  static async getRoleById(
    id: string
  ) {

    return prisma.role.findUnique({

      where: { id },

      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  /* =========================
      GET ROLE BY CODE
  ========================= */

  static async getRoleByCode(
    code: string
  ) {

    return prisma.role.findUnique({

      where: {
        code
      },

      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  /* =========================
      GET ALL ROLES
  ========================= */

  static async getAllRoles() {

    return prisma.role.findMany({

      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      UPDATE ROLE
  ========================= */

  static async updateRole(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      description: string;
    }>
  ) {

    return prisma.role.update({

      where: {
        id
      },

      data
    });
  }

  /* =========================
      ACTIVATE ROLE
  ========================= */

  static async activateRole(
    id: string
  ) {

    return prisma.role.update({

      where: {
        id
      },

      data: {
        isActive: true
      }
    });
  }

  /* =========================
      DEACTIVATE ROLE
  ========================= */

  static async deactivateRole(
    id: string
  ) {

    return prisma.role.update({

      where: {
        id
      },

      data: {
        isActive: false
      }
    });
  }

  /* =========================
      DELETE ROLE
  ========================= */

  static async deleteRole(
    id: string
  ) {

    return prisma.role.delete({
      where: { id }
    });
  }

  /* =========================
      ASSIGN PERMISSION
  ========================= */

  static async assignPermission(
    roleId: string,
    permissionId: string
  ) {

    return prisma.rolePermission.create({

      data: {
        roleId,
        permissionId
      }
    });
  }

  /* =========================
      REMOVE PERMISSION
  ========================= */

  static async removePermission(
    roleId: string,
    permissionId: string
  ) {

    return prisma.rolePermission.deleteMany({

      where: {
        roleId,
        permissionId
      }
    });
  }

  /* =========================
      ROLE PERMISSIONS
  ========================= */

  static async getRolePermissions(
    roleId: string
  ) {

    return prisma.rolePermission.findMany({

      where: {
        roleId
      },

      include: {
        permission: true
      }
    });
  }

  /* =========================
      BULK ASSIGN
  ========================= */

  static async bulkAssignPermissions(
    roleId: string,
    permissionIds: string[]
  ) {

    return prisma.rolePermission.createMany({

      data: permissionIds.map(
        permissionId => ({
          roleId,
          permissionId
        })
      ),

      skipDuplicates: true
    });
  }

  /* =========================
      SEARCH ROLES
  ========================= */

  static async searchRoles(
    keyword: string
  ) {

    return prisma.role.findMany({

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
            description: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      ROLE ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalRoles,
      activeRoles,
      totalPermissions
    ] = await Promise.all([

      prisma.role.count(),

      prisma.role.count({
        where: {
          isActive: true
        }
      }),

      prisma.rolePermission.count()
    ]);

    return {
      totalRoles,
      activeRoles,
      totalPermissions
    };
  }

  /* =========================
      ROLE DASHBOARD
  ========================= */

  static async getDashboard() {

    const [
      analytics,
      recentRoles
    ] = await Promise.all([

      this.getAnalytics(),

      prisma.role.findMany({

        take: 10,

        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return {
      analytics,
      recentRoles
    };
  }
}