import prisma from "../../prisma/prisma";

export class PaymentRepository {

  static async createPayment(data: {
    paymentId: string;
    userId: string;
    amount: number;
    purpose: string;
    paymentMethod?: string;
    gateway?: string;
    loanApplicationId?: string;
  }) {
    return prisma.payment.create({
      data,
    });
  }

  static async getById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        loanApplication: true,
      },
    });
  }

  static async getByPaymentId(paymentId: string) {
    return prisma.payment.findUnique({
      where: {
        paymentId,
      },
      include: {
        user: true,
        loanApplication: true,
      },
    });
  }

  static async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        loanApplication: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async markSuccess(
    paymentId: string,
    gatewayPaymentId?: string,
    referenceId?: string
  ) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: {
        status: "SUCCESS",
        gatewayPaymentId,
        referenceId,
        paidAt: new Date(),
      },
    });
  }

  static async markFailed(
    paymentId: string,
    reason?: string
  ) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: {
        status: "FAILED",
        failureReason: reason,
      },
    });
  }

  static async markPending(paymentId: string) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: {
        status: "PENDING",
      },
    });
  }

  static async processRefund(
    paymentId: string,
    refundAmount: number
  ) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: {
        status: "REFUNDED",
        refundAmount,
        refundedAt: new Date(),
      },
    });
  }

  static async verifyPayment(
    paymentId: string,
    verifiedBy: string
  ) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: {
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
  }

  static async updatePayment(
    id: string,
    data: {
      remarks?: string;
      paymentMethod?: string;
      gateway?: string;
      transactionId?: string;
      referenceId?: string;
      gatewayPaymentId?: string;
    }
  ) {
    return prisma.payment.update({
      where: { id },
      data,
    });
  }

  static async getPaymentsByStatus(status: string) {
    return prisma.payment.findMany({
      where: { status },
      include: {
        user: true,
        loanApplication: true,
      },
    });
  }

  static async getPaymentsByPurpose(purpose: string) {
    return prisma.payment.findMany({
      where: { purpose },
      include: {
        user: true,
        loanApplication: true,
      },
    });
  }

  static async searchPayments(keyword: string) {
    return prisma.payment.findMany({
      where: {
        OR: [
          {
            paymentId: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            transactionId: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            referenceId: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            gatewayPaymentId: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
  }

  static async getAllPayments(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          loanApplication: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.payment.count(),
    ]);

    return {
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async deletePayment(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }

  static async getAnalytics() {
    const [
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      refundedPayments,
      totalAmount,
    ] = await Promise.all([
      prisma.payment.count(),

      prisma.payment.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.payment.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.payment.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.payment.count({
        where: {
          status: "REFUNDED",
        },
      }),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      refundedPayments,
      totalAmount:
        totalAmount._sum.amount || 0,
    };
  }

  static async getRevenueReport() {
    return prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
      },

      _sum: {
        amount: true,
      },

      _avg: {
        amount: true,
      },

      _count: {
        _all: true,
      },
    });
  }
}