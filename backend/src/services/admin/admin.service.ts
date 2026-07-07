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
}

export default new AdminService();