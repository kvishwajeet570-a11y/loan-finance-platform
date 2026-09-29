import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import PDFDocument from "pdfkit";

/**
 * GET ALL USERS
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const search =
      String(req.query.search || "");

    const users =
      await prisma.user.findMany({
        where: {
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
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isBlocked: true,
          createdAt: true,
        },
      });

    const total =
      await prisma.user.count();

    res.status(200).json({
      success: true,
      page,
      total,
      data: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error,
    });

  }
};

/**
 * GET USER BY ID
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.params.id as string,
        },
        include: {
          loans: true,
        },
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * CREATE USER
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      name,
      email,
      phoneNo,
      password,
      role,
    } = req.body;

    const exists =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phoneNo },
          ],
        },
      });

    if (exists) {

      res.status(400).json({
        success: false,
        message:
          "User already exists",
      });

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          phoneNo,
          password:
            hashedPassword,
          role,
        },
      });

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UPDATE USER
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id as string,
        },
        data: req.body,
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * BLOCK USER
 */
export const blockUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id as string,
        },
        data: {
          isBlocked: true,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UNBLOCK USER
 */
export const unblockUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id as string,
        },
        data: {
          isBlocked: false,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * VERIFY USER
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id as string,
        },
        data: {
          isVerified: true,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * USER ANALYTICS
 */
export const userAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        blockedUsers,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};
export const getUserProfile = getUserById;

export const updateProfile = updateUser;

export const uploadProfileImage = updateUser;

export const removeProfileImage = updateUser;


/* ==========================================
   LOGIN HISTORY
========================================== */

export const getLoginHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const history = await prisma.loginHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        loginTime: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/**
 * DELETE USER
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error,
    });
  }
};
/**
 * ACTIVATE USER
 */
export const activateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (existingUser.isActive) {
      res.status(400).json({
        success: false,
        message: "User is already active",
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to activate user",
      error,
    });
  }
};
/**
 * DEACTIVATE USER
 */
export const deactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (!existingUser.isActive) {
      res.status(400).json({
        success: false,
        message: "User is already inactive",
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate user",
      error,
    });
  }
};

/**
 * USER DASHBOARD
 */
export const getUserDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      blockedUsers,
      totalLoans,
      totalTransactions,
      totalNotifications,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.user.count({
        where: {
          isActive: false,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.loanApplication.count(),

      prisma.transaction.count(),

      prisma.notification.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          verified: verifiedUsers,
          blocked: blockedUsers,
        },
        loans: {
          total: totalLoans,
        },
        transactions: {
          total: totalTransactions,
        },
        notifications: {
          total: totalNotifications,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error,
    });
  }
};

/**
 * USER ANALYTICS
 */
export const getUserAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedUsers,
      unverifiedUsers,
      blockedUsers,
      unblockedUsers,
      todayUsers,
      thisMonthUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.user.count({
        where: {
          isActive: false,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isVerified: false,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: false,
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().setHours(0, 0, 0, 0)
            ),
          },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            ),
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        verifiedUsers,
        unverifiedUsers,
        blockedUsers,
        unblockedUsers,
        todayUsers,
        thisMonthUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics",
      error,
    });
  }
};
/**
 * GET PENDING USERS
 */
export const getPendingUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      isVerified: false,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
      error,
    });
  }
};
/**
 * GET VERIFIED USERS
 */
export const getVerifiedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      isVerified: true,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch verified users",
      error,
    });
  }
};
/**
 * GET BLOCKED USERS
 */
export const getBlockedUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      isBlocked: true,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blocked users",
      error,
    });
  }
};
/**
 * GET ACTIVE USERS
 */
export const getActiveUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active users",
      error,
    });
  }
};

/**
 * SEARCH USERS
 */
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim();

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phoneNo: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isActive: true,
          isBlocked: true,
          createdAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      search,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error,
    });
  }
};

/**
 * GET TOP USERS
 */
export const getTopUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      take: limit,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        isVerified: true,
        isBlocked: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top users",
      error,
    });
  }
};
/**
 * GET NEW USERS
 */
export const getNewUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;

    const users = await prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        isVerified: true,
        isActive: true,
        isBlocked: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch new users",
      error,
    });
  }
};
/**
 * GET RECENT USERS
 */
export const getRecentUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 20;

    const users = await prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        isVerified: true,
        isActive: true,
        isBlocked: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent users",
      error,
    });
  }
};
/**
 * GET USER LOANS
 */
export const getUserLoans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const loans = await prisma.loanApplication.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user loans",
      error,
    });
  }
};

/**
 * GET USER TRANSACTIONS
 */
export const getUserTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user transactions",
      error,
    });
  }
};

/**
 * GET USER DOCUMENTS
 */
export const getUserDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user documents",
      error,
    });
  }
};
/**
 * GET USER KYC
 */
export const getUserKyc = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const kyc = await prisma.kYC.findFirst({
      where: {
        userId,
      },
    });

    if (!kyc) {
      res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user KYC",
      error,
    });
  }
};

/**
 * GET USER WALLET
 */
