import prisma from "../../prisma/prisma";

class DashboardService {
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

    const totalDisbursed = await prisma.loanApplication.aggregate({
      where: {
        status: "approved",
      },
      _sum: {
        amount: true,
      },
    });

    return {
      totalUsers,
      totalLoans,
      approvedLoans,
      rejectedLoans,
      pendingLoans,
      totalDisbursed:
        Number(totalDisbursed._sum.amount) || 0,
    };
  }

  async getRecentLoans(limit = 10) {
    return prisma.loanApplication.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        loanType: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async getRecentUsers(limit = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

export default new DashboardService();