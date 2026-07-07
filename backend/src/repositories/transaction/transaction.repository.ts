import { prisma } from "../../prisma";

export class TransactionRepository {

  /* =========================
      CREATE TRANSACTION
  ========================= */

  static async createTransaction(data: {
    userId: string;
    transactionRef: string;
    transactionType: string;
    amount: number;
    openingBalance?: number;
    closingBalance?: number;
    paymentMethod?: string;
    gateway?: string;
    referenceId?: string;
    referenceType?: string;
    remarks?: string;
    metadata?: any;
  }) {

    return prisma.transaction.create({
      data
    });
  }

  /* =========================
      GET BY ID
  ========================= */

  static async getById(id: string) {

    return prisma.transaction.findUnique({

      where: { id },

      include: {
        user: true
      }
    });
  }

  /* =========================
      GET BY REF
  ========================= */

  static async getByReference(
    transactionRef: string
  ) {

    return prisma.transaction.findUnique({

      where: {
        transactionRef
      }
    });
  }

  /* =========================
      USER TRANSACTIONS
  ========================= */

  static async getUserTransactions(
    userId: string,
    page = 1,
    limit = 20
  ) {

    return prisma.transaction.findMany({

      where: {
        userId
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      SUCCESS
  ========================= */

  static async markSuccess(
    transactionRef: string,
    gatewayTxnId?: string,
    utrNumber?: string
  ) {

    return prisma.transaction.update({

      where: {
        transactionRef
      },

      data: {
        status: "SUCCESS",
        gatewayTxnId,
        utrNumber,
        processedAt: new Date()
      }
    });
  }

  /* =========================
      FAILED
  ========================= */

  static async markFailed(
    transactionRef: string,
    remarks?: string
  ) {

    return prisma.transaction.update({

      where: {
        transactionRef
      },

      data: {
        status: "FAILED",
        remarks,
        processedAt: new Date()
      }
    });
  }

  /* =========================
      CANCEL
  ========================= */

  static async cancelTransaction(
    transactionRef: string,
    remarks?: string
  ) {

    return prisma.transaction.update({

      where: {
        transactionRef
      },

      data: {
        status: "CANCELLED",
        remarks
      }
    });
  }

  /* =========================
      REFUND
  ========================= */

  static async refundTransaction(
    transactionRef: string,
    remarks?: string
  ) {

    return prisma.transaction.update({

      where: {
        transactionRef
      },

      data: {
        status: "REFUNDED",
        remarks,
        processedAt: new Date()
      }
    });
  }

  /* =========================
      SEARCH
  ========================= */

  static async searchTransactions(
    keyword: string
  ) {

    return prisma.transaction.findMany({

      where: {

        OR: [

          {
            transactionRef: {
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

  /* =========================
      STATUS FILTER
  ========================= */

  static async getByStatus(
    status: string
  ) {

    return prisma.transaction.findMany({

      where: {
        status
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      TYPE FILTER
  ========================= */

  static async getByType(
    transactionType: string
  ) {

    return prisma.transaction.findMany({

      where: {
        transactionType
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      DATE RANGE
  ========================= */

  static async getByDateRange(
    startDate: Date,
    endDate: Date
  ) {

    return prisma.transaction.findMany({

      where: {

        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      ALL TRANSACTIONS
  ========================= */

  static async getAllTransactions(
    page = 1,
    limit = 50
  ) {

    const skip =
      (page - 1) * limit;

    const [transactions, total] =
      await Promise.all([

        prisma.transaction.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.transaction.count()
      ]);

    return {
      transactions,
      total,
      page,
      limit
    };
  }

  /* =========================
      ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalTransactions,
      successTransactions,
      failedTransactions,
      totalAmount
    ] = await Promise.all([

      prisma.transaction.count(),

      prisma.transaction.count({
        where: {
          status: "SUCCESS"
        }
      }),

      prisma.transaction.count({
        where: {
          status: "FAILED"
        }
      }),

      prisma.transaction.aggregate({
        _sum: {
          amount: true
        }
      })
    ]);

    return {
      totalTransactions,
      successTransactions,
      failedTransactions,
      totalAmount:
        totalAmount._sum.amount || 0
    };
  }

  /* =========================
      DASHBOARD
  ========================= */

  static async getDashboard() {

    const [
      analytics,
      recentTransactions
    ] = await Promise.all([

      this.getAnalytics(),

      prisma.transaction.findMany({

        take: 20,

        include: {
          user: true
        },

        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return {
      analytics,
      recentTransactions
    };
  }
}