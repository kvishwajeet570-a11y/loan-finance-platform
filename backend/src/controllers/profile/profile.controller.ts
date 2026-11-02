import {

  Request,
  Response,

} from "express";

import prisma from "../../prisma/prisma";
import ProfileService from "../../services/profile/profile.service";


/* ========================================
   GET USER PROFILE
======================================== */

export const getUserProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         FETCH USER
      ======================================== */

      const user =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

          include: {

            wallet: {

              include: {

                transactions: true,

                walletHistory: true,

              },

            },

            loans: true,

            referral: {

              include: {

                referralHistory: true,

              },

            },

            recharges: true,

            notifications: true,

            supportTickets: true,

            activities: true,

          },

        });


      /* ========================================
         CHECK USER
      ======================================== */

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch profile",

      });

    }

  };


/* ========================================
   UPDATE PROFILE
======================================== */

export const updateProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const authUser = (req as any).user;
      const userId = String(authUser?.id ?? authUser?.userId ?? "");
      const { name, email, phoneNo, profileImage } = req.body;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const existingUser =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

        });


      if (!existingUser) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         UPDATE USER
      ======================================== */

      const updatedUser =
        await prisma.user.update({

          where: {

            id: userId,

          },

          data: {

            name,

            email,

            phoneNo,

            profileImage,

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Profile Updated",

          message:
            "Your profile has been updated successfully.",

          type:
            "profile",

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user:
          updatedUser,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to update profile",

      });

    }

  };


/* ========================================
   DELETE PROFILE
======================================== */

export const deleteProfile =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const user =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         DELETE USER
      ======================================== */

      await prisma.user.delete({

        where: {

          id: userId,

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Profile deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete profile",

      });

    }

  };


/* ========================================
   GET USER STATS
======================================== */

export const getUserStats =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      const totalLoans =
        await prisma.loanApplication.count({

          where: {

            userId,

          },

        });


      const totalRecharges =
        await prisma.recharge.count({

          where: {

            userId,

          },

        });


      const totalTransactions =
        await prisma.transaction.count({

          where: {

            wallet: {

              userId,

            },

          },

        });


      const wallet =
        await prisma.wallet.findUnique({

          where: {

            userId,

          },

        });


      return res.status(200).json({

        success: true,

        stats: {

          totalLoans,

          totalRecharges,

          totalTransactions,

          walletBalance:
            wallet?.balance || 0,

        },

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch user stats",

      });

    }

  };
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    const user = await ProfileService.getProfile(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET MY PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
export const getProfileById = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const authenticatedUserId = String(authUser?.id ?? authUser?.userId ?? "");
    const requestedUserId = String(req.params.id ?? "");

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    if (!requestedUserId || requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own profile",
      });
    }

    const user = await ProfileService.getProfile(authenticatedUserId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET PROFILE BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    const imageUrl = req.body?.profileImage;
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    if (typeof imageUrl !== "string" || !imageUrl.trim()) return res.status(400).json({ success: false, message: "profileImage is required" });
    const user = await ProfileService.updateProfileImage(userId, imageUrl.trim());
    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phoneNo: user.phoneNo, role: user.role, profileImage: user.profileImage, isVerified: user.isVerified, createdAt: user.createdAt, updatedAt: user.updatedAt, address: user.address, city: user.city, state: user.state, pincode: user.pincode, dob: user.dob } });
  } catch (error) {
    console.error("UPDATE PROFILE IMAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile image" });
  }
};

export const removeProfileImage = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const user = await prisma.user.update({ where: { id: userId }, data: { profileImage: null } });
    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phoneNo: user.phoneNo, role: user.role, profileImage: user.profileImage, isVerified: user.isVerified, createdAt: user.createdAt, updatedAt: user.updatedAt, address: user.address, city: user.city, state: user.state, pincode: user.pincode, dob: user.dob } });
  } catch (error) {
    console.error("REMOVE PROFILE IMAGE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to remove profile image" });
  }
};

