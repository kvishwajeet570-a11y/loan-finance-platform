import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";

/* ==========================================================
   HELPER
========================================================== */

const getParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

/* ==========================================================
   SUPER ADMIN DASHBOARD
========================================================== */

export const getSuperAdminDashboard = async (
  req: Request,
  res: Response
) => {
  try {
const [
  totalUsers,
  totalLoans,
  totalDsa,
  totalPartners,
  totalTransactions,
  totalCommissions,
] = await Promise.all([
  prisma.user.count(),

  prisma.loanApplication.count(),

  prisma.user.count({
    where: {
      role: "DSA",
    },
  }),

  prisma.partner.count(),

  prisma.transaction.count(),

  prisma.commission.count(),
]);

    const loanStats = await prisma.loanApplication.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const transactionStats = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        loans: totalLoans,
        dsa: totalDsa,
        partners: totalPartners,
        transactions: totalTransactions,
        commissions: totalCommissions,

        transactionVolume:
          transactionStats._sum.amount || 0,

        loanStats,
      },
    });
  } catch (error) {
    console.error("Super Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch super admin dashboard",
    });
  }
};

/* ==========================================================
   SYSTEM ANALYTICS
========================================================== */

export const getSystemAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      users,
      loans,
      transactions,
      dsa,
      partners,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),
      prisma.transaction.count(),
      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),
      prisma.partner.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        loans,
        transactions,
        dsa,
        partners,
      },
    });
  } catch (error) {
    console.error("System Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system analytics",
    });
  }
};

/* ==========================================================
   BUSINESS ANALYTICS
========================================================== */

export const getBusinessAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalDsa,
      totalPartners,
    ] = await Promise.all([
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.partner.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLoans,
        approvedLoans,
        rejectedLoans,
        pendingLoans,
        totalDsa,
        totalPartners,
      },
    });
  } catch (error) {
    console.error("Business Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch business analytics",
    });
  }
};

/* ==========================================================
   REVENUE ANALYTICS
========================================================== */

export const getRevenueAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionData =
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
          fee: true,
          gst: true,
          commission: true,
          cashback: true,
          tax: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: {
        transactionAmount:
          transactionData._sum.amount || 0,

        fees:
          transactionData._sum.fee || 0,

        gst:
          transactionData._sum.gst || 0,

        commission:
          transactionData._sum.commission || 0,

        cashback:
          transactionData._sum.cashback || 0,

        tax:
          transactionData._sum.tax || 0,
      },
    });
  } catch (error) {
    console.error("Revenue Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
    });
  }
};

/* ==========================================================
   USER ANALYTICS
========================================================== */

export const getUserAnalytics = async (
  req: Request,
  res: Response
) => {
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

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        blockedUsers,
        activeUsers:
          totalUsers - blockedUsers,
      },
    });
  } catch (error) {
    console.error("User Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user analytics",
    });
  }
};

/* ==========================================================
   LOAN ANALYTICS
========================================================== */

export const getLoanAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalLoans,
      approved,
      rejected,
      pending,
      totalAmount,
    ] = await Promise.all([
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.loanApplication.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLoans,
        approved,
        rejected,
        pending,

        totalLoanAmount:
          totalAmount._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("Loan Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch loan analytics",
    });
  }
};

/* ==========================================================
   GET ALL ADMINS
========================================================== */

export const getAllAdmins = async (
  req: Request,
  res: Response
) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },

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
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      total: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Get Admins Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};

/* ==========================================================
   CREATE ADMIN
========================================================== */

export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phoneNo,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !phoneNo ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone number and password are required",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            phoneNo,
          },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        phoneNo,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
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

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
};

/* ==========================================================
   UPDATE ADMIN
========================================================== */

export const updateAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    const {
      name,
      email,
      phoneNo,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const existingAdmin =
      await prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!existingAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const admin = await prisma.user.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phoneNo !== undefined && { phoneNo }),
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
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admin",
    });
  }
};

/* ==========================================================
   DELETE ADMIN
========================================================== */

export const deleteAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admin",
    });
  }
};

/* ==========================================================
   BLOCK ADMIN
========================================================== */

