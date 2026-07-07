"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LoanService {
    /**
     * Apply Loan
     */
    async applyLoan(data) {
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                id: data.userId,
            },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const interestRate = await this.calculateInterestRate(data.amount);
        const tenure = data.tenureMonths || 12;
        const emi = this.calculateEMI(data.amount, interestRate, tenure);
        return prisma_1.default.loanApplication.create({
            data: {
                userId: data.userId,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                loanType: data.loanType,
                amount: data.amount,
                monthlyIncome: data.monthlyIncome,
                panNo: data.panNo,
                dob: data.dob,
                tenureMonths: tenure,
                interestRate,
                monthlyEMI: emi,
                status: "pending",
            },
        });
    }
    /**
     * Get Loan By ID
     */
    async getLoanById(loanId) {
        return prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
            include: {
                user: true,
            },
        });
    }
    /**
     * User Loan History
     */
    async getUserLoans(userId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get All Loans
     */
    async getAllLoans(page = 1, limit = 20, search = "") {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    {
                        fullName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: search,
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : {};
        const [loans, total] = await Promise.all([
            prisma_1.default.loanApplication.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: true,
                },
            }),
            prisma_1.default.loanApplication.count({
                where,
            }),
        ]);
        return {
            loans,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Approve Loan
     */
    async approveLoan(loanId, approvedBy) {
        const loan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!loan) {
            throw new Error("Loan not found");
        }
        const updatedLoan = await prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "approved",
                approvedAt: new Date(),
                approvedBy,
            },
        });
        await prisma_1.default.notification.create({
            data: {
                userId: loan.userId,
                title: "Loan Approved",
                message: `Your ₹${loan.amount} loan has been approved.`,
            },
        });
        return updatedLoan;
    }
    /**
     * Reject Loan
     */
    async rejectLoan(loanId, reason) {
        const loan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!loan) {
            throw new Error("Loan not found");
        }
        const updatedLoan = await prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "rejected",
                rejectionReason: reason,
            },
        });
        await prisma_1.default.notification.create({
            data: {
                userId: loan.userId,
                title: "Loan Rejected",
                message: reason,
            },
        });
        return updatedLoan;
    }
    /**
     * Assign Loan To DSA
     */
    async assignLoan(loanId, dsaId) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                assignedTo: dsaId,
            },
        });
    }
    /**
     * Update Loan Status
     */
    async updateLoanStatus(loanId, status) {
        return prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status,
            },
        });
    }
    /**
     * Delete Loan
     */
    async deleteLoan(loanId) {
        return prisma_1.default.loanApplication.delete({
            where: {
                id: loanId,
            },
        });
    }
    /**
     * Loan Dashboard Stats
     */
    async getLoanStats() {
        const [totalLoans, approvedLoans, rejectedLoans, pendingLoans, totalAmount,] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "approved",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "rejected",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "pending",
                },
            }),
            prisma_1.default.loanApplication.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return {
            totalLoans,
            approvedLoans,
            rejectedLoans,
            pendingLoans,
            totalDisbursed: totalAmount._sum
                .amount || 0,
        };
    }
    /**
     * Monthly Loan Report
     */
    async monthlyReport() {
        const currentYear = new Date().getFullYear();
        return prisma_1.default.$queryRaw `
      SELECT
      EXTRACT(MONTH FROM "createdAt") as month,
      COUNT(*) as total_loans,
      SUM(amount) as total_amount
      FROM "LoanApplication"
      WHERE EXTRACT(YEAR FROM "createdAt") = ${currentYear}
      GROUP BY month
      ORDER BY month ASC
    `;
    }
    /**
     * EMI Calculator
     */
    calculateEMI(amount, interest, months) {
        const r = interest / 12 / 100;
        return Math.round((amount *
            r *
            Math.pow(1 + r, months)) /
            (Math.pow(1 + r, months) -
                1));
    }
    /**
     * Dynamic Interest
     */
    async calculateInterestRate(amount) {
        if (amount <= 100000)
            return 11;
        if (amount <= 500000)
            return 10;
        if (amount <= 1000000)
            return 9;
        return 8;
    }
    /**
     * Top Performing DSA
     */
    async topDSA() {
        return prisma_1.default.loanApplication.groupBy({
            by: ["assignedTo"],
            where: {
                status: "approved",
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: 10,
        });
    }
}
exports.default = new LoanService();
