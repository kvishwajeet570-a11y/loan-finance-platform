"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class TransactionRepository {
    // ==========================================================
    // CREATE
    // ==========================================================
    async create(data) {
        return prisma_1.default.transaction.create({
            data,
            include: {
                user: true,
                wallet: true,
            },
        });
    }
    // ==========================================================
    // FIND UNIQUE
    // ==========================================================
    async findById(id) {
        return prisma_1.default.transaction.findFirst({
            where: {
                OR: [
                    { id },
                    { transactionId: id },
                    { referenceId: id },
                ],
            },
            include: {
                user: true,
                wallet: true,
            },
        });
    }
    async findByTransactionId(transactionId) {
        return prisma_1.default.transaction.findUnique({
            where: {
                transactionId,
            },
            include: {
                user: true,
                wallet: true,
            },
        });
    }
    async findByReferenceId(referenceId) {
        return prisma_1.default.transaction.findUnique({
            where: {
                referenceId,
            },
            include: {
                user: true,
                wallet: true,
            },
        });
    }
    // ==========================================================
    // FIND MANY
    // ==========================================================
    async findMany(where = {}, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await prisma_1.default.$transaction([
            prisma_1.default.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: true,
                    wallet: true,
                },
            }),
            prisma_1.default.transaction.count({
                where,
            }),
        ]);
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data,
        };
    }
    // ==========================================================
    // UPDATE
    // ==========================================================
    async update(id, data) {
        return prisma_1.default.transaction.update({
            where: {
                id,
            },
            data,
            include: {
                user: true,
                wallet: true,
            },
        });
    }
    // ==========================================================
    // DELETE
    // ==========================================================
    async delete(id) {
        return prisma_1.default.transaction.delete({
            where: {
                id,
            },
        });
    }
    async deleteMany(ids) {
        return prisma_1.default.transaction.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
    // ==========================================================
    // COUNT
    // ==========================================================
    async count(where = {}) {
        return prisma_1.default.transaction.count({
            where,
        });
    }
    // ==========================================================
    // AGGREGATE
    // ==========================================================
    async aggregate(where = {}) {
        return prisma_1.default.transaction.aggregate({
            where,
            _count: true,
            _sum: {
                amount: true,
                fee: true,
                gst: true,
                commission: true,
                cashback: true,
            },
            _avg: {
                amount: true,
            },
            _min: {
                amount: true,
            },
            _max: {
                amount: true,
            },
        });
    }
    // ==========================================================
    // GROUP BY STATUS
    // ==========================================================
    async groupByStatus() {
        return prisma_1.default.transaction.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
            _sum: {
                amount: true,
            },
        });
    }
    // ==========================================================
    // BULK UPDATE
    // ==========================================================
    async updateMany(ids, data) {
        return prisma_1.default.transaction.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data,
        });
    }
    // ==========================================================
    // DASHBOARD
    // ==========================================================
    async dashboard() {
        return prisma_1.default.$transaction([
            prisma_1.default.transaction.count(),
            prisma_1.default.transaction.aggregate({
                _sum: {
                    amount: true,
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    status: "pending",
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    status: "success",
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    status: "failed",
                },
            }),
            prisma_1.default.transaction.count({
                where: {
                    isRefunded: true,
                },
            }),
            prisma_1.default.transaction.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: true,
                    wallet: true,
                },
            }),
        ]);
    }
}
exports.default = new TransactionRepository();
