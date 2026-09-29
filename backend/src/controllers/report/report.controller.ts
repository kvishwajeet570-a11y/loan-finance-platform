import { Request, Response } from "express";
import { LoanStatus, Prisma } from "@prisma/client";
import prisma from "../../config/database/prisma";
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
  payments,
]
    = await Promise.all([
      prisma.user.count(),
      prisma.loanApplication.count(),
      prisma.loanApplication.count({
        where: { status: "APPROVED" },
      }),
      prisma.loanApplication.count({
        where: { status: LoanStatus.APPROVED },
      }),
      prisma.partner.count(),
      
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
        dsa: 0,
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
  req.query.status as LoanStatus | undefined;

const where: Prisma.LoanApplicationWhereInput = {};

if (status) {
  where.status = status;
}

    const loans =
      await prisma.loanApplication.findMany({
        where: where,
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
  res.status(200).json({
    success: true,
    total: 0,
    data: [],
    message: "DSA module not available.",
  });
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

/* =========================================
   ALIAS EXPORTS FOR ROUTES
========================================= */

export const getDashboardReport = dashboardReport;
export const getLoanReport = loanReport;
export const getPaymentReport = paymentReport;
export const getDsaReport = dsaReport;
export const getPartnerReport = partnerReport;
export const getRevenueReport = revenueReport;
export const getReportAnalytics = reportAnalytics;
export const getCustomerReport = loanReport;
export const getCommissionReport = revenueReport;
export const getTransactionReport = paymentReport;
export const getWalletReport = paymentReport;
export const getKycReport = dashboardReport;
export const getInsuranceReport = dashboardReport;
export const getInvestmentReport = dashboardReport;
export const getFastagReport = dashboardReport;
export const getReferralReport = dashboardReport;
export const getRechargeReport = paymentReport;

export const getDailyReport = dashboardReport;
export const getWeeklyReport = dashboardReport;
export const getMonthlyReport = dashboardReport;
export const getQuarterlyReport = dashboardReport;
export const getYearlyReport = dashboardReport;

export const getPendingReport = loanReport;
export const getApprovedReport = loanReport;
export const getRejectedReport = loanReport;

export const getTopCustomersReport = dashboardReport;
export const getTopDsaReport = dsaReport;
export const getTopPartnersReport = partnerReport;

export const getGrowthReport = dashboardReport;
export const getPerformanceReport = dashboardReport;
export const getConversionReport = dashboardReport;
export const getProfitLossReport = revenueReport;

export const getAuditReport = dashboardReport;
export const getFraudReport = dashboardReport;

export const exportReportExcel = dashboardReport;
export const exportReportPdf = dashboardReport;
export const exportReportCsv = dashboardReport;

export const scheduleReport = dashboardReport;
export const getScheduledReports = dashboardReport;

export const searchReports = dashboardReport;

export const getReportById = dashboardReport;
export const createReport = dashboardReport;
export const updateReport = dashboardReport;
export const deleteReport = dashboardReport;

export const bulkDeleteReports = dashboardReport;
export const bulkExportReports = dashboardReport;
