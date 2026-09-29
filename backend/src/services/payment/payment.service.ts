import prisma from "../../config/database/prisma";

interface CreatePaymentDTO {
  userId: string;
  amount: number;
  paymentMethod?: string;
  purpose: string;
  referenceId?: string;
  loanApplicationId?: string;
}

class PaymentService {
  /* ========================================
     CREATE PAYMENT
  ======================================== */

  async createPayment(
    data: CreatePaymentDTO
  ) {
    return prisma.payment.create({
      data: {
        paymentId: `PAY-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`,

        userId: data.userId,

        loanApplicationId:
          data.loanApplicationId,

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

  /* ========================================
     GET ALL PAYMENTS
  ======================================== */

  async getAllPayments(
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
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /* ========================================
     GET PAYMENT BY ID
  ======================================== */

  async getPaymentById(
    paymentId: string
  ) {
    return prisma.payment.findUnique({
      where: {
        id: paymentId,
      },

      include: {
        user: true,
        loanApplication: true,
      },
    });
  }

  /* ========================================
     UPDATE PAYMENT
  ======================================== */

  async updatePayment(
    paymentId: string,
    data: Record<string, any>
  ) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },

      data,
    });
  }

  /* ========================================
     DELETE PAYMENT
  ======================================== */

  async deletePayment(
    paymentId: string
  ) {
    return prisma.payment.delete({
      where: {
        id: paymentId,
      },
    });
  }

  /* ========================================
     VERIFY PAYMENT
  ======================================== */

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

  /* ========================================
     FAIL PAYMENT
  ======================================== */

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

  /* ========================================
     REFUND PAYMENT
  ======================================== */

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

  /* ========================================
     EMI PAYMENT
  ======================================== */

  async payEMI(
    loanId: string,
    amount: number,
    userId: string
  ) {
    const payment =
      await prisma.payment.create({
        data: {
          paymentId: `EMI-${Date.now()}`,

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
  transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
  userId,
  amount,
  type: "DEBIT",
  category: "EMI",
  remark: "Loan EMI Payment",
}
    });

    return payment;
  }

  /* ========================================
     WALLET RECHARGE
  ======================================== */

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
    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    userId,
    amount,
    type: "CREDIT",
    category: "WALLET",
    remark: "Wallet Recharge",
    status: "SUCCESS",
  },
});

    return {
      success: true,
      amount,
    };
  }

  /* ========================================
     COMMISSION PAYOUT
  ======================================== */

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
    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    userId,
    amount,
    type: "CREDIT",
    category: "COMMISSION",
    remark: "Commission Payout",
    status: "SUCCESS",
  },
});

    return {
      success: true,
    };
  }

  /* ========================================
     USER PAYMENTS
  ======================================== */

  async getUserPayments(
    userId: string
  ) {
    return prisma.payment.findMany({
      where: {
        userId,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ========================================
     LOAN PAYMENTS
  ======================================== */

  async getLoanPayments(
    loanId: string
  ) {
    return prisma.payment.findMany({
      where: {
        loanApplicationId:
          loanId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ========================================
     PENDING PAYMENTS
  ======================================== */

  async getPendingPayments() {
    return prisma.payment.findMany({
      where: {
        status: "PENDING",
      },
    });
  }

  async getSuccessPayments() {
    return prisma.payment.findMany({
      where: {
        status: "SUCCESS",
      },
    });
  }

  async getFailedPayments() {
    return prisma.payment.findMany({
      where: {
        status: "FAILED",
      },
    });
  }

  async getRefundedPayments() {
    return prisma.payment.findMany({
      where: {
        status: "REFUNDED",
      },
    });
  }

  /* ========================================
     ANALYTICS
  ======================================== */

  async getPaymentAnalytics() {
    const [
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      refundedPayments,
      totalRevenue,
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

        where: {
          status: "SUCCESS",
        },
      }),
    ]);

    return {
      totalPayments,
      successPayments,
      failedPayments,
      pendingPayments,
      refundedPayments,

      revenue:
        totalRevenue._sum
          .amount || 0,
    };
  }

  /* ========================================
     DAILY COLLECTION
  ======================================== */

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

  /* ========================================
     MONTHLY REPORT
  ======================================== */

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

  /* ========================================
     TOP CUSTOMERS
  ======================================== */

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