import prisma from "../../prisma/prisma";

class LoanService {
  async getAllLoans() {
    return prisma.loanApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getLoanById(id: string) {
    return prisma.loanApplication.findUnique({
      where: { id },
    });
  }

  async approveLoan(id: string) {
    return prisma.loanApplication.update({
      where: { id },
      data: {
        status: "approved",
      },
    });
  }

  async rejectLoan(id: string) {
    return prisma.loanApplication.update({
      where: { id },
      data: {
        status: "rejected",
      },
    });
  }

  async getLoanStats() {
    const [
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
    ] = await Promise.all([
      prisma.loanApplication.count(),
      prisma.loanApplication.count({
        where: { status: "approved" },
      }),
      prisma.loanApplication.count({
        where: { status: "rejected" },
      }),
      prisma.loanApplication.count({
        where: { status: "pending" },
      }),
    ]);

    return {
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
    };
  }
}

export default new LoanService();