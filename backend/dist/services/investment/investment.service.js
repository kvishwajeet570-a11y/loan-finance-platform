"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class InvestmentService {
    /* ========================================
       CRUD
    ======================================== */
    static async createInvestment(data) {
        return prisma_1.default.investment.create({
            data,
        });
    }
    static async getAllInvestments() {
        return prisma_1.default.investment.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async getInvestmentById(id) {
        return prisma_1.default.investment.findUnique({
            where: { id },
        });
    }
    static async updateInvestment(id, data) {
        return prisma_1.default.investment.update({
            where: { id },
            data,
        });
    }
    static async deleteInvestment(id) {
        return prisma_1.default.investment.delete({
            where: { id },
        });
    }
    /* ========================================
       SEARCH
    ======================================== */
    static async searchInvestments(search) {
        return prisma_1.default.investment.findMany({
            where: {
                OR: [
                    {
                        title: {
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
        });
    }
    /* ========================================
       STATUS
    ======================================== */
    static async getPendingInvestments() {
        return prisma_1.default.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.PENDING,
            },
        });
    }
    static async getActiveInvestments() {
        return prisma_1.default.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
    }
    static async getClosedInvestments() {
        return prisma_1.default.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.CLOSED,
            },
        });
    }
    static async getRejectedInvestments() {
        return prisma_1.default.investment.findMany({
            where: {
                status: client_1.InvestmentStatus.REJECTED,
            },
        });
    }
    /* ========================================
       APPROVAL
    ======================================== */
    static async approveInvestment(id) {
        return prisma_1.default.investment.update({
            where: { id },
            data: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
    }
    static async rejectInvestment(id) {
        return prisma_1.default.investment.update({
            where: { id },
            data: {
                status: client_1.InvestmentStatus.REJECTED,
            },
        });
    }
    static async activateInvestment(id) {
        return prisma_1.default.investment.update({
            where: { id },
            data: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
    }
    static async closeInvestment(id) {
        return prisma_1.default.investment.update({
            where: { id },
            data: {
                status: client_1.InvestmentStatus.CLOSED,
            },
        });
    }
    /* ========================================
       USER
    ======================================== */
    static async getUserInvestments(userId) {
        return prisma_1.default.userInvestment.findMany({
            where: {
                userId,
            },
            include: {
                investment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       ANALYTICS
    ======================================== */
    static async getInvestmentAnalytics() {
        const total = await prisma_1.default.investment.count();
        const active = await prisma_1.default.investment.count({
            where: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
        return {
            total,
            active,
        };
    }
    static async getInvestmentDashboard() {
        const total = await prisma_1.default.investment.count();
        const active = await prisma_1.default.investment.count({
            where: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
        const pending = await prisma_1.default.investment.count({
            where: {
                status: client_1.InvestmentStatus.PENDING,
            },
        });
        return {
            total,
            active,
            pending,
        };
    }
    /* ========================================
       TOP DATA
    ======================================== */
    static async getTopInvestors() {
        return [];
    }
    static async getTopPlans() {
        return prisma_1.default.investment.findMany({
            take: 5,
            orderBy: {
                interestRate: "desc",
            },
        });
    }
    static async getMonthlyInvestments() {
        return [];
    }
    /* ========================================
       RETURNS
    ======================================== */
    static async getInvestmentReturns(id) {
        return prisma_1.default.investment.findUnique({
            where: { id },
        });
    }
    static async calculateReturns(principal, annualRate, years) {
        const maturityAmount = principal *
            Math.pow(1 + annualRate / 100, years);
        return {
            principal,
            maturityAmount,
            profit: maturityAmount - principal,
        };
    }
    /* ========================================
       EXPORT
    ======================================== */
    static async exportInvestmentsExcel() {
        return [];
    }
    static async exportInvestmentsPdf() {
        return [];
    }
    /* ========================================
       BULK
    ======================================== */
    static async bulkApproveInvestments(ids) {
        return prisma_1.default.investment.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: client_1.InvestmentStatus.ACTIVE,
            },
        });
    }
    static async bulkRejectInvestments(ids) {
        return prisma_1.default.investment.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: client_1.InvestmentStatus.REJECTED,
            },
        });
    }
}
exports.InvestmentService = InvestmentService;
exports.default = InvestmentService;
