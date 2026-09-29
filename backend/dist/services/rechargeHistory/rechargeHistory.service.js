"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RechargeHistoryService = void 0;
const rechargeHistory_repository_1 = require("../../repositories/rechargeHistory/rechargeHistory.repository");
class RechargeHistoryService {
    constructor() {
        this.rechargeRepo = new rechargeHistory_repository_1.RechargeHistoryRepository();
    }
    /**
     * CREATE RECHARGE
     */
    async initiateRecharge(input) {
        return await this.rechargeRepo.createWithHistory(input);
    }
    /**
     * GET HISTORY
     */
    async getHistoricalLogs(filters) {
        const structuredFilters = {
            ...filters,
            page: filters.page > 0 ? filters.page : 1,
            limit: filters.limit > 0 && filters.limit <= 100
                ? filters.limit
                : 20,
        };
        return await this.rechargeRepo.findHistoryWithFilters(structuredFilters);
    }
    /**
     * SUCCESS
     */
    async processSuccess(rechargeId, input) {
        const finalCommission = input.commissionAmount ?? 0;
        return await this.rechargeRepo.markAsSuccess(rechargeId, {
            ...input,
            commissionAmount: Number(finalCommission),
        });
    }
    /**
     * FAILED
     */
    async processFailure(rechargeId, input) {
        return await this.rechargeRepo.markAsFailed(rechargeId, input);
    }
    /**
    * ANALYTICS
    */
    async getPerformanceAnalytics(filters) {
        const metrics = await this.rechargeRepo.aggregateMetrics(filters);
        return {
            summary: {
                totalTransactions: metrics.totalVolume._count.id,
                grossVolume: metrics.totalVolume._sum.amount ?? 0,
                totalCommission: metrics.totalVolume._sum.commissionAmount ?? 0,
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
exports.RechargeHistoryService = RechargeHistoryService;