export const updatePersonalInfo = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const allowed: Record<string, unknown> = {};
    for (const key of ["name", "phoneNo", "dob"] as const) {
      if (req.body?.[key] !== undefined) allowed[key] = req.body[key];
    }
    if (Object.keys(allowed).length === 0) return res.status(400).json({ success: false, message: "No supported personal fields supplied" });
    const user = await ProfileService.updateProfile(userId, allowed);
    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phoneNo: user.phoneNo, role: user.role, profileImage: user.profileImage, isVerified: user.isVerified, createdAt: user.createdAt, updatedAt: user.updatedAt, address: user.address, city: user.city, state: user.state, pincode: user.pincode, dob: user.dob } });
  } catch (error) {
    console.error("UPDATE PERSONAL INFO ERROR:", error);
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update personal information" });
  }
};

export const updateAddressInfo = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const allowed: Record<string, unknown> = {};
    for (const key of ["address", "city", "state", "pincode"] as const) {
      if (req.body?.[key] !== undefined) allowed[key] = req.body[key];
    }
    if (Object.keys(allowed).length === 0) return res.status(400).json({ success: false, message: "No supported address fields supplied" });
    const user = await ProfileService.updateProfile(userId, allowed);
    return res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phoneNo: user.phoneNo, role: user.role, profileImage: user.profileImage, isVerified: user.isVerified, createdAt: user.createdAt, updatedAt: user.updatedAt, address: user.address, city: user.city, state: user.state, pincode: user.pincode, dob: user.dob } });
  } catch (error) {
    console.error("UPDATE ADDRESS INFO ERROR:", error);
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update address" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    const { oldPassword, newPassword } = req.body ?? {};
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    if (typeof oldPassword !== "string" || typeof newPassword !== "string" || newPassword.length < 8) return res.status(400).json({ success: false, message: "Old password and a new password of at least 8 characters are required" });
    await ProfileService.changePassword(userId, oldPassword, newPassword);
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to change password" });
  }
};

export const changeEmail = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Email change requires a verified password/OTP flow and is not enabled yet" });
export const changePhone = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Phone change requires a verified OTP flow and is not enabled yet" });
export const verifyEmail = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Email verification flow is not configured" });
export const verifyPhone = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Phone verification flow is not configured" });

export const enableTwoFactorAuth = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const user = await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    return res.status(200).json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error("ENABLE 2FA ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to enable two-factor authentication" });
  }
};

export const disableTwoFactorAuth = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const user = await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: false } });
    return res.status(200).json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error("DISABLE 2FA ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to disable two-factor authentication" });
  }
};

export const getProfileDashboard = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    const role = String(authUser?.role ?? "").toUpperCase();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const historyStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // DSA dashboard: count applications explicitly assigned to this DSA.
    // Other roles retain their existing userId-based view.
    const loanWhere: any = role === "DSA"
      ? { assignedTo: userId }
      : { userId };

    const commissionWhere: any = { userId };

    const [
      totalApplications,
      approvedLoans,
      disbursedLoans,
      pendingLoans,
      rejectedLoans,
      commissions,
      monthCommissions,
      pendingCommission,
      paidCommission,
      commissionHistory,
      loanHistory,
      completion,
      wallet,
    ] = await Promise.all([
      prisma.loanApplication.count({ where: loanWhere }),
      prisma.loanApplication.count({ where: { ...loanWhere, status: { in: ["APPROVED", "DISBURSED"] } } }),
      prisma.loanApplication.count({ where: { ...loanWhere, status: "DISBURSED" } }),
      prisma.loanApplication.count({ where: { ...loanWhere, status: "PENDING" } }),
      prisma.loanApplication.count({ where: { ...loanWhere, status: "REJECTED" } }),
      prisma.commission.aggregate({ where: commissionWhere, _sum: { commissionAmount: true } }),
      prisma.commission.aggregate({ where: { ...commissionWhere, createdAt: { gte: monthStart }, status: { not: "REJECTED" } }, _sum: { commissionAmount: true } }),
      prisma.commission.aggregate({ where: { ...commissionWhere, status: "PENDING" }, _sum: { commissionAmount: true } }),
      prisma.commission.aggregate({ where: { ...commissionWhere, status: "PAID" }, _sum: { commissionAmount: true } }),
      prisma.commission.findMany({
        where: { ...commissionWhere, createdAt: { gte: historyStart } },
        select: { createdAt: true, commissionAmount: true, loanAmount: true, status: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.loanApplication.findMany({
        where: { ...loanWhere, createdAt: { gte: historyStart } },
        select: { createdAt: true, status: true, amount: true },
        orderBy: { createdAt: "asc" },
      }),
      ProfileService.profileCompletion(userId),
      prisma.wallet.findUnique({ where: { userId }, select: { balance: true } }),
    ]);

    const monthlyMap = new Map<string, { month: string; applications: number; disbursed: number; earnings: number }>();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, {
        month: date.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        applications: 0,
        disbursed: 0,
        earnings: 0,
      });
    }

    for (const loan of loanHistory) {
      const date = new Date(loan.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const row = monthlyMap.get(key);
      if (row) {
        row.applications += 1;
        if (loan.status === "DISBURSED") row.disbursed += Number(loan.amount || 0);
      }
    }

    for (const commission of commissionHistory) {
      const date = new Date(commission.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const row = monthlyMap.get(key);
      if (row) row.earnings += Number(commission.commissionAmount || 0);
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        approvedLoans,
        disbursedLoans,
        pendingLoans,
        rejectedLoans,
        approvalRate: totalApplications ? Number(((approvedLoans / totalApplications) * 100).toFixed(1)) : 0,
        disbursalRate: totalApplications ? Number(((disbursedLoans / totalApplications) * 100).toFixed(1)) : 0,
        totalEarnings: commissions._sum.commissionAmount ?? 0,
        thisMonthEarnings: monthCommissions._sum.commissionAmount ?? 0,
        pendingCommission: pendingCommission._sum.commissionAmount ?? 0,
        paidOut: paidCommission._sum.commissionAmount ?? 0,
        profileCompletion: completion.completion,
        walletBalance: wallet?.balance ?? 0,
      },
      commissionHistory: Array.from(monthlyMap.values()),
    });
  } catch (error) {
    console.error("PROFILE DASHBOARD ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile dashboard" });
  }
};export const getProfileAnalytics = getProfileDashboard;
export const getProfileActivity = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await ProfileService.recentActivity(userId);
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("PROFILE ACTIVITY ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch activity" });
  }
};

