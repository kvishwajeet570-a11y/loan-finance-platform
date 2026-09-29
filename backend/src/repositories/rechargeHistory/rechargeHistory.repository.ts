import {
  Prisma,
  Recharge,
  RechargeHistory,
  RechargeStatus,
  RechargeType,
} from "@prisma/client";
import prisma from "../../prisma/prisma";

/* =========================================
   TYPES
========================================= */

export interface CreateRechargeInput {
  userId: string;
  mobileNumber: string;
  operator: string;
  rechargeType: RechargeType;
  amount: number;
  planDetails?: string;
  serviceType?: string;
  ipAddress?: string | null;
  deviceInfo?: string | null;
}

export interface SuccessRechargeInput {
  transactionId: string;
  operatorTxnId?: string;
  commissionAmount?: number;
  apiProvider?: string;
  apiRequest?: Prisma.InputJsonValue;
  apiResponse?: Prisma.InputJsonValue;
  updatedBy?: string;
}

export interface FailRechargeInput {
  failureReason: string;
  remarks?: string;
  apiResponse?: Prisma.InputJsonValue;
  updatedBy?: string;
}

export interface HistoryFilters {
  status?: RechargeStatus;
  userId?: string;
  operator?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  operator?: string;
}

/* =========================================
   REPOSITORY
========================================= */

