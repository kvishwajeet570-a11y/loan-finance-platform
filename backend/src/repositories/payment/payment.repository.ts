import { prisma } from "../../prisma/prisma";

export class PaymentRepository {

  static async createPayment(data: {
    userId: string;
    paymentRef: string;
    paymentType: string;
    amount: number;
    gateway?: string;
    paymentMethod?: string;
  }) {
    return prisma.payment.create({
      data
    });
  }

  static async getById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  }

  static async getByReference(
    paymentRef: string
  ) {
    return prisma.payment.findUnique({
      where: {
        paymentRef
      }
    });
  }

  static async getUserPayments(
    userId: string
  ) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  static async markSuccess(
    paymentRef: string,
    gatewayTxnId: string,
    utrNumber?: string
  ) {

    return prisma.payment.update({

      where: {
        paymentRef
      },

      data: {
        status: "SUCCESS",
        gatewayTxnId,
        utrNumber,
        paidAt: new Date()
      }
    });
  }

  static async markFailed(
    paymentRef: string,
    remarks?: string
  ) {

    return prisma.payment.update({

      where: {
        paymentRef
      },

      data: {
        status: "FAILED",
        remarks
      }
    });
  }

  static async markPending(
    paymentRef: string
  ) {

    return prisma.payment.update({

      where: {
        paymentRef
      },

      data: {
        status: "PENDING"
      }
    });
  }

  static async processRefund(
    paymentId: string,
    refundAmount: number,
    refundReason: string
  ) {

    return prisma.payment.update({

      where: {
        id: paymentId
      },

      data: {
        status: "REFUNDED",
        refundAmount,
        refundReason,
        refundedAt: new Date()
      }
    });
  }

  static async updatePayment(
    id: string,
    data: Partial<{
      remarks: string;
      utrNumber: string;
      gatewayTxnId: string;
      paymentMethod: string;
    }>
  ) {

    return prisma.payment.update({
      where: { id },
      data
    });
  }

  static async getPaymentsByStatus(
    status: string
  ) {

    return prisma.payment.findMany({

      where: {
        status
      },

      include: {
        user: true
      }
    });
  }

  static async getPaymentsByType(
    paymentType: string
  ) {

    return prisma.payment.findMany({

      where: {
        paymentType
      },

      include: {
        user: true
      }
    });
  }

  static async searchPayments(
    keyword: string
  ) {

    return prisma.payment.findMany({

      where: {

        OR: [

          {
            paymentRef: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            gatewayTxnId: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            utrNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },

      include: {
        user: true
      }
    });
  }

  static async getAllPayments(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [payments, total] =
      await Promise.all([

        prisma.payment.findMany({
          skip,
          take: limit,
          include: {
            user: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.payment.count()
      ]);

    return {
      payments,
      total,
      page,
      limit
    };
  }

  static async getAnalytics() {

    const [
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      totalAmount
    ] = await Promise.all([

      prisma.payment.count(),

      prisma.payment.count({
        where: {
          status: "SUCCESS"
        }
      }),

      prisma.payment.count({
        where: {
          status: "FAILED"
        }
      }),

      prisma.payment.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.payment.aggregate({
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      totalAmount:
        totalAmount._sum.amount || 0
    };
  }

  static async getRevenueReport() {

    return prisma.payment.aggregate({

      where: {
        status: "SUCCESS"
      },

      _sum: {
        amount: true
      },

      _count: true,

      _avg: {
        amount: true
      }
    });
  }
}