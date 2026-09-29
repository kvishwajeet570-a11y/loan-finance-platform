import prisma from "../../prisma/prisma";

export interface CreateBankAccountDTO {
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  isPrimary?: boolean;
}

class BankService {
  async getBanks({
    page = 1,
    limit = 20,
    search = "",
    status = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          bankName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          accountHolderName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          ifscCode: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (status) {
      where.verificationStatus = status;
    }

    const [data, total] = await Promise.all([
      prisma.bankAccount.findMany({
        where,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.bankAccount.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBankById(id: string) {
    return prisma.bankAccount.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async createBank(data: CreateBankAccountDTO) {
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

  async updateBank(
    id: string,
    data: Partial<CreateBankAccountDTO>
  ) {
    if (data.isPrimary) {
      const account = await prisma.bankAccount.findUnique({
        where: { id },
      });

      if (account) {
        await prisma.bankAccount.updateMany({
          where: {
            userId: account.userId,
          },
          data: {
            isPrimary: false,
          },
        });
      }
    }

    return prisma.bankAccount.update({
      where: { id },
      data,
    });
  }

  async deleteBank(id: string) {
    return prisma.bankAccount.delete({
      where: { id },
    });
  }

  async verifyBankAccount(id: string) {
    return prisma.bankAccount.update({
      where: { id },
      data: {
        verificationStatus: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  }

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

  async getBankAnalytics() {
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
    // ========================================
  // GET USER BANK ACCOUNTS
  // ========================================
  async getUserBankAccounts(userId: string) {
    return prisma.bankAccount.findMany({
      where: {
        userId,
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
      orderBy: [
        {
          isPrimary: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }
}

export default new BankService();