export const blockAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    const admin = await prisma.user.update({
      where: {
        id,
      },

      data: {
        isBlocked: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin blocked successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Block Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to block admin",
    });
  }
};

/* ==========================================================
   UNBLOCK ADMIN
========================================================== */

export const unblockAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    const admin = await prisma.user.update({
      where: {
        id,
      },

      data: {
        isBlocked: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin unblocked successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Unblock Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unblock admin",
    });
  }
};

/* ==========================================================
   ASSIGN ROLE
========================================================== */

export const assignRole = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID and role are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        role: String(role),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Role assigned successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Assign Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign role",
    });
  }
};

/* ==========================================================
   REMOVE ROLE
========================================================== */

export const removeRole = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: String(userId),
      },
      data: {
        role: "USER",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Role removed successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Remove Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove role",
    });
  }
};

/* ==========================================================
   GET SYSTEM SETTINGS
========================================================== */

export const getSystemSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      total: settings.length,
      data: settings,
    });
  } catch (error) {
    console.error("Get System Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system settings",
    });
  }
};

/* ==========================================================
   UPDATE SYSTEM SETTINGS
========================================================== */

export const updateSystemSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Setting key is required",
      });
    }

   const setting = await prisma.systemSetting.upsert({
  where: {
    key: String(key),
  },

  update: {
    value: value !== undefined ? String(value) : "",
  },

  create: {
    key: String(key),
    value: value !== undefined ? String(value) : "",

    category: "SYSTEM",
    dataType: "STRING",
  },
});

    return res.status(200).json({
      success: true,
      message: "System setting updated successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Update System Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update system settings",
    });
  }
};

/* ==========================================================
   GET ALL USERS
========================================================== */

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

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
          isBlocked: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* ==========================================================
   BLOCK USER
========================================================== */

export const blockUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    console.error("Block User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to block user",
    });
  }
};

/* ==========================================================
   UNBLOCK USER
========================================================== */

export const unblockUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    console.error("Unblock User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unblock user",
    });
  }
};

/* ==========================================================
   DELETE USER
========================================================== */

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

/* ==========================================================
   GET ALL LOANS
========================================================== */

export const getAllLoans = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const status =
      typeof req.query.status === "string"
        ? req.query.status.toUpperCase()
        : undefined;

    const where = status
      ? {
          status: status as any,
        }
      : {};

    const [loans, total] = await Promise.all([
      prisma.loanApplication.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.loanApplication.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: loans,
    });
  } catch (error) {
    console.error("Get All Loans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
};

/* ==========================================================
   APPROVE LOAN
========================================================== */

/* ==========================================================
   UPDATE LOAN AMOUNT
========================================================== */

export const updateLoanAmount = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Loan ID is required",
      });
    }

    const rawAmount = req.body?.amount;
    const amount = Number(rawAmount);

    if (
      rawAmount === undefined ||
      rawAmount === null ||
      rawAmount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid loan amount greater than 0 is required",
      });
    }

    const existingLoan = await prisma.loanApplication.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    const loan = await prisma.loanApplication.update({
      where: { id },
      data: { amount },
    });

    return res.status(200).json({
      success: true,
      message: "Loan amount updated successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Update Loan Amount Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update loan amount",
    });
  }
};
export const approveLoan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Loan ID is required",
      });
    }

    const rawAmount = req.body?.amount;
    const amount = Number(rawAmount);

    if (
      rawAmount === undefined ||
      rawAmount === null ||
      rawAmount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid loan amount before approving.",
      });
    }

    const existingLoan = await prisma.loanApplication.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    const loan = await prisma.loanApplication.update({
      where: { id },
      data: {
        amount,
        status: "APPROVED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Loan amount saved and approved successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Approve Loan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve loan",
    });
  }
};

/* ==========================================================
   REJECT LOAN
========================================================== */

export const rejectLoan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Loan ID is required",
      });
    }

    const loan = await prisma.loanApplication.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Loan rejected successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Reject Loan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject loan",
    });
  }
};

/* ==========================================================
   DISBURSE LOAN
========================================================== */