export const getUserWallet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
    });

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user wallet",
      error,
    });
  }
};

/**
 * GET USER NOTIFICATIONS
 */
export const getUserNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user notifications",
      error,
    });
  }
};
/**
 * GET USER REFERRALS
 */
export const getUserReferrals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const referrals = await prisma.referral.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user referrals",
      error,
    });
  }
};

/**
 * GET USER COMMISSIONS
 */
export const getUserCommissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const commissions = await prisma.commission.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: commissions.length,
      data: commissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user commissions",
      error,
    });
  }
};
/**
 * GET USER ACHIEVEMENTS
 */
export const getUserAchievements = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const achievements = await prisma.achievement.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user achievements",
      error,
    });
  }
};

/**
 * GET USER LEADERBOARD RANK
 */
export const getUserLeaderboardRank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    const rank =
      users.findIndex(
        (user) => user.id === userId
      ) + 1;

    if (rank === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        userId,
        rank,
        totalUsers: users.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard rank",
      error,
    });
  }
};
/**
 * CHANGE PASSWORD
 */
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error,
    });
  }
};
/**
 * RESET PASSWORD (Admin)
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      res.status(400).json({
        success: false,
        message: "User ID and new password are required",
      });
      return;
    }

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

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error,
    });
  }
};

/**
 * UPDATE EMAIL
 */
export const updateEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      res.status(400).json({
        success: false,
        message: "User ID and email are required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: String(userId),
        },
      },
    });

    if (emailExists) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    const user = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        email,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        isVerified: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update email",
      error,
    });
  }
};

/**
 * UPDATE PHONE
 */
export const updatePhone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, phoneNo } = req.body;

    if (!userId || !phoneNo) {
      res.status(400).json({
        success: false,
        message: "User ID and phone number are required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const phoneExists = await prisma.user.findFirst({
      where: {
        phoneNo,
        NOT: {
          id: String(userId),
        },
      },
    });

    if (phoneExists) {
      res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        phoneNo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update phone number",
      error,
    });
  }
};

/**
 * VERIFY EMAIL
 */
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      error,
    });
  }
};

/**
 * VERIFY PHONE
 */
export const verifyPhone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        phoneNo: true,
        isVerified: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Phone verified successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify phone",
      error,
    });
  }
};

/**
 * ENABLE TWO FACTOR AUTHENTICATION
 */
export const enableTwoFactorAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        twoFactorEnabled: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Two-factor authentication enabled successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to enable two-factor authentication",
      error,
    });
  }
};

/**
 * DISABLE TWO FACTOR AUTHENTICATION
 */
export const disableTwoFactorAuth = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
      select: {
        id: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        twoFactorEnabled: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Two-factor authentication disabled successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to disable two-factor authentication",
      error,
    });
  }
};

/**
 * GET ACTIVITY LOGS
 */
export const getActivityLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = String(req.params.userId);

    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error,
    });
  }
};

/**
 * GET USER AUDIT LOGS
 */
export const getUserAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await prisma.securityLog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const total = await prisma.securityLog.count();

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error,
    });
  }
};

/**
 * EXPORT USERS EXCEL
 */
export const exportUsersExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        isActive: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users.xlsx"'
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to export users",
      error,
    });
  }
};
/**
 * EXPORT USERS PDF
 */
export const exportUsersPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        isActive: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users.pdf"'
    );

    doc.pipe(res);

    doc
      .fontSize(20)
      .text("Users Report", {
        align: "center",
      });

    doc.moveDown();

    users.forEach((user, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${user.name}`, {
          underline: true,
        });

      doc.text(`Email      : ${user.email}`);
      doc.text(`Phone      : ${user.phoneNo}`);
      doc.text(`Role       : ${user.role}`);
      doc.text(`Active     : ${user.isActive ? "Yes" : "No"}`);
      doc.text(`Verified   : ${user.isVerified ? "Yes" : "No"}`);
      doc.text(`Blocked    : ${user.isBlocked ? "Yes" : "No"}`);
      doc.text(
        `Created At : ${user.createdAt.toLocaleString()}`
      );

      doc.moveDown();
      doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke();
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to export users PDF",
      error,
    });
  }
};
/**
 * BULK VERIFY USERS
 */
export const bulkVerifyUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "User IDs are required",
      });
      return;
    }

    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isVerified: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} users verified successfully`,
      updatedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify users",
      error,
    });
  }
};
/**
 * BULK BLOCK USERS
 */
export const bulkBlockUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "User IDs are required",
      });
      return;
    }

    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isBlocked: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} users blocked successfully`,
      updatedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block users",
      error,
    });
  }
};

/**
 * BULK UNBLOCK USERS
 */
export const bulkUnblockUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "User IDs are required",
      });
      return;
    }

    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isBlocked: false,
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} users unblocked successfully`,
      updatedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unblock users",
      error,
    });
  }
};
/**
 * BULK DELETE USERS
 */
export const bulkDeleteUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "User IDs are required",
      });
      return;
    }

    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `${result.count} users deleted successfully`,
      deletedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete users",
      error,
    });
  }
};