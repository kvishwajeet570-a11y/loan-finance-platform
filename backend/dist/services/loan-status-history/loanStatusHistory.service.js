"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoanStatusHistoryService {
    async getByLoanId(loanId) {
        return [];
    }
    async create(data) {
        return {
            id: "temp-id",
            ...data,
            createdAt: new Date(),
        };
    }
    async updateLoanStatus(data) {
        return {
            success: true,
            ...data,
            updatedAt: new Date(),
        };
    }
    async getAnalytics() {
        return {
            totalChanges: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
        };
    }
}
exports.default = new LoanStatusHistoryService();
