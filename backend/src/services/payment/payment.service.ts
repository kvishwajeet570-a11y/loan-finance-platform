import prisma from "../../prisma/prisma";

interface CreatePaymentDTO {
  userId: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  referenceId?: string;
}

class PaymentService {
  /**
   * Create Payment
   */
  async createPayment(
    data: CreatePaymentDTO
  ) {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        paymentMethod:
          data.paymentMethod,
        purpose: data.purpose,
        referenceId:
          data.referenceId,
        status: "PENDING",
      },
    });
  }

  /**
   * Verify Payment
   */
  async verifyPayment(
    paymentId: string,
    gatewayTxnId: string
  ) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        status: "SUCCESS",
        transactionId:
          gatewayTxnId,
        paidAt: new Date(),
      },
    });
  }

  /**
   * Failed Payment
   */
  async failPayment(
    paymentId: string,
    reason: string
  ) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        status: "FAILED",
        failureReason:
          reason,
      },
    });
  }

  /**
   * Refund Payment
   */
  async refundPayment(
    paymentId: string,
    refundAmount: number
  ) {
    const payment =
      await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

    if (!payment) {
      throw new Error(
        "Payment not found"
      );
    }

    return prisma.payment.update({
      where: {
        id: paymentId,
      },

      data: {
        status: "REFUNDED",
        refundAmount,
        refundedAt:
          new Date(),
      },
    });
  }

  /**
   * Loan EMI Payment
   */
  async payEMI(
    loanId: string,
    amount: number,
    userId: string
  ) {
    const payment =
      await prisma.payment.create({
        data: {
          userId,
          amount,
          purpose:
            "LOAN_EMI",
          referenceId:
            loanId,
          status:
            "SUCCESS",
          paidAt:
            new Date(),
        },
      });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "DEBIT",
        remark:
          "Loan EMI Payment",
      },
    });

    return payment;
  }

  /**
   * Wallet Recharge
   */
  async walletRecharge(
    userId: string,
    amount: number
  ) {
    const wallet =
      await prisma.wallet.findUnique({
        where: {
          userId,
        },
      });

    if (!wallet) {
      throw new Error(
        "Wallet not found"
      );
    }

    await prisma.wallet.update({
      where: {
        userId,
      },

      data: {
        balance: {
          increment:
            amount,
        },
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "CREDIT",
        remark:
          "Wallet Recharge",
      },
    });

    return {
      success: true,
      amount,
    };
  }

  /**
   * Commission Payout
   */
  async commissionPayout(
    userId: string,
    amount: number
  ) {
    await prisma.wallet.update({
      where: {
        userId,
      },

      data: {
        balance: {
          increment:
            amount,
        },
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type: "CREDIT",
        remark:
          "Commission Payout",
      },
    });

    return {
      success: true,
    };
  }

  /**
   * Payment History
   */
  async getPaymentHistory(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const skip =
      (page - 1) * limit;

    const [payments, total] =
      await Promise.all([
        prisma.payment.findMany({
          where: {
            userId,
          },

          skip,
          take: limit,

          orderBy: {
            createdAt:
              "desc",
          },
        }),

        prisma.payment.count({
          where: {
            userId,
          },
        }),
      ]);

    return {
      payments,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Payment By ID
   */
  async getPaymentById(
    paymentId: string
  ) {
    return prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        user: true,
      },
    });
  }

  /**
   * Admin Analytics
   */
  async getPaymentAnalytics() {
    const [
      totalPayments,
      successPayments,
      failedPayments,
      totalRevenue,
    ] = await Promise.all([
      prisma.payment.count(),

      prisma.payment.count({
        where: {
          status:
            "SUCCESS",
        },
      }),

      prisma.payment.count({
        where: {
          status:
            "FAILED",
        },
      }),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },

        where: {
          status:
            "SUCCESS",
        },
      }),
    ]);

    return {
      totalPayments,

      successPayments,

      failedPayments,

      revenue:
        totalRevenue._sum
          .amount || 0,
    };
  }

  /**
   * Daily Collection Report
   */
  async dailyCollection() {
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return prisma.payment.aggregate({
      where: {
        status: "SUCCESS",

        createdAt: {
          gte: today,
        },
      },

      _sum: {
        amount: true,
      },
    });
  }

  /**
   * Monthly Revenue Report
   */
  async monthlyRevenue() {
    const currentYear =
      new Date().getFullYear();

    return prisma.$queryRaw`
      SELECT
      EXTRACT(MONTH FROM "createdAt") AS month,
      COUNT(*) AS total_payments,
      SUM(amount) AS revenue
      FROM "Payment"
      WHERE status='SUCCESS'
      AND EXTRACT(YEAR FROM "createdAt")=${currentYear}
      GROUP BY month
      ORDER BY month ASC
    `;
  }

  /**
   * Top Paying Customers
   */
  async topCustomers() {
    return prisma.payment.groupBy({
      by: ["userId"],

      where: {
        status: "SUCCESS",
      },

      _sum: {
        amount: true,
      },

      orderBy: {
        _sum: {
          amount:
            "desc",
        },
      },

      take: 10,
    });
  }
}

export default new PaymentService();