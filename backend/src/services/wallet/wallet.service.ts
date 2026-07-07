import prisma from "../../prisma/prisma";

class WalletService {

  /**
   * Create Wallet
   */
  async createWallet(userId: string) {

    const wallet =
      await prisma.wallet.findUnique({
        where: { userId },
      });

    if (wallet) {
      return wallet;
    }

    return prisma.wallet.create({
      data: {
        userId,
        balance: 0,
      },
    });
  }

  /**
   * Get Wallet
   */
  async getWallet(userId: string) {

    return prisma.wallet.findUnique({
      where: { userId },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Credit Wallet
   */
  async creditWallet(
    userId: string,
    amount: number,
    remark: string,
    category = "WALLET"
  ) {

    return prisma.$transaction(
      async (tx) => {

        await tx.wallet.upsert({
          where: { userId },

          update: {
            balance: {
              increment: amount,
            },
          },

          create: {
            userId,
            balance: amount,
          },
        });

        await tx.transaction.create({
          data: {
            userId,
            amount,
            type: "CREDIT",
            category,
            remark,
            status: "SUCCESS",
          },
        });

        return tx.wallet.findUnique({
          where: { userId },
        });
      }
    );
  }

  /**
   * Debit Wallet
   */
  async debitWallet(
    userId: string,
    amount: number,
    remark: string,
    category = "WALLET"
  ) {

    return prisma.$transaction(
      async (tx) => {

        const wallet =
          await tx.wallet.findUnique({
            where: { userId },
          });

        if (!wallet) {
          throw new Error(
            "Wallet not found"
          );
        }

        if (
          wallet.balance < amount
        ) {
          throw new Error(
            "Insufficient wallet balance"
          );
        }

        await tx.wallet.update({
          where: { userId },

          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        await tx.transaction.create({
          data: {
            userId,
            amount,
            type: "DEBIT",
            category,
            remark,
            status: "SUCCESS",
          },
        });

        return tx.wallet.findUnique({
          where: { userId },
        });
      }
    );
  }

  /**
   * Transfer Wallet Balance
   */
  async transferBalance(
    senderId: string,
    receiverId: string,
    amount: number
  ) {

    return prisma.$transaction(
      async (tx) => {

        const sender =
          await tx.wallet.findUnique({
            where: {
              userId: senderId,
            },
          });

        if (!sender) {
          throw new Error(
            "Sender wallet not found"
          );
        }

        if (
          sender.balance < amount
        ) {
          throw new Error(
            "Insufficient balance"
          );
        }

        await tx.wallet.update({
          where: {
            userId: senderId,
          },

          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        await tx.wallet.upsert({
          where: {
            userId: receiverId,
          },

          update: {
            balance: {
              increment: amount,
            },
          },

          create: {
            userId: receiverId,
            balance: amount,
          },
        });

        await tx.transaction.createMany({
          data: [
            {
              userId: senderId,
              amount,
              type: "DEBIT",
              category: "TRANSFER",
              remark:
                "Wallet Transfer Sent",
              status: "SUCCESS",
            },

            {
              userId: receiverId,
              amount,
              type: "CREDIT",
              category: "TRANSFER",
              remark:
                "Wallet Transfer Received",
              status: "SUCCESS",
            },
          ],
        });

        return {
          success: true,
          amount,
        };
      }
    );
  }

  /**
   * Loan Disbursement
   */
  async loanDisbursement(
    userId: string,
    loanId: string,
    amount: number
  ) {

    return this.creditWallet(
      userId,
      amount,
      `Loan Disbursed #${loanId}`,
      "LOAN"
    );
  }

  /**
   * EMI Collection
   */
  async payEMI(
    userId: string,
    loanId: string,
    amount: number
  ) {

    return this.debitWallet(
      userId,
      amount,
      `EMI Payment #${loanId}`,
      "EMI"
    );
  }

  /**
   * Referral Bonus
   */
  async referralBonus(
    userId: string,
    amount: number
  ) {

    return this.creditWallet(
      userId,
      amount,
      "Referral Bonus",
      "REFERRAL"
    );
  }

  /**
   * Commission Credit
   */
  async commissionCredit(
    userId: string,
    amount: number
  ) {

    return this.creditWallet(
      userId,
      amount,
      "Commission Earned",
      "COMMISSION"
    );
  }

  /**
   * Recharge Debit
   */
  async rechargePayment(
    userId: string,
    amount: number
  ) {

    return this.debitWallet(
      userId,
      amount,
      "Recharge Payment",
      "RECHARGE"
    );
  }

  /**
   * Wallet Statement
   */
  async walletStatement(
    userId: string,
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [transactions, total] =
      await Promise.all([

        prisma.transaction.findMany({
          where: { userId },

          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.transaction.count({
          where: { userId },
        }),
      ]);

    return {
      transactions,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Wallet Analytics
   */
  async walletAnalytics() {

    const [
      totalWallets,
      totalBalance,
      activeWallets,
    ] = await Promise.all([

      prisma.wallet.count(),

      prisma.wallet.aggregate({
        _sum: {
          balance: true,
        },
      }),

      prisma.wallet.count({
        where: {
          balance: {
            gt: 0,
          },
        },
      }),
    ]);

    return {
      totalWallets,

      activeWallets,

      totalBalance:
        totalBalance._sum
          .balance || 0,
    };
  }

  /**
   * Top Wallet Holders
   */
  async topWalletUsers() {

    return prisma.wallet.findMany({
      take: 10,

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        balance: "desc",
      },
    });
  }

  /**
   * Recent Wallet Transactions
   */
  async recentTransactions() {

    return prisma.transaction.findMany({
      take: 20,

      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new WalletService();