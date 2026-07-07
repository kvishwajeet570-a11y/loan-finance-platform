import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isVerified?: boolean;
}

class CustomerService {
  /**
   * Create Customer
   */
  async createCustomer(data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
  }) {
    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email },
            { phoneNo: data.phoneNo },
          ],
        },
      });

    if (existingUser) {
      throw new Error(
        "Customer already exists"
      );
    }

    return prisma.user.create({
      data: {
        ...data,
        role: "customer",
      },
    });
  }

  /**
   * Customer Profile
   */
  async getCustomerProfile(
    customerId: string
  ) {
    return prisma.user.findUnique({
      where: {
        id: customerId,
      },
      include: {
        loans: true,
      },
    });
  }

  /**
   * Update Customer
   */
  async updateCustomer(
    customerId: string,
    data: any
  ) {
    return prisma.user.update({
      where: {
        id: customerId,
      },
      data,
    });
  }

  /**
   * Customer List
   */
  async getCustomers(
    filters: CustomerFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      isVerified,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput =
      {
        role: "customer",
      };

    if (search) {
      where.OR = [
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
      ];
    }

    if (typeof isVerified === "boolean") {
      where.isVerified = isVerified;
    }

    if (status === "blocked") {
      where.isBlocked = true;
    }

    const [customers, total] =
      await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.user.count({
          where,
        }),
      ]);

    return {
      customers,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Block Customer
   */
  async blockCustomer(
    customerId: string
  ) {
    return prisma.user.update({
      where: {
        id: customerId,
      },
      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Unblock Customer
   */
  async unblockCustomer(
    customerId: string
  ) {
    return prisma.user.update({
      where: {
        id: customerId,
      },
      data: {
        isBlocked: false,
      },
    });
  }

  /**
   * Customer Loan History
   */
  async getCustomerLoans(
    customerId: string
  ) {
    return prisma.loanApplication.findMany({
      where: {
        userId: customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Customer Dashboard
   */
  async getCustomerDashboard(
    customerId: string
  ) {
    const [
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    ] = await Promise.all([
      prisma.loanApplication.count({
        where: {
          userId: customerId,
        },
      }),

      prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "approved",
        },
      }),

      prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "pending",
        },
      }),

      prisma.loanApplication.count({
        where: {
          userId: customerId,
          status: "rejected",
        },
      }),
    ]);

    return {
      totalLoans,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
    };
  }

  /**
   * Customer Analytics
   */
  async getCustomerStats() {
    const [
      totalCustomers,
      verifiedCustomers,
      blockedCustomers,
      activeCustomers,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "customer",
        },
      }),

      prisma.user.count({
        where: {
          role: "customer",
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          role: "customer",
          isBlocked: true,
        },
      }),

      prisma.user.count({
        where: {
          role: "customer",
          isBlocked: false,
        },
      }),
    ]);

    return {
      totalCustomers,
      verifiedCustomers,
      blockedCustomers,
      activeCustomers,
    };
  }

  /**
   * Delete Customer
   */
  async deleteCustomer(
    customerId: string
  ) {
    return prisma.user.delete({
      where: {
        id: customerId,
      },
    });
  }
}

export default new CustomerService();