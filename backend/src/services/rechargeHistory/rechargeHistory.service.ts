import { Recharge, RechargeHistory } from "@prisma/client";

import { RechargeHistoryRepository } from "../../repositories/rechargeHistory/rechargeHistory.repository";

import {
  CreateRechargeInput,
  SuccessRechargeInput,
  FailRechargeInput,
  HistoryFilters,
  AnalyticsFilters,
} from "../../repositories/rechargeHistory/rechargeHistory.repository";

export class RechargeHistoryService {
  private rechargeRepo: RechargeHistoryRepository;

  constructor() {
    this.rechargeRepo = new RechargeHistoryRepository();
  }

  /**
   * CREATE RECHARGE
   */
  async initiateRecharge(
    input: CreateRechargeInput
  ): Promise<Recharge> {
    return await this.rechargeRepo.createWithHistory(input);
  }

  /**
   * GET HISTORY
   */
  async getHistoricalLogs(
    filters: HistoryFilters
  ): Promise<{
    histories: RechargeHistory[];
    total: number;
  }> {
    const structuredFilters: HistoryFilters = {
      ...filters,
      page: filters.page > 0 ? filters.page : 1,
      limit:
        filters.limit > 0 && filters.limit <= 100
          ? filters.limit
          : 20,
    };

    return await this.rechargeRepo.findHistoryWithFilters(
      structuredFilters
    );
  }

  /**
   * SUCCESS
   */
  async processSuccess(
    rechargeId: string,
    input: SuccessRechargeInput
  ): Promise<Recharge> {
    const finalCommission =
      input.commissionAmount ?? 0;

    return await this.rechargeRepo.markAsSuccess(
      rechargeId,
      {
        ...input,
        commissionAmount: Number(finalCommission),
      }
    );
  }

  /**
   * FAILED
   */
  async processFailure(
    rechargeId: string,
    input: FailRechargeInput
  ): Promise<Recharge> {
    return await this.rechargeRepo.markAsFailed(
      rechargeId,
      input
    );
  }

 /**
 * ANALYTICS
 */
async getPerformanceAnalytics(
  filters: AnalyticsFilters
) {
  const metrics =
    await this.rechargeRepo.aggregateMetrics(filters);

  return {
    summary: {
      totalTransactions:
        metrics.totalVolume._count.id,
      grossVolume:
        metrics.totalVolume._sum.amount ?? 0,
      totalCommission:
        metrics.totalVolume._sum.commissionAmount ?? 0,
    },

    statusBreakdown: {
      success: metrics.totalSuccess,
      failed: metrics.totalFailed,
      pending: metrics.totalPending,
    },

    operatorPerformance: [],
  };
}
}