import prisma from "../../config/database/prisma";

class CustomerService {
  async createCustomer(data: any) {
    return prisma.user.create({
      data,
    });
  }

  async getCustomers(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    return prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        loans: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCustomerById(customerId: string) {
    return prisma.user.findUnique({
      where: { id: customerId },
      include: {
        loans: true,
      },
    });
  }

  async getCustomerByUserId(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        loans: true,
      },
    });
  }

  async updateCustomer(customerId: string, data: any) {
    return prisma.user.update({
      where: { id: customerId },
      data,
    });
  }

  async deleteCustomer(customerId: string) {
    return prisma.user.delete({
      where: { id: customerId },
    });
  }

  async blockCustomer(customerId: string) {
    return prisma.user.update({
      where: { id: customerId },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblockCustomer(customerId: string) {
    return prisma.user.update({
      where: { id: customerId },
      data: {
        isBlocked: false,
      },
    });
  }

  async searchCustomers(search: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phoneNo: {
              contains: search,
            },
          },
        ],
      },
      include: {
        loans: true,
      },
    });
  }

  async getCustomerLoans(customerId: string) {
    return prisma.loanApplication.findMany({
      where: {
        userId: customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCustomerTransactions(customerId: string) {
    return {
      customerId,
      transactions: [],
    };
  }

  async getCustomerDocuments(customerId: string) {
    return {
      customerId,
      documents: [],
    };
  }

  async getCustomerKyc(customerId: string) {
    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
      },
    });

    return {
      customerId,
      isVerified: customer?.isVerified ?? false,
    };
  }

  async verifyCustomer(customerId: string) {
    return prisma.user.update({
      where: {
        id: customerId,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async getActiveCustomers() {
    return prisma.user.findMany({
      where: {
        isBlocked: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getInactiveCustomers() {
    return prisma.user.findMany({
      where: {
        isBlocked: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTopCustomers() {
    return prisma.user.findMany({
      take: 10,
      include: {
        loans: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMonthlyCustomers() {
    const currentMonth = new Date();
    currentMonth.setDate(1);

    return prisma.user.findMany({
      where: {
        createdAt: {
          gte: currentMonth,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCustomerProfile(customerId: string) {
    return prisma.user.findUnique({
      where: {
        id: customerId,
      },
      include: {
        loans: true,
      },
    });
  }

  async getCustomerDashboard(customerId: string) {
    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
      },
    });

    const totalLoans =
      await prisma.loanApplication.count({
        where: {
          userId: customerId,
        },
      });

    const approvedLoans =
      await prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "APPROVED",
        },
      });

    const pendingLoans =
      await prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "PENDING",
        },
      });

    const rejectedLoans =
      await prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "REJECTED",
        },
      });

    return {
      customer,
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    };
  }

  async getCustomerAnalytics() {
    const totalCustomers =
      await prisma.user.count();

    const activeCustomers =
      await prisma.user.count({
        where: {
          isBlocked: false,
        },
      });

    const blockedCustomers =
      await prisma.user.count({
        where: {
          isBlocked: true,
        },
      });

    const verifiedCustomers =
      await prisma.user.count({
        where: {
          isVerified: true,
        },
      });

    return {
      totalCustomers,
      activeCustomers,
      blockedCustomers,
      verifiedCustomers,
    };
  }

  async exportCustomersExcel() {
    const customers =
      await prisma.user.findMany();

    return {
      success: true,
      total: customers.length,
      data: customers,
    };
  }

  async exportCustomersPdf() {
    const customers =
      await prisma.user.findMany();

    return {
      success: true,
      total: customers.length,
      data: customers,
    };
  }
}

export const customerService =
  new CustomerService();