import prisma from "../../prisma/prisma";
import { LoanStatus } from "@prisma/client";

interface ApplyLoanDTO {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  loanType: string;
  amount: number;
  monthlyIncome?: number;
  panNo?: string;
  dob?: string;
  tenureMonths?: number;
}

class LoanService {
  /**
   * Apply Loan
   */
  async applyLoan(data: ApplyLoanDTO) {
    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
      });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const interestRate =
      await this.calculateInterestRate(
        data.amount
      );

    const tenure =
      data.tenureMonths || 12;

    const emi =
      this.calculateEMI(
        data.amount,
        interestRate,
        tenure
      );

    return prisma.loanApplication.create({
      data: {
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        loanType: data.loanType,
        amount: data.amount,
        monthlyIncome:
          data.monthlyIncome,
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
  async getLoanById(
    loanId: string
  ) {
    return prisma.loanApplication.findUnique({
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
  async getUserLoans(
    userId: string
  ) {
    return prisma.loanApplication.findMany({
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
  async getAllLoans(
    page = 1,
    limit = 20,
    search = ""
  ) {
    const skip =
      (page - 1) * limit;

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

    const [loans, total] =
      await Promise.all([
        prisma.loanApplication.findMany({
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

        prisma.loanApplication.count({
          where,
        }),
      ]);

    return {
      loans,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Approve Loan
   */
  async approveLoan(
    loanId: string,
    approvedBy: string
  ) {
    const loan =
      await prisma.loanApplication.findUnique({
        where: {
          id: loanId,
        },
      });

    if (!loan) {
      throw new Error(
        "Loan not found"
      );
    }

    const updatedLoan =
      await prisma.loanApplication.update({
        where: {
          id: loanId,
        },
        data: {
          status: "approved",
          approvedAt: new Date(),
          approvedBy,
        },
      });

    await prisma.notification.create({
      data: {
        userId: loan.userId,
        title:
          "Loan Approved",
        message: `Your ₹${loan.amount} loan has been approved.`,
      },
    });

    return updatedLoan;
  }

  /**
   * Reject Loan
   */
  async rejectLoan(
    loanId: string,
    reason: string
  ) {
    const loan =
      await prisma.loanApplication.findUnique({
        where: {
          id: loanId,
        },
      });

    if (!loan) {
      throw new Error(
        "Loan not found"
      );
    }

    const updatedLoan =
      await prisma.loanApplication.update({
        where: {
          id: loanId,
        },
        data: {
          status: "rejected",
          rejectionReason:
            reason,
        },
      });

    await prisma.notification.create({
      data: {
        userId: loan.userId,
        title:
          "Loan Rejected",
        message: reason,
      },
    });

    return updatedLoan;
  }

  /**
   * Assign Loan To DSA
   */
  async assignLoan(
    loanId: string,
    dsaId: string
  ) {
    return prisma.loanApplication.update({
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
  async updateLoanStatus(
    loanId: string,
    status: LoanStatus
  ) {
    return prisma.loanApplication.update({
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
  async deleteLoan(
    loanId: string
  ) {
    return prisma.loanApplication.delete({
      where: {
        id: loanId,
      },
    });
  }

  /**
   * Loan Dashboard Stats
   */
  async getLoanStats() {
    const [
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalAmount,
    ] = await Promise.all([
      prisma.loanApplication.count(),

      prisma.loanApplication.count({
        where: {
          status:
            "approved",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status:
            "rejected",
        },
      }),

      prisma.loanApplication.count({
        where: {
          status:
            "pending",
        },
      }),

      prisma.loanApplication.aggregate({
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
      totalDisbursed:
        totalAmount._sum
          .amount || 0,
    };
  }

  /**
   * Monthly Loan Report
   */
  async monthlyReport() {
    const currentYear =
      new Date().getFullYear();

    return prisma.$queryRaw`
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
  calculateEMI(
    amount: number,
    interest: number,
    months: number
  ) {
    const r =
      interest / 12 / 100;

    return Math.round(
      (amount *
        r *
        Math.pow(
          1 + r,
          months
        )) /
        (Math.pow(
          1 + r,
          months
        ) -
          1)
    );
  }

  /**
   * Dynamic Interest
   */
  async calculateInterestRate(
    amount: number
  ) {
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
    return prisma.loanApplication.groupBy({
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

export default new LoanService();