export class RechargeHistoryRepository {
  /**
   * CREATE RECHARGE + HISTORY
   */
  async createWithHistory(
    input: CreateRechargeInput
  ): Promise<Recharge> {
    return await prisma.$transaction(async (tx) => {
      const recharge = await tx.recharge.create({
        data: {
          userId: input.userId,
          mobileNumber: input.mobileNumber,
          operator: input.operator,
          rechargeType: input.rechargeType,
          amount: input.amount,
          planDetails: input.planDetails,
          serviceType: input.serviceType,
          ipAddress: input.ipAddress,
          deviceInfo: input.deviceInfo,
          status: RechargeStatus.PENDING,
        },
      });

      await tx.rechargeHistory.create({
        data: {
          rechargeId: recharge.id,
          userId: input.userId,

          mobileNumber: recharge.mobileNumber,
          operator: recharge.operator,
          rechargeType: recharge.rechargeType,

          amount: recharge.amount,
          planDetails: recharge.planDetails,

          previousStatus: null,
          currentStatus: RechargeStatus.PENDING,

          action: "RECHARGE_CREATED",

          serviceType: recharge.serviceType,
          ipAddress: recharge.ipAddress,
          deviceInfo: recharge.deviceInfo,

          remarks: "Recharge request created",
        },
      });

      return recharge;
    });
  }
  /**
   * GET HISTORY WITH FILTERS
   */
  async findHistoryWithFilters(
    filters: HistoryFilters
  ): Promise<{
    histories: RechargeHistory[];
    total: number;
  }> {
    const where: Prisma.RechargeHistoryWhereInput = {};

    if (filters.status) {
      where.currentStatus = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.operator) {
      where.operator = {
        equals: filters.operator,
        mode: "insensitive",
      };
    }

    if (filters.search) {
      where.OR = [
        {
          mobileNumber: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          transactionRef: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          operatorTxnId: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};

      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [histories, total] = await prisma.$transaction([
      prisma.rechargeHistory.findMany({
        where,
        include: {
          recharge: true,
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

      prisma.rechargeHistory.count({
        where,
      }),
    ]);

    return {
      histories,
      total,
    };
  }

  /**
   * MARK RECHARGE SUCCESS
   */
  async markAsSuccess(
    rechargeId: string,
    input: SuccessRechargeInput
  ): Promise<Recharge> {
    return await prisma.$transaction(async (tx) => {
      const recharge = await tx.recharge.findUnique({
        where: {
          id: rechargeId,
        },
      });

      if (!recharge) {
        throw new Error("Recharge not found");
      }

      const updatedRecharge =
        await tx.recharge.update({
          where: {
            id: rechargeId,
          },
          data: {
            status: RechargeStatus.SUCCESS,
            transactionRef: input.transactionId,
            operatorTxnId: input.operatorTxnId,
            commissionAmount:
              input.commissionAmount ?? 0,
            processedAt: new Date(),
            completedAt: new Date(),
          },
        });

      await tx.rechargeHistory.create({
        data: {
          rechargeId: updatedRecharge.id,
          userId: updatedRecharge.userId,

          mobileNumber:
            updatedRecharge.mobileNumber,

          operator: updatedRecharge.operator,

          rechargeType:
            updatedRecharge.rechargeType,

          amount: updatedRecharge.amount,

          planDetails:
            updatedRecharge.planDetails,

          previousStatus:
            recharge.status,

          currentStatus:
            RechargeStatus.SUCCESS,

          transactionRef:
            input.transactionId,

          operatorTxnId:
            input.operatorTxnId,

          commissionAmount:
            input.commissionAmount ?? 0,

          action: "RECHARGE_SUCCESS",

          apiProvider:
            input.apiProvider,

          apiRequest:
            input.apiRequest,

          apiResponse:
            input.apiResponse,

          serviceType:
            updatedRecharge.serviceType,

          ipAddress:
            updatedRecharge.ipAddress,

          deviceInfo:
            updatedRecharge.deviceInfo,

          updatedBy:
            input.updatedBy,

          remarks:
            "Recharge completed successfully",
        },
      });

      return updatedRecharge;
    });
  }
    /**
   * MARK RECHARGE FAILED
   */
  async markAsFailed(
    rechargeId: string,
    input: FailRechargeInput
  ): Promise<Recharge> {
    return await prisma.$transaction(async (tx) => {
      const recharge = await tx.recharge.findUnique({
        where: {
          id: rechargeId,
        },
      });

      if (!recharge) {
        throw new Error("Recharge not found");
      }

      const updatedRecharge =
        await tx.recharge.update({
          where: {
            id: rechargeId,
          },
          data: {
            status: RechargeStatus.FAILED,
            failureReason: input.failureReason,
            remarks: input.remarks,
            processedAt: new Date(),
          },
        });

      await tx.rechargeHistory.create({
        data: {
          rechargeId: updatedRecharge.id,
          userId: updatedRecharge.userId,

          mobileNumber:
            updatedRecharge.mobileNumber,

          operator:
            updatedRecharge.operator,

          rechargeType:
            updatedRecharge.rechargeType,

          amount:
            updatedRecharge.amount,

          planDetails:
            updatedRecharge.planDetails,

          previousStatus:
            recharge.status,

          currentStatus:
            RechargeStatus.FAILED,

          transactionRef:
            updatedRecharge.transactionRef,

          operatorTxnId:
            updatedRecharge.operatorTxnId,

          failureReason:
            input.failureReason,

          remarks:
            input.remarks,

          action: "RECHARGE_FAILED",

          apiResponse:
            input.apiResponse,

          serviceType:
            updatedRecharge.serviceType,

          ipAddress:
            updatedRecharge.ipAddress,

          deviceInfo:
            updatedRecharge.deviceInfo,

          updatedBy:
            input.updatedBy,
        },
      });

      return updatedRecharge;
    });
  }

  /**
   * ANALYTICS
   */
  async aggregateMetrics(
    filters: AnalyticsFilters
  ) {
    const rechargeWhere: Prisma.RechargeWhereInput = {};
    const historyWhere: Prisma.RechargeHistoryWhereInput = {};

    if (filters.operator) {
      rechargeWhere.operator = filters.operator;
    }

    if (filters.startDate || filters.endDate) {
      historyWhere.createdAt = {};

      if (filters.startDate) {
        historyWhere.createdAt.gte = new Date(filters.startDate);
      }

      if (filters.endDate) {
        historyWhere.createdAt.lte = new Date(filters.endDate);
      }
    }

    const [
  totalVolume,
  totalSuccess,
  totalFailed,
  totalPending,
] = await prisma.$transaction([
  prisma.recharge.aggregate({
    where: rechargeWhere,
    _count: {
      id: true,
    },
    _sum: {
      amount: true,
      commissionAmount: true,
    },
  }),

  prisma.recharge.count({
    where: {
      ...rechargeWhere,
      status: RechargeStatus.SUCCESS,
    },
  }),

  prisma.recharge.count({
    where: {
      ...rechargeWhere,
      status: RechargeStatus.FAILED,
    },
  }),

  prisma.recharge.count({
    where: {
      ...rechargeWhere,
      status: RechargeStatus.PENDING,
    },
  }),
]);
    return {
      totalVolume,
      totalSuccess,
      totalFailed,
      totalPending,
    };
  }
}