export const getLoginHistory = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await prisma.loginHistory.findMany({ where: { userId }, orderBy: { loginTime: "desc" }, take: 20 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("LOGIN HISTORY ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch login history" });
  }
};

export const getProfileDocuments = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await prisma.document.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("PROFILE DOCUMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

export const getProfileKyc = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const item = await ProfileService.getKycStatus(userId);
    return res.status(200).json({ success: true, item });
  } catch (error) {
    console.error("PROFILE KYC ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch KYC status" });
  }
};

export const getProfileLoans = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await prisma.loanApplication.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("PROFILE LOANS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch loans" });
  }
};

export const getProfileWallet = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const item = await prisma.wallet.findUnique({ where: { userId } });
    return res.status(200).json({ success: true, item });
  } catch (error) {
    console.error("PROFILE WALLET ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch wallet" });
  }
};

export const getProfileTransactions = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await prisma.transaction.findMany({ where: { wallet: { userId } }, orderBy: { createdAt: "desc" }, take: 50 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("PROFILE TRANSACTIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

export const getProfileNotifications = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    const items = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("PROFILE NOTIFICATIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

export const markMyNotificationRead = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    const notificationId = String(req.params.id ?? "");

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Notification ID is required" });
    }

    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found for this account",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      id: notificationId,
    });
  } catch (error) {
    console.error("MARK MY NOTIFICATION READ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

export const markMyNotificationsRead = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("MARK MY NOTIFICATIONS READ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};
export const deleteMyNotification = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    const notificationId = String(req.params.id ?? "");

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!notificationId) {
      return res.status(400).json({ success: false, message: "Notification ID is required" });
    }

    const result = await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found for this account",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      id: notificationId,
    });
  } catch (error) {
    console.error("DELETE CUSTOMER NOTIFICATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
export const deactivateProfile = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    const userId = String(authUser?.id ?? authUser?.userId ?? "");
    if (!userId) return res.status(401).json({ success: false, message: "Authentication required" });
    await ProfileService.deleteAccount(userId);
    return res.status(200).json({ success: true, message: "Account deactivated" });
  } catch (error) {
    console.error("DEACTIVATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to deactivate account" });
  }
};

export const reactivateProfile = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Reactivation requires an account recovery flow" });
export const exportProfilePdf = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Profile PDF export is not implemented" });
export const exportProfileExcel = async (req: Request, res: Response) => res.status(501).json({ success: false, message: "Profile Excel export is not implemented" });














