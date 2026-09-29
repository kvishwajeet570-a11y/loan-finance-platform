import prisma from "../../prisma/prisma";

class LoanStatusHistoryService {
  async getByLoanId(loanId: string) {
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanId },
      select: {
        id: true,
        status: true,
        remarks: true,
        updatedAt: true,
      },
    });

    return loan ? [loan] : [];
  }

  async create(data: {
    loanId: string;
    status: string;
    remarks?: string;
    changedBy?: string;
  }) {
    const status = String(data.status).toUpperCase();

    const updatedLoan = await prisma.loanApplication.update({
      where: { id: data.loanId },
      data: {
        status: status as any,
        ...(data.remarks !== undefined
          ? { remarks: data.remarks }
          : {}),
        ...(status === "APPROVED"
          ? {
              approvedAt: new Date(),
              approvedBy: data.changedBy || null,
            }
          : {}),
      },
    });

    return updatedLoan;
  }

  async updateLoanStatus(data: {
    loanId: string;
    status: string;
    remarks?: string;
    changedBy?: string;
  }) {
    const status = String(data.status).toUpperCase();

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "DISBURSED",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid loan status");
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id: data.loanId },
      data: {
        status: status as any,
        ...(data.remarks !== undefined
          ? { remarks: data.remarks }
          : {}),
        ...(status === "APPROVED"
          ? {
              approvedAt: new Date(),
              approvedBy: data.changedBy || null,
            }
          : {}),
      },
    });

    return updatedLoan;
  }

  async getAnalytics() {
    const [totalChanges, approved, rejected, pending] =
      await Promise.all([
        prisma.loanApplication.count(),
        prisma.loanApplication.count({
          where: { status: "APPROVED" },
        }),
        prisma.loanApplication.count({
          where: { status: "REJECTED" },
        }),
        prisma.loanApplication.count({
          where: { status: "PENDING" },
        }),
      ]);

    return {
      totalChanges,
      approved,
      rejected,
      pending,
    };
  }
}

export default new LoanStatusHistoryService();

