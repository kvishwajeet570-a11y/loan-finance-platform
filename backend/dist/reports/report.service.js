"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporterService = void 0;
const prisma_1 = require("../../prisma/prisma");
class ReporterService {
    static async getDashboardReport() {
        const [totalUsers, totalLoans, approvedLoans, rejectedLoans, pendingLoans, totalDisbursed] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.loanApplication.count(),
            prisma_1.prisma.loanApplication.count({
                where: {
                    status: "APPROVED"
                }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    status: "REJECTED"
                }
            }),
            prisma_1.prisma.loanApplication.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.prisma.loanApplication.aggregate({
                _sum: {
                    amount: true
                }
            })
        ]);
        return {
            totalUsers,
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
            totalDisbursed: totalDisbursed._sum.amount || 0
        };
    }
    static async getLoanReport() {
        return prisma_1.prisma.loanApplication.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    static async getKycReport() {
        return prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isVerified: true
            }
        });
    }
    static async getRevenueReport() {
        const revenue = await prisma_1.prisma.transaction.aggregate({
            _sum: {
                amount: true
            }
        });
        return {
            totalRevenue: revenue._sum.amount || 0
        };
    }
}
exports.ReporterService = ReporterService;
