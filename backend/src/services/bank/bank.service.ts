import prisma from "../../prisma/prisma";

interface CreateBankAccountDTO {
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  isPrimary?: boolean;
}

class BankService {
  /**
   * Add Bank Account
   */
  async addBankAccount(data: CreateBankAccountDTO) {
    const existing = await prisma.bankAccount.findFirst({
      where: {
        userId: data.userId,
        accountNumber: data.accountNumber,
      },
    });

    if (existing) {
      throw new Error("Bank account already exists");
    }

    if (data.isPrimary) {
      await prisma.bankAccount.updateMany({
        where: {
          userId: data.userId,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return prisma.bankAccount.create({
      data: {
        ...data,
        verificationStatus: "PENDING",
      },
    });
  }

  /**
   * Get User Banks
   */
  async getUserBankAccounts(userId: string) {
    return prisma.bankAccount.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get Single Bank
   */
  async getBankAccountById(id: string) {
    return prisma.bankAccount.findUnique({
      where: { id },
    });
  }

  /**
   * Verify Bank
   */
  async verifyBankAccount(id: string) {
    return prisma.bankAccount.update({
      where: { id },
      data: {
        verificationStatus: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  }

  /**
   * Reject Bank
   */
  async rejectBankAccount(
    id: string,
    reason: string
  ) {
    return prisma.bankAccount.update({
      where: { id },
      data: {
        verificationStatus: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /**
   * Set Primary Account
   */
  async setPrimaryAccount(
    userId: string,
    bankId: string
  ) {
    await prisma.bankAccount.updateMany({
      where: { userId },
      data: {
        isPrimary: false,
      },
    });

    return prisma.bankAccount.update({
      where: { id: bankId },
      data: {
        isPrimary: true,
      },
    });
  }

  /**
   * Delete Bank
   */
  async deleteBankAccount(id: string) {
    return prisma.bankAccount.delete({
      where: { id },
    });
  }

  /**
   * Admin Pending Verification
   */
  async getPendingVerificationAccounts() {
    return prisma.bankAccount.findMany({
      where: {
        verificationStatus: "PENDING",
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * Search Accounts
   */
  async searchAccounts(keyword: string) {
    return prisma.bankAccount.findMany({
      where: {
        OR: [
          {
            bankName: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            accountHolderName: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            ifscCode: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }

  /**
   * Bank Statistics
   */
  async getBankStats() {
    const [
      totalAccounts,
      verifiedAccounts,
      pendingAccounts,
      rejectedAccounts,
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
    ]);

    return {
      totalAccounts,
      verifiedAccounts,
      pendingAccounts,
      rejectedAccounts,
    };
  }
}

export default new BankService();