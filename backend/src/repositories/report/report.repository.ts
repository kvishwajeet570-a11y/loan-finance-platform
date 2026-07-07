import { prisma } from "../../prisma";

export class ReportRepository {

  /* =========================
      CREATE REPORT
  ========================= */

  static async createReport(data: {
    reportName: string;
    reportType: string;
    generatedBy: string;
    format: string;
    startDate?: Date;
    endDate?: Date;
  }) {

    return prisma.report.create({
      data
    });
  }

  /* =========================
      GET REPORT BY ID
  ========================= */

  static async getById(
    id: string
  ) {

    return prisma.report.findUnique({
      where: { id }
    });
  }

  /* =========================
      UPDATE STATUS
  ========================= */

  static async updateStatus(
    id: string,
    status: string
  ) {

    return prisma.report.update({

      where: {
        id
      },

      data: {
        status
      }
    });
  }

  /* =========================
      COMPLETE REPORT
  ========================= */

  static async completeReport(
    id: string,
    fileUrl: string,
    totalRecords: number
  ) {

    return prisma.report.update({

      where: {
        id
      },

      data: {
        fileUrl,
        totalRecords,
        status: "COMPLETED",
        generatedAt: new Date()
      }
    });
  }

  /* =========================
      FAIL REPORT
  ========================= */

  static async failReport(
    id: string,
    remarks: string
  ) {

    return prisma.report.update({

      where: {
        id
      },

      data: {
        status: "FAILED",
        remarks
      }
    });
  }

  /* =========================
      GET ALL REPORTS
  ========================= */

  static async getAllReports(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [reports, total] =
      await Promise.all([

        prisma.report.findMany({

          skip,
          take: limit,

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.report.count()
      ]);

    return {
      reports,
      total,
      page,
      limit
    };
  }

  /* =========================
      USER REPORTS
  ========================= */

  static async getUserReports(
    generatedBy: string
  ) {

    return prisma.report.findMany({

      where: {
        generatedBy
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      REPORTS BY TYPE
  ========================= */

  static async getReportsByType(
    reportType: string
  ) {

    return prisma.report.findMany({

      where: {
        reportType
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      REPORTS BY STATUS
  ========================= */

  static async getReportsByStatus(
    status: string
  ) {

    return prisma.report.findMany({

      where: {
        status
      }
    });
  }

  /* =========================
      SEARCH REPORTS
  ========================= */

  static async searchReports(
    keyword: string
  ) {

    return prisma.report.findMany({

      where: {

        OR: [

          {
            reportName: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            reportType: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      DELETE REPORT
  ========================= */

  static async deleteReport(
    id: string
  ) {

    return prisma.report.delete({
      where: { id }
    });
  }

  /* =========================
      REPORT ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalReports,
      completedReports,
      pendingReports,
      failedReports
    ] = await Promise.all([

      prisma.report.count(),

      prisma.report.count({
        where: {
          status: "COMPLETED"
        }
      }),

      prisma.report.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.report.count({
        where: {
          status: "FAILED"
        }
      })
    ]);

    return {
      totalReports,
      completedReports,
      pendingReports,
      failedReports
    };
  }

  /* =========================
      DASHBOARD
  ========================= */

  static async getDashboard() {

    const [
      analytics,
      recentReports
    ] = await Promise.all([

      this.getAnalytics(),

      prisma.report.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return {
      analytics,
      recentReports
    };
  }
}