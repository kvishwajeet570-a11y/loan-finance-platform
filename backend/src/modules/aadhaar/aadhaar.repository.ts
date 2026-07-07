import prisma from "../../prisma/prisma";

export class AiRepository {
  
  static async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
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

  static async getLoanHistory(userId: string) {
    return prisma.loanApplication.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getLatestLoan(userId: string) {
    return prisma.loanApplication.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getUserAnalytics(userId: string) {
    const totalLoans = await prisma.loanApplication.count({
      where: { userId },
    });

    const approvedLoans = await prisma.loanApplication.count({
      where: {
        userId,
        status: "approved",
      },
    });

    const rejectedLoans = await prisma.loanApplication.count({
      where: {
        userId,
        status: "rejected",
      },
    });

    return {
      totalLoans,
      approvedLoans,
      rejectedLoans,
    };
  }

  static async getAiContext(userId: string) {
    const user = await this.getUserProfile(userId);

    const loans = await this.getLoanHistory(userId);

    const analytics = await this.getUserAnalytics(userId);

    return {
      user,
      loans,
      analytics,
    };
  }
}