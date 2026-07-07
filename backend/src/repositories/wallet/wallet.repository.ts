import prisma from "../../prisma/prisma";

export class WalletRepository {

  async createWallet(userId: string) {
    return prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        cashback: 0,
        rewardBalance: 0,
        totalEarnings: 0,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.wallet.findUnique({
      where: {
        userId,
      },
      include: {
        transactions: true,
        walletHistory: true,
      },
    });
  }

  async findByWalletId(walletId: string) {
    return prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
  }

  async updateBalance(
    walletId: string,
    amount: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: amount,
      },
    });
  }

  async addBalance(
    walletId: string,
    amount: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async deductBalance(
    walletId: string,
    amount: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
  }

  async updateCashback(
    walletId: string,
    cashback: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        cashback: {
          increment: cashback,
        },
      },
    });
  }

  async updateRewardBalance(
    walletId: string,
    reward: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        rewardBalance: {
          increment: reward,
        },
      },
    });
  }

  async updateTotalEarnings(
    walletId: string,
    amount: number
  ) {
    return prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        totalEarnings: {
          increment: amount,
        },
      },
    });
  }

}

export default new WalletRepository();