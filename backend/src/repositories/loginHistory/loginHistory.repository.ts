import prisma from "../../prisma/prisma";

export class LoginHistoryRepository {

  async create(data: {
    userId: string;
    ipAddress?: string;
    deviceInfo?: string;
  }) {
    return prisma.loginHistory.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        deviceInfo: data.deviceInfo,
      },
    });
  }

  async getByUserId(userId: string) {
    return prisma.loginHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getLastLogin(userId: string) {
    return prisma.loginHistory.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteOldHistory(days: number) {

    const date = new Date();
    date.setDate(date.getDate() - days);

    return prisma.loginHistory.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });

  }

}

export default new LoginHistoryRepository();