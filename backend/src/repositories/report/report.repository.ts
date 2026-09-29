import prisma from "../../config/database/prisma";

// TypeScript interfaces for type safety
interface CreateReportInput {
  reportName: string;
  reportType: string;
  generatedBy: string;
  format: string;
}

export class ReportRepository {
  /* =========================================
      CREATE & UPDATE OPERATIONS
  ========================================= */

  static async createReport(data: CreateReportInput) {
    return prisma.report.create({ data });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  static async completeReport(id: string, fileUrl: string, totalRecords: number) {
    return prisma.report.update({
      where: { id },
      data: {
        fileUrl,
        totalRecords,
        status: "COMPLETED",
        generatedAt: new Date(),
      },
    });
  }

  static async failReport(id: string, remarks: string) {
    return prisma.report.update({
      where: { id },
      data: {
        status: "FAILED",
        remarks,
      },
    });
  }

  /* =========================================
      READ OPERATIONS (SINGLE / LIST / SEARCH)
  ========================================= */

  static async getById(id: string) {
    return prisma.report.findUnique({ where: { id } });
  }

  static async exists(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!report;
  }

  static async getAllReports(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.count(),
    ]);

    return {
      reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserReports(generatedBy: string) {
    return prisma.report.findMany({
      where: { generatedBy },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getReportsByType(reportType: string) {
    return prisma.report.findMany({
      where: { reportType },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getReportsByStatus(status: string) {
    return prisma.report.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getRecentReports(limit: number = 10) {
    return prisma.report.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  static async searchReports(keyword: string) {
    return prisma.report.findMany({
      where: {
        OR: [
          { reportName: { contains: keyword, mode: "insensitive" } },
          { reportType: { contains: keyword, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /* =========================================
      ANALYTICS & DASHBOARD (OPTIMIZED)
  ========================================= */

  // Ek hi query mein saare counts nikalne ke liye groupBy use kiya hai
  static async getAnalytics() {
    const counts = await prisma.report.groupBy({
  by: ["status"],
  _count: {
    _all: true,
  },
});

const statusMap: Record<string, number> = {
  PENDING: 0,
  COMPLETED: 0,
  FAILED: 0,
};

let totalReports = 0;

counts.forEach((item) => {
  statusMap[item.status] = item._count._all;
  totalReports += item._count._all;
});

    return {
      totalReports,
      completedReports: statusMap.COMPLETED,
      pendingReports: statusMap.PENDING,
      failedReports: statusMap.FAILED,
    };
  }

  static async getDashboard() {
    const [analytics, recentReports] = await Promise.all([
      this.getAnalytics(),
      this.getRecentReports(10), // Purane duplicate code ki jagah existing method use kiya
    ]);

    return { analytics, recentReports };
  }

  static async countReports() {
    return prisma.report.count();
  }

  // getAnalytics() ka optimized response hi return karega bina DB par extra load dale
  static async getStatusWiseCount() {
    const analytics = await this.getAnalytics();
    return {
      pending: analytics.pendingReports,
      completed: analytics.completedReports,
      failed: analytics.failedReports,
      total: analytics.totalReports
    };
  }

  /* =========================================
      DELETE OPERATIONS
  ========================================= */

  static async deleteReport(id: string) {
    return prisma.report.delete({ where: { id } });
  }

  static async bulkDeleteReports(ids: string[]) {
    return prisma.report.deleteMany({
      where: { id: { in: ids } },
    });
  }

  static async bulkUpdateStatus(ids: string[], status: string) {
    return prisma.report.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
  }
}