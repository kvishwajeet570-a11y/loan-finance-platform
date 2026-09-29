import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

export class SessionRepository {
  /* ==========================================================
     CREATE SESSION
  ========================================================== */

  static async create(data: {
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  isActive?: boolean;
  expiresAt: Date;
}) {
  return prisma.session.create({
    data: {
      token: data.token,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      isActive: data.isActive ?? true,
      expiresAt: data.expiresAt,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
    include: {
      user: true,
    },
  });
}

  /* ==========================================================
     GET SESSION BY ID
  ========================================================== */

  static async getById(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  /* ==========================================================
     GET SESSION BY TOKEN
  ========================================================== */

  static async getByToken(token: string) {
    return prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

  /* ==========================================================
     GET ACTIVE SESSIONS
  ========================================================== */

  static async getActiveSessions() {
    return prisma.session.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: true,
      },
      orderBy: {
        loginAt: "desc",
      },
    });
  }

  /* ==========================================================
     GET USER SESSIONS
  ========================================================== */

  static async getUserSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        loginAt: "desc",
      },
    });
  }

  /* ==========================================================
     UPDATE SESSION
  ========================================================== */

  static async update(
    id: string,
    data: Prisma.SessionUpdateInput
  ) {
    return prisma.session.update({
      where: {
        id,
      },
      data,
    });
  }

  /* ==========================================================
     FORCE LOGOUT SESSION
  ========================================================== */

  static async forceLogoutSession(id: string) {
    return prisma.session.update({
      where: {
        id,
      },
      data: {
        isActive: false,
        logoutAt: new Date(),
      },
    });
  }

  /* ==========================================================
     LOGOUT ALL USER SESSIONS
  ========================================================== */

  static async logoutAllUserSessions(userId: string) {
    return prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        logoutAt: new Date(),
      },
    });
  }

  /* ==========================================================
     DELETE SESSION
  ========================================================== */

  static async delete(id: string) {
    return prisma.session.delete({
      where: {
        id,
      },
    });
  }

  /* ==========================================================
     CLEANUP EXPIRED SESSIONS
  ========================================================== */

  static async cleanupExpiredSessions() {
    return prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /* ==========================================================
     SESSION ANALYTICS
  ========================================================== */

  static async getAnalytics() {
    const now = new Date();

    const [
      totalSessions,
      activeSessions,
      inactiveSessions,
      expiredSessions,
    ] = await Promise.all([
      prisma.session.count(),

      prisma.session.count({
        where: {
          isActive: true,
        },
      }),

      prisma.session.count({
        where: {
          isActive: false,
        },
      }),

      prisma.session.count({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      }),
    ]);

    return {
      totalSessions,
      activeSessions,
      inactiveSessions,
      expiredSessions,
    };
  }

  /* ==========================================================
     RECENT SESSIONS
  ========================================================== */

  static async getRecent(limit = 10) {
    return prisma.session.findMany({
      take: limit,
      include: {
        user: true,
      },
      orderBy: {
        loginAt: "desc",
      },
    });
  }

  /* ==========================================================
     SEARCH SESSIONS
  ========================================================== */

  static async search(keyword: string) {
    return prisma.session.findMany({
      where: {
        OR: [
          {
            token: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            ipAddress: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            userAgent: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            user: {
              OR: [
                {
                  name: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
                {
                  phoneNo: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        loginAt: "desc",
      },
    });
  }
}

export default SessionRepository;