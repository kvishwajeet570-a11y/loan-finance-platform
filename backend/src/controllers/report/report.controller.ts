import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * DASHBOARD REPORT
 */
export const dashboardReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      users,
      loans,
      approvedLoans,
      disbursedLoans,
      partners,
      dsa,
      payments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),
      prisma.loanApplication.count({
        where: { status: "APPROVED" },
      }),
      prisma.loanApplication.count({
        where: { status: "DISBURSED" },
      }),
      prisma.partner.count(),
      prisma.dSA.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "SUCCESS",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        loans,
        approvedLoans,
        disbursedLoans,
        partners,
        dsa,
        revenue:
          payments._sum.amount || 0,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Report generation failed",
    });
  }
};

/**
 * LOAN REPORT
 */
export const loanReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status =
      req.query.status as string;

    const loans =
      await prisma.loanApplication.findMany({
        where: status
          ? { status }
          : {},
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      total: loans.length,
      data: loans,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Loan report failed",
    });
  }
};

/**
 * PAYMENT REPORT
 */
export const paymentReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments =
      await prisma.payment.findMany({
        include: {
          user: true,
        },
      });

    const totalVolume =
      await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "SUCCESS",
        },
      });

    res.status(200).json({
      success: true,
      totalTransactions:
        payments.length,
      totalVolume:
        totalVolume._sum.amount || 0,
      data: payments,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Payment report failed",
    });
  }
};

/**
 * DSA REPORT
 */
export const dsaReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await prisma.dSA.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      total: dsa.length,
      data: dsa,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "DSA report failed",
    });
  }
};

/**
 * PARTNER REPORT
 */
export const partnerReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partners =
      await prisma.partner.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      total: partners.length,
      data: partners,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Partner report failed",
    });
  }
};

/**
 * REVENUE REPORT
 */
export const revenueReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const revenue =
      await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "SUCCESS",
        },
      });

    const monthly =
      await prisma.payment.groupBy({
        by: ["createdAt"],
        _sum: {
          amount: true,
        },
      });

    res.status(200).json({
      success: true,
      totalRevenue:
        revenue._sum.amount || 0,
      monthly,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Revenue report failed",
    });
  }
};

/**
 * REPORT ANALYTICS
 */
export const reportAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalUsers,
      totalLoans,
      totalPayments,
      totalPartners,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),
      prisma.payment.count(),
      prisma.partner.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLoans,
        totalPayments,
        totalPartners,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};