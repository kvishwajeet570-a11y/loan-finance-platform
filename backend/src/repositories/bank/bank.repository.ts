import prisma from "../../prisma/prisma";

export class BankRepository {
  /* =========================
     CREATE BANK ACCOUNT
  ========================= */

  static async createBankAccount(data: {
    userId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
  }) {
    return prisma.bankAccount.create({
      data: {
        userId: data.userId,
        accountHolderName: data.accountHolderName,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        branchName: data.branchName,
      },
    });
  }

  /* =========================
     GET USER BANKS
  ========================= */

  static async getUserBankAccounts(
    userId: string
  ) {
    return prisma.bankAccount.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
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
        id: bankId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
          },
        },
      },
    });
  }

  /* =========================
     VERIFY BANK ACCOUNT
  ========================= */

  static async verifyBankAccount(
    bankId: string
  ) {
    return prisma.bankAccount.update({
      where: {
        id: bankId,
      },
      data: {
        verificationStatus: "VERIFIED",
        rejectionReason: null,
        verifiedAt: new Date(),
      },
    });
  }

  /* =========================
     REJECT BANK ACCOUNT
  ========================= */

  static async rejectBankAccount(
    bankId: string,
    reason: string
  ) {
    return prisma.bankAccount.update({
      where: {
        id: bankId,
      },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason,
        verifiedAt: null,
      },
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
        userId,
      },
      data: {
        isPrimary: false,
      },
    });

    return prisma.bankAccount.update({
      where: {
        id: bankId,
      },
      data: {
        isPrimary: true,
      },
    });
  }

  /* =========================
     UPDATE BANK ACCOUNT
  ========================= */

  static async updateBankAccount(
    bankId: string,
    data: Partial<{
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      branchName: string;
    }>
  ) {
    return prisma.bankAccount.update({
      where: {
        id: bankId,
      },
      data,
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
        id: bankId,
      },
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
            accountHolderName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            bankName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            accountNumber: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================
     ADMIN ALL BANKS
  ========================= */

  static async getAllBankAccounts(
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [accounts, total] =
      await Promise.all([
        prisma.bankAccount.findMany({
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),

        prisma.bankAccount.count(),
      ]);

    return {
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
      accounts,
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
      rejectedAccounts,
      primaryAccounts,
    ] = await Promise.all([
      prisma.bankAccount.count(),

      prisma.bankAccount.count({
        where: {
          verificationStatus: "VERIFIED",
        },
      }),

      prisma.bankAccount.count({
        where: {
          verificationStatus: "PENDING",
        },
      }),

      prisma.bankAccount.count({
        where: {
          verificationStatus: "REJECTED",
        },
      }),

      prisma.bankAccount.count({
        where: {
          isPrimary: true,
        },
      }),
    ]);

    return {
      totalAccounts,
      verifiedAccounts,
      pendingAccounts,
      rejectedAccounts,
      primaryAccounts,
    };
  }
}