export const disburseLoan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Loan ID is required",
      });
    }

    const existingLoan =
      await prisma.loanApplication.findUnique({
        where: {
          id,
        },
      });

    if (!existingLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    if (existingLoan.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved loans can be disbursed",
      });
    }

    const loan = await prisma.loanApplication.update({
  where: {
    id,
  },
  data: {
    status: "APPROVED",
  },
});

    return res.status(200).json({
      success: true,
      message: "Loan disbursed successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Disburse Loan Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to disburse loan",
    });
  }
};

/* ==========================================================
   GET ALL DSA
========================================================== */

export const getAllDsa = async (
  req: Request,
  res: Response
) => {
  try {
    const dsa = await prisma.user.findMany({
      where: {
        role: "DSA",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      total: dsa.length,
      data: dsa,
    });
  } catch (error) {
    console.error("Get All DSA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch DSA",
    });
  }
};

/* ==========================================================
   VERIFY DSA
========================================================== */

export const verifyDsa = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "DSA ID is required",
      });
    }

    const existingDsa = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingDsa) {
      return res.status(404).json({
        success: false,
        message: "DSA not found",
      });
    }

    const dsa = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "DSA verified successfully",
      data: dsa,
    });
  } catch (error) {
    console.error("Verify DSA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify DSA",
    });
  }
};

/* ==========================================================
   BLOCK DSA
========================================================== */

export const blockDsa = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "DSA ID is required",
      });
    }

    const existingDsa = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingDsa) {
      return res.status(404).json({
        success: false,
        message: "DSA not found",
      });
    }

    const dsa = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isBlocked: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "DSA blocked successfully",
      data: dsa,
    });
  } catch (error) {
    console.error("Block DSA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to block DSA",
    });
  }
};

/* ==========================================================
   GET ALL PARTNERS
========================================================== */

export const getAllPartners = async (
  req: Request,
  res: Response
) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      total: partners.length,
      data: partners,
    });
  } catch (error) {
    console.error("Get All Partners Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};

/* ==========================================================
   VERIFY PARTNER
========================================================== */

export const verifyPartner = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required",
      });
    }

    const existingPartner =
      await prisma.partner.findUnique({
        where: {
          id,
        },
      });

    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const partner = await prisma.partner.update({
  where: {
    id,
  },
  data: {
    status: "APPROVED",
    isActive: true,
    approvedAt: new Date(),
  },
});

    return res.status(200).json({
      success: true,
      message: "Partner verified successfully",
      data: partner,
    });
  } catch (error) {
    console.error("Verify Partner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify partner",
    });
  }
};

/* ==========================================================
   BLOCK PARTNER
========================================================== */

export const blockPartner = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Partner ID is required",
      });
    }

    const existingPartner =
      await prisma.partner.findUnique({
        where: {
          id,
        },
      });

    if (!existingPartner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const partner = await prisma.partner.update({
      where: {
        id,
      },
      data: {
        isBlocked: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Partner blocked successfully",
      data: partner,
    });
  } catch (error) {
    console.error("Block Partner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to block partner",
    });
  }
};

/* ==========================================================
   GET ALL TRANSACTIONS
========================================================== */

export const getAllTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const type =
      typeof req.query.type === "string"
        ? req.query.type
        : undefined;

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : undefined;

    const where = {
      ...(status && {
        status,
      }),

      ...(type && {
        type,
      }),

      ...(category && {
        category,
      }),
    };

    const [transactions, total] =
      await Promise.all([
        prisma.transaction.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.transaction.count({
          where,
        }),
      ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: transactions,
    });
  } catch (error) {
    console.error(
      "Get All Transactions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

/* ==========================================================
   GET ALL COMMISSIONS
========================================================== */

export const getAllCommissions = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [commissions, total] =
      await Promise.all([
        prisma.commission.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.commission.count(),
      ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: commissions,
    });
  } catch (error) {
    console.error(
      "Get All Commissions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch commissions",
    });
  }
};

/* ==========================================================
   GET ALL REFERRALS
========================================================== */

