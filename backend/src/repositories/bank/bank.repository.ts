import { prisma } from "../../prisma/prisma";

export class BankRepository {

  /* =========================
      CREATE BANK ACCOUNT
  ========================= */

  static async createBankAccount(data: {
    userId: string;
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
  }) {

    return prisma.bankAccount.create({
      data
    });
  }

  /* =========================
      GET USER BANKS
  ========================= */

  static async getUserBankAccounts(
    userId: string
  ) {

    return prisma.bankAccount.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      GET BANK BY ID
  ========================= */

  static async getBankById(
    bankId: string
  ) {

    return prisma.bankAccount.findUnique({
      where: {
        id: bankId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      }
    });
  }

  /* =========================
      VERIFY BANK ACCOUNT
  ========================= */

  static async verifyBankAccount(
    bankId: string,
    pennyDropRef?: string
  ) {

    return prisma.bankAccount.update({
      where: {
        id: bankId
      },
      data: {
        isVerified: true,
        pennyDropRef
      }
    });
  }

  /* =========================
      SET PRIMARY ACCOUNT
  ========================= */

  static async setPrimaryAccount(
    userId: string,
    bankId: string
  ) {

    await prisma.bankAccount.updateMany({
      where: {
        userId
      },
      data: {
        isPrimary: false
      }
    });

    return prisma.bankAccount.update({
      where: {
        id: bankId
      },
      data: {
        isPrimary: true
      }
    });
  }

  /* =========================
      UPDATE BANK ACCOUNT
  ========================= */

  static async updateBankAccount(
    bankId: string,
    data: Partial<{
      accountHolder: string;
      bankName: string;
      ifscCode: string;
      branchName: string;
    }>
  ) {

    return prisma.bankAccount.update({
      where: {
        id: bankId
      },
      data
    });
  }

  /* =========================
      DELETE ACCOUNT
  ========================= */

  static async deleteBankAccount(
    bankId: string
  ) {

    return prisma.bankAccount.delete({
      where: {
        id: bankId
      }
    });
  }

  /* =========================
      SEARCH ACCOUNT
  ========================= */

  static async searchAccounts(
    search: string
  ) {

    return prisma.bankAccount.findMany({
      where: {
        OR: [
          {
            accountHolder: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            bankName: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            accountNumber: {
              contains: search
            }
          }
        ]
      }
    });
  }

  /* =========================
      ADMIN ALL BANKS
  ========================= */

  static async getAllBankAccounts(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [accounts, total] =
      await Promise.all([

        prisma.bankAccount.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }),

        prisma.bankAccount.count()
      ]);

    return {
      total,
      page,
      limit,
      accounts
    };
  }

  /* =========================
      BANK ANALYTICS
  ========================= */

  static async getBankAnalytics() {

    const [
      totalAccounts,
      verifiedAccounts,
      pendingAccounts,
      primaryAccounts
    ] = await Promise.all([

      prisma.bankAccount.count(),

      prisma.bankAccount.count({
        where: {
          isVerified: true
        }
      }),

      prisma.bankAccount.count({
        where: {
          isVerified: false
        }
      }),

      prisma.bankAccount.count({
        where: {
          isPrimary: true
        }
      })
    ]);

    return {
      totalAccounts,
      verifiedAccounts,
      pendingAccounts,
      primaryAccounts
    };
  }
}