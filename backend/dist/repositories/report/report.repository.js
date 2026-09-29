"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const prisma_1 = __importDefault(require("../../config/database/prisma"));
class ReportRepository {
    /* =========================================
        CREATE & UPDATE OPERATIONS
    ========================================= */
    static async createReport(data) {
        return prisma_1.default.report.create({ data });
    }
    static async updateStatus(id, status) {
        return prisma_1.default.report.update({
            where: { id },
            data: { status },
        });
    }
    static async completeReport(id, fileUrl, totalRecords) {
        return prisma_1.default.report.update({
            where: { id },
            data: {
                fileUrl,
                totalRecords,
                status: "COMPLETED",
                generatedAt: new Date(),
            },
        });
    }
    static async failReport(id, remarks) {
        return prisma_1.default.report.update({
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
    static async getById(id) {
        return prisma_1.default.report.findUnique({ where: { id } });
    }
    static async exists(id) {
        const report = await prisma_1.default.report.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!report;
    }
    static async getAllReports(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [reports, total] = await Promise.all([
            prisma_1.default.report.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.default.report.count(),
        ]);
        return {
            reports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getUserReports(generatedBy) {
        return prisma_1.default.report.findMany({
            where: { generatedBy },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getReportsByType(reportType) {
        return prisma_1.default.report.findMany({
            where: { reportType },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getReportsByStatus(status) {
        return prisma_1.default.report.findMany({
            where: { status },
            orderBy: { createdAt: "desc" },
        });
    }
    static async getRecentReports(limit = 10) {
        return prisma_1.default.report.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
        });
    }
    static async searchReports(keyword) {
        return prisma_1.default.report.findMany({
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
        const counts = await prisma_1.default.report.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
        });
        const statusMap = {
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
        return prisma_1.default.report.count();
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
    static async deleteReport(id) {
        return prisma_1.default.report.delete({ where: { id } });
    }
    static async bulkDeleteReports(ids) {
        return prisma_1.default.report.deleteMany({
            where: { id: { in: ids } },
        });
    }
    static async bulkUpdateStatus(ids, status) {
        return prisma_1.default.report.updateMany({
            where: { id: { in: ids } },
            data: { status },
        });
    }
}
exports.ReportRepository = ReportRepository;