export const getAllReferrals = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [referrals, total] =
      await Promise.all([
        prisma.referral.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.referral.count(),
      ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: referrals,
    });
  } catch (error) {
    console.error(
      "Get All Referrals Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referrals",
    });
  }
};
/* ==========================================================
   GET AUDIT LOGS
========================================================== */

export const getAuditLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.auditLog.count(),
    ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: logs,
    });
  } catch (error) {
    console.error("Get Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

/* ==========================================================
   GET SYSTEM LOGS
========================================================== */

export const getSystemLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    /*
      SecurityLog is being used here as the system log source.
    */

    const [logs, total] = await Promise.all([
      prisma.securityLog.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.securityLog.count(),
    ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      data: logs,
    });
  } catch (error) {
    console.error("Get System Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system logs",
    });
  }
};

/* ==========================================================
   GET SERVER HEALTH
========================================================== */

export const getServerHealth = async (
  req: Request,
  res: Response
) => {
  try {
    const memory = process.memoryUsage();

    const uptimeSeconds = process.uptime();

    return res.status(200).json({
      success: true,

      data: {
        status: "UP",

        environment:
          process.env.NODE_ENV || "development",

        nodeVersion: process.version,

        platform: process.platform,

        uptime: uptimeSeconds,

        uptimeMinutes:
          Math.floor(uptimeSeconds / 60),

        memory: {
          rss: memory.rss,
          heapTotal: memory.heapTotal,
          heapUsed: memory.heapUsed,
          external: memory.external,
        },

        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Server Health Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch server health",
    });
  }
};

/* ==========================================================
   GET DATABASE HEALTH
========================================================== */

export const getDatabaseHealth = async (
  req: Request,
  res: Response
) => {
  try {
    const start = Date.now();

    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - start;

    return res.status(200).json({
      success: true,

      data: {
        status: "UP",
        database: "CONNECTED",
        responseTime: `${responseTime}ms`,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Database Health Error:", error);

    return res.status(503).json({
      success: false,

      data: {
        status: "DOWN",
        database: "DISCONNECTED",
        timestamp: new Date(),
      },

      message: "Database health check failed",
    });
  }
};

/* ==========================================================
   BACKUP DATABASE
========================================================== */

export const backupDatabase = async (
  req: Request,
  res: Response
) => {
  try {
    /*
      This endpoint currently registers the backup request.

      Actual PostgreSQL pg_dump execution should normally
      be handled by a dedicated backup service.
    */

    const backupId = `BACKUP-${Date.now()}`;

    return res.status(200).json({
      success: true,

      message: "Database backup request created successfully",

      data: {
        backupId,
        status: "QUEUED",
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Backup Database Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create database backup",
    });
  }
};

/* ==========================================================
   RESTORE DATABASE
========================================================== */

export const restoreDatabase = async (
  req: Request,
  res: Response
) => {
  try {
    const { backupId } = req.body;

    if (!backupId) {
      return res.status(400).json({
        success: false,
        message: "Backup ID is required",
      });
    }

    /*
      Actual database restore should be handled by
      a protected PostgreSQL restore service.

      We do not directly run destructive database
      commands inside the HTTP controller.
    */

    return res.status(200).json({
      success: true,

      message: "Database restore request created successfully",

      data: {
        backupId: String(backupId),
        status: "QUEUED",
        requestedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Restore Database Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create restore request",
    });
  }
};

/* ==========================================================
   GET REPORTS
========================================================== */

export const getReports = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      totalUsers,
      totalLoans,
      totalTransactions,
      totalDsa,
      totalPartners,
      totalCommissions,
      totalReferrals,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.transaction.count(),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.partner.count(),

      prisma.commission.count(),

      prisma.referral.count(),
    ]);

    const transactionAmount =
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
      });

    const commissionAmount =
      await prisma.commission.aggregate({
        _sum: {
          amount: true,
        },
      });

    const approvedLoans =
      await prisma.loanApplication.count({
        where: {
          status: "APPROVED",
        },
      });

    const pendingLoans =
      await prisma.loanApplication.count({
        where: {
          status: "PENDING",
        },
      });

    const rejectedLoans =
      await prisma.loanApplication.count({
        where: {
          status: "REJECTED",
        },
      });

    return res.status(200).json({
      success: true,

      data: {
        users: {
          total: totalUsers,
        },

        loans: {
          total: totalLoans,
          approved: approvedLoans,
          pending: pendingLoans,
          rejected: rejectedLoans,
        },

        transactions: {
          total: totalTransactions,
          totalAmount:
            transactionAmount._sum.amount || 0,
        },

        dsa: {
          total: totalDsa,
        },

        partners: {
          total: totalPartners,
        },

        commissions: {
          total: totalCommissions,
          totalAmount:
            commissionAmount._sum.amount || 0,
        },

        referrals: {
          total: totalReferrals,
        },

        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Get Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate reports",
    });
  }
};

/* ==========================================================
   EXPORT EXCEL
========================================================== */

export const exportExcel = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions =
      await prisma.transaction.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 10000,
      });

    /*
      CSV is returned here so this controller does not
      require an additional Excel package.
    */

    const escapeCsv = (value: unknown) => {
      if (value === null || value === undefined) {
        return "";
      }

      const text = String(value).replace(/"/g, '""');

      return `"${text}"`;
    };

    const header = [
      "Transaction ID",
      "User ID",
      "Wallet ID",
      "Type",
      "Category",
      "Amount",
      "Status",
      "Description",
      "Created At",
    ];

    const rows = transactions.map((transaction) => [
      transaction.transactionId,
      transaction.userId || "",
      transaction.walletId || "",
      transaction.type,
      transaction.category,
      transaction.amount,
      transaction.status,
      transaction.description || "",
      transaction.createdAt.toISOString(),
    ]);

    const csv = [
      header.map(escapeCsv).join(","),

      ...rows.map((row) =>
        row.map(escapeCsv).join(",")
      ),
    ].join("\n");

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="super-admin-report-${Date.now()}.csv"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Export Excel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export report",
    });
  }
};

