import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

/* ==========================================================
   GET ALL SESSIONS
   Features:
   - Pagination
   - Search
   - Active/Inactive Filter
   - Date Range Filter
   - User Include
========================================================== */

export const getAllSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();
    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    const from = req.query.from
      ? new Date(String(req.query.from))
      : undefined;

    const to = req.query.to
      ? new Date(String(req.query.to))
      : undefined;

    const where: Prisma.SessionWhereInput = {};

    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        {
          token: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          ipAddress: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          userAgent: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                phoneNo: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ];
    }

    if (from || to) {
      where.loginAt = {};

      if (from) {
        where.loginAt.gte = from;
      }

      if (to) {
        where.loginAt.lte = to;
      }
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        skip,
        take: limit,

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNo: true,
              role: true,
            },
          },
        },

        orderBy: {
          loginAt: "desc",
        },
      }),

      prisma.session.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Sessions fetched successfully",

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },

      data: sessions,
    });
  } catch (error: any) {
    console.error("Get Sessions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   GET USER SESSIONS
========================================================== */

export const getUserSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const sessions = await prisma.session.findMany({
      where: {
        userId: String(userId),
      },

      orderBy: {
        loginAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error: any) {
    console.error("User Sessions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user sessions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
/* ==========================================================
   FORCE LOGOUT SINGLE SESSION
========================================================== */

export const forceLogoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingSession = await prisma.session.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!existingSession) {
      res.status(404).json({
        success: false,
        message: "Session not found",
      });
      return;
    }

    if (!existingSession.isActive) {
      res.status(400).json({
        success: false,
        message: "Session is already logged out",
      });
      return;
    }

    const session = await prisma.session.update({
      where: {
        id: String(id),
      },
      data: {
        isActive: false,
        logoutAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Session terminated successfully",
      data: session,
    });
  } catch (error: any) {
    console.error("Force Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to terminate session",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   FORCE LOGOUT ALL USER SESSIONS
========================================================== */

export const logoutAllUserSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const result = await prisma.session.updateMany({
      where: {
        userId: String(userId),
        isActive: true,
      },
      data: {
        isActive: false,
        logoutAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "All active sessions terminated successfully",
      affectedSessions: result.count,
    });
  } catch (error: any) {
    console.error("Logout All Sessions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to terminate user sessions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   GET SESSION BY ID
========================================================== */

export const getSessionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: {
        id: String(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
            role: true,
          },
        },
      },
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: "Session not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error("Get Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
/* ==========================================================
   SESSION ANALYTICS
========================================================== */

export const sessionAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const now = new Date();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalSessions,
      activeSessions,
      inactiveSessions,
      expiredSessions,
      todayLogins,
      weeklyLogins,
      latestSessions,
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

      prisma.session.count({
        where: {
          loginAt: {
            gte: todayStart,
          },
        },
      }),

      prisma.session.count({
        where: {
          loginAt: {
            gte: sevenDaysAgo,
          },
        },
      }),

      prisma.session.findMany({
        take: 10,

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNo: true,
            },
          },
        },

        orderBy: {
          loginAt: "desc",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSessions,
        activeSessions,
        inactiveSessions,
        expiredSessions,
        todayLogins,
        weeklyLogins,
        latestSessions,
      },
    });
  } catch (error: any) {
    console.error("Session Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   DELETE EXPIRED SESSIONS
========================================================== */

export const cleanupExpiredSessions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Expired sessions deleted successfully",
      deleted: result.count,
    });
  } catch (error: any) {
    console.error("Cleanup Sessions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cleanup expired sessions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   DELETE SESSION
========================================================== */

export const deleteSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: "Session not found",
      });
      return;
    }

    await prisma.session.delete({
      where: {
        id: String(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Session Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ==========================================================
   USER SESSION SUMMARY
========================================================== */

export const userSessionSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const [
      total,
      active,
      expired,
      latest,
    ] = await Promise.all([
      prisma.session.count({
        where: {
          userId: String(userId),
        },
      }),

      prisma.session.count({
        where: {
          userId: String(userId),
          isActive: true,
        },
      }),

      prisma.session.count({
        where: {
          userId: String(userId),
          expiresAt: {
            lt: new Date(),
          },
        },
      }),

      prisma.session.findFirst({
        where: {
          userId: String(userId),
        },
        orderBy: {
          loginAt: "desc",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSessions: total,
        activeSessions: active,
        expiredSessions: expired,
        latestSession: latest,
      },
    });
  } catch (error: any) {
    console.error("User Session Summary Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session summary",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};