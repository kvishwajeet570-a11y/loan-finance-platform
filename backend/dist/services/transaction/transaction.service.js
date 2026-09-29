"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_repository_1 = __importDefault(require("../../repositories/transaction/transaction.repository"));
class TransactionService {
    // ==========================================================
    // CREATE
    // ==========================================================
    async create(data) {
        return transaction_repository_1.default.create(data);
    }
    // ==========================================================
    // GET
    // ==========================================================
    async getById(id) {
        return transaction_repository_1.default.findById(id);
    }
    async getByTransactionId(transactionId) {
        return transaction_repository_1.default.findByTransactionId(transactionId);
    }
    async getByReferenceId(referenceId) {
        return transaction_repository_1.default.findByReferenceId(referenceId);
    }
    async getAll(where = {}, page = 1, limit = 20) {
        return transaction_repository_1.default.findMany(where, page, limit);
    }
    // ==========================================================
    // UPDATE
    // ==========================================================
    async update(id, data) {
        return transaction_repository_1.default.update(id, data);
    }
    // ==========================================================
    // DELETE
    // ==========================================================
    async delete(id) {
        return transaction_repository_1.default.delete(id);
    }
    async bulkDelete(ids) {
        return transaction_repository_1.default.deleteMany(ids);
    }
    // ==========================================================
    // STATUS ACTIONS
    // ==========================================================
    async approve(id, approvedBy) {
        return transaction_repository_1.default.update(id, {
            status: "success",
            isApproved: true,
            approvedBy,
            approvedAt: new Date(),
        });
    }
    async verify(id, verifiedBy) {
        return transaction_repository_1.default.update(id, {
            isVerified: true,
            verifiedBy,
            verifiedAt: new Date(),
        });
    }
    async reject(id, rejectedBy, rejectReason) {
        return transaction_repository_1.default.update(id, {
            status: "failed",
            rejectedBy,
            rejectedAt: new Date(),
            rejectReason,
        });
    }
    async refund(id, refundAmount, refundReason, refundedBy) {
        return transaction_repository_1.default.update(id, {
            status: "refunded",
            isRefunded: true,
            refundAmount,
            refundReason,
            refundedBy,
            refundedAt: new Date(),
        });
    }
    async process(id) {
        return transaction_repository_1.default.update(id, {
            status: "processing",
        });
    }
    // ==========================================================
    // BULK
    // ==========================================================
    async bulkApprove(ids, approvedBy) {
        return transaction_repository_1.default.updateMany(ids, {
            status: "success",
            isApproved: true,
            approvedBy,
            approvedAt: new Date(),
        });
    }
    async bulkReject(ids, rejectedBy, rejectReason) {
        return transaction_repository_1.default.updateMany(ids, {
            status: "failed",
            rejectedBy,
            rejectedAt: new Date(),
            rejectReason,
        });
    }
    async bulkRefund(ids, refundedBy) {
        return transaction_repository_1.default.updateMany(ids, {
            status: "refunded",
            isRefunded: true,
            refundedBy,
            refundedAt: new Date(),
        });
    }
    // ==========================================================
    // REPORTS
    // ==========================================================
    async dashboard() {
        return transaction_repository_1.default.dashboard();
    }
    async analytics() {
        return transaction_repository_1.default.groupByStatus();
    }
    async statistics() {
        return transaction_repository_1.default.aggregate();
    }
    // ==========================================================
    // SEARCH
    // ==========================================================
    async search(where, page = 1, limit = 20) {
        return transaction_repository_1.default.findMany(where, page, limit);
    }
    // ==========================================================
    // COUNT
    // ==========================================================
    async count(where = {}) {
        return transaction_repository_1.default.count(where);
    }
}
exports.default = new TransactionService();