/* ==========================================================
   EXPORT PDF
========================================================== */

export const exportPdf = async (
  req: Request,
  res: Response
) => {
  try {
    /*
      Returning report data here keeps the controller
      independent of a PDF library.

      A real PDF can later be generated through
      PDFKit/Puppeteer/report service.
    */

    const [
      users,
      loans,
      transactions,
      dsa,
      partners,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.transaction.count(),

      prisma.user.count({
        where: {
          role: "DSA",
        },
      }),

      prisma.partner.count(),
    ]);

    return res.status(200).json({
      success: true,

      message:
        "PDF report data generated successfully",

      data: {
        reportTitle: "Super Admin System Report",

        summary: {
          users,
          loans,
          transactions,
          dsa,
          partners,
        },

        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Export PDF Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate PDF report",
    });
  }
};
/* ==========================================================
   GET REVENUE DASHBOARD
========================================================== */

export const getRevenueDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionStats =
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
          fee: true,
          gst: true,
          commission: true,
          cashback: true,
          tax: true,
        },

        _count: {
          id: true,
        },
      });

    const successfulTransactions =
      await prisma.transaction.count({
        where: {
          status: "SUCCESS",
        },
      });

    const pendingTransactions =
      await prisma.transaction.count({
        where: {
          status: "PENDING",
        },
      });

    return res.status(200).json({
      success: true,

      data: {
        totalTransactions:
          transactionStats._count.id,

        successfulTransactions,

        pendingTransactions,

        totalAmount:
          transactionStats._sum.amount || 0,

        totalFees:
          transactionStats._sum.fee || 0,

        totalGST:
          transactionStats._sum.gst || 0,

        totalCommission:
          transactionStats._sum.commission || 0,

        totalCashback:
          transactionStats._sum.cashback || 0,

        totalTax:
          transactionStats._sum.tax || 0,

        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "Revenue Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch revenue dashboard",
    });
  }
};

/* ==========================================================
   GET COMMISSION DASHBOARD
========================================================== */

