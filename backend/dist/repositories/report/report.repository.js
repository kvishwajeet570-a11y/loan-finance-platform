"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const prisma_1 = require("../../prisma");
class ReportRepository {
    /* =========================
        CREATE REPORT
    ========================= */
    static async createReport(data) {
        return prisma_1.prisma.report.create({
            data
        });
    }
    /* =========================
        GET REPORT BY ID
    ========================= */
    static async getById(id) {
        return prisma_1.prisma.report.findUnique({
            where: { id }
        });
    }
    /* =========================
        UPDATE STATUS
    ========================= */
    static async updateStatus(id, status) {
        return prisma_1.prisma.report.update({
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
    static async completeReport(id, fileUrl, totalRecords) {
        return prisma_1.prisma.report.update({
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
    static async failReport(id, remarks) {
        return prisma_1.prisma.report.update({
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
    static async getAllReports(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reports, total] = await Promise.all([
            prisma_1.prisma.report.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.report.count()
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
    static async getUserReports(generatedBy) {
        return prisma_1.prisma.report.findMany({
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
    static async getReportsByType(reportType) {
        return prisma_1.prisma.report.findMany({
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
    static async getReportsByStatus(status) {
        return prisma_1.prisma.report.findMany({
            where: {
                status
            }
        });
    }
    /* =========================
        SEARCH REPORTS
    ========================= */
    static async searchReports(keyword) {
        return prisma_1.prisma.report.findMany({
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
    static async deleteReport(id) {
        return prisma_1.prisma.report.delete({
            where: { id }
        });
    }
    /* =========================
        REPORT ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalReports, completedReports, pendingReports, failedReports] = await Promise.all([
            prisma_1.prisma.report.count(),
            prisma_1.prisma.report.count({
                where: {
                    status: "COMPLETED"
                }
            }),
            prisma_1.prisma.report.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.report.count({
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
        const [analytics, recentReports] = await Promise.all([
            this.getAnalytics(),
            prisma_1.prisma.report.findMany({
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
exports.ReportRepository = ReportRepository;
