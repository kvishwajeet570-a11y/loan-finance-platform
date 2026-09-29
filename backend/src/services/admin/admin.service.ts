import prisma from "../../prisma/prisma";

class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
    ] = await Promise.all([
      prisma.user.count(),
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
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
    };
  }

  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAllLoans() {
    return prisma.loanApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        loans: true,
      },
    });
  }

  async blockUser(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblockUser(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: false,
      },
    });
  }

  async verifyUser(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async getLoanById(loanId: string) {
    return prisma.loanApplication.findUnique({
      where: {
        id: loanId,
      },
      include: {
        user: true,
      },
    });
  }

  async updateLoanAmount(
    loanId: string,
    amount: number
  ) {
    if (!Number.isFinite(amount)) {
      throw new Error("Invalid loan amount.");
    }

    if (amount <= 0) {
      throw new Error(
        "Loan amount must be greater than zero."
      );
    }

    return prisma.loanApplication.update({
      where: {
        id: loanId,
      },
      data: {
        amount,
      },
    });
  }

  async approveLoan(
    loanId: string,
    adminId: string,
    amount?: number
  ) {
    if (
      amount !== undefined &&
      (!Number.isFinite(amount) || amount <= 0)
    ) {
      throw new Error(
        "Loan amount must be greater than zero."
      );
    }

    const existingLoan =
      await prisma.loanApplication.findUnique({
        where: {
          id: loanId,
        },
      });

    if (!existingLoan) {
      throw new Error("Loan application not found.");
    }

    const finalAmount =
      amount !== undefined
        ? amount
        : existingLoan.amount;

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      throw new Error(
        "A valid loan amount greater than zero is required before approval."
      );
    }

    return prisma.loanApplication.update({
      where: {
        id: loanId,
      },
      data: {
        amount: finalAmount,
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: adminId,
        rejectionReason: null,
      },
    });
  }

  async rejectLoan(
    loanId: string,
    rejectionReason?: string
  ) {
    const existingLoan =
      await prisma.loanApplication.findUnique({
        where: {
          id: loanId,
        },
      });

    if (!existingLoan) {
      throw new Error("Loan application not found.");
    }

    const reason =
      String(rejectionReason || "").trim();

    return prisma.loanApplication.update({
      where: {
        id: loanId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason || null,
        approvedAt: null,
        approvedBy: null,
      },
    });
  }
}

export default new AdminService();