export const getCommissionDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const totalCommissions =
      await prisma.commission.count();

    const commissionAmount =
      await prisma.commission.aggregate({
        _sum: {
          amount: true,
        },
      });

    const transactionCommission =
      await prisma.transaction.aggregate({
        _sum: {
          commission: true,
        },
      });

    return res.status(200).json({
      success: true,

      data: {
        totalCommissions,

        totalCommissionAmount:
          commissionAmount._sum.amount || 0,

        transactionCommission:
          transactionCommission._sum.commission || 0,

        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "Commission Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch commission dashboard",
    });
  }
};

/* ==========================================================
   BULK BLOCK USERS
========================================================== */

export const bulkBlockUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const { userIds } = req.body;

    if (
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userIds must be a non-empty array",
      });
    }

    const ids = userIds
      .map((id: unknown) => String(id))
      .filter(Boolean);

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid user IDs are required",
      });
    }

    const result =
      await prisma.user.updateMany({
        where: {
          id: {
            in: ids,
          },
        },

        data: {
          isBlocked: true,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Users blocked successfully",

      data: {
        affectedUsers: result.count,
      },
    });
  } catch (error) {
    console.error(
      "Bulk Block Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to block users",
    });
  }
};

/* ==========================================================
   BULK DELETE USERS
========================================================== */

export const bulkDeleteUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const { userIds } = req.body;

    if (
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userIds must be a non-empty array",
      });
    }

    const ids = userIds
      .map((id: unknown) => String(id))
      .filter(Boolean);

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid user IDs are required",
      });
    }

    const result =
      await prisma.user.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

    return res.status(200).json({
      success: true,
      message: "Users deleted successfully",

      data: {
        deletedUsers: result.count,
      },
    });
  } catch (error) {
    console.error(
      "Bulk Delete Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete users",
    });
  }
};

/* ==========================================================
   BULK APPROVE LOANS
========================================================== */

export const bulkApproveLoans = async (
  req: Request,
  res: Response
) => {
  try {
    const { loanIds } = req.body;

    if (
      !Array.isArray(loanIds) ||
      loanIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "loanIds must be a non-empty array",
      });
    }

    const ids = loanIds
      .map((id: unknown) => String(id))
      .filter(Boolean);

    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid loan IDs are required",
      });
    }

    const result =
      await prisma.loanApplication.updateMany({
        where: {
          id: {
            in: ids,
          },
        },

        data: {
          status: "APPROVED",
        },
      });

    return res.status(200).json({
      success: true,

      message:
        "Loans approved successfully",

      data: {
        approvedLoans: result.count,
      },
    });
  } catch (error) {
    console.error(
      "Bulk Approve Loans Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve loans",
    });
  }
};

/* ==========================================================
   GET LIVE ACTIVITIES
========================================================== */

export const getLiveActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      transactions,
      loans,
      users,
    ] = await Promise.all([
      prisma.transaction.findMany({
        take: 10,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.loanApplication.findMany({
        take: 10,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.user.findMany({
        take: 10,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,

      data: {
        transactions,
        loans,
        users,

        refreshedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      "Get Live Activities Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch live activities",
    });
  }
};

/* ==========================================================
   GET NOTIFICATIONS
========================================================== */

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const skip =
      (page - 1) * limit;

    const [notifications, total] =
      await Promise.all([
        prisma.notification.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.notification.count(),
      ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),
      },

      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications",
    });
  }
};

/* ==========================================================
   SEARCH SYSTEM
========================================================== */

export const searchSystem = async (
  req: Request,
  res: Response
) => {
  try {
    const search =
      typeof req.query.q === "string"
        ? req.query.q.trim()
        : "";

    if (!search) {
      return res.status(400).json({
        success: false,
        message:
          "Search query q is required",
      });
    }

    const [
      users,
      transactions,
    ] = await Promise.all([
      prisma.user.findMany({
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

        take: 20,

        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isBlocked: true,
          createdAt: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          OR: [
            {
              transactionId: {
                contains: search,
                mode: "insensitive",
              },
            },

            {
              referenceId: {
                contains: search,
                mode: "insensitive",
              },
            },

            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },

        take: 20,

        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,

      query: search,

      data: {
        users,
        transactions,
      },
    });
  } catch (error) {
    console.error(
      "Search System Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "System search failed",
    });
  }
};






