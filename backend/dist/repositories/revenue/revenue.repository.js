"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class RevenueRepository {
    /**
     * =========================================
     * CREATE REVENUE
     * =========================================
     */
    async createRevenue(data) {
        return prisma_1.default.revenue.create({
            data,
            include: {
                user: true,
                loan: true,
                partner: true,
                payment: true,
            },
        });
    }
    /**
     * =========================================
     * CREATE MANY
     * =========================================
     */
    async createManyRevenue(data) {
        return prisma_1.default.revenue.createMany({
            data,
            skipDuplicates: true,
        });
    }
    /**
     * =========================================
     * FIND BY ID
     * =========================================
     */
    async findById(id) {
        return prisma_1.default.revenue.findUnique({
            where: { id },
            include: {
                user: true,
                loan: true,
                partner: true,
                payment: true,
            },
        });
    }
    /**
     * =========================================
     * FIND BY TRANSACTION REF
     * =========================================
     */
    async findByTransactionReference(transactionReference) {
        return prisma_1.default.revenue.findFirst({
            where: {
                transactionReference,
            },
            include: {
                user: true,
                loan: true,
                partner: true,
                payment: true,
            },
        });
    }
    /**
     * =========================================
     * UPDATE
     * =========================================
     */
    async updateRevenue(id, data) {
        return prisma_1.default.revenue.update({
            where: { id },
            data,
            include: {
                user: true,
                loan: true,
                partner: true,
                payment: true,
            },
        });
    }
    /**
     * =========================================
     * UPDATE STATUS
     * =========================================
     */
    async updateStatus(id, status) {
        return prisma_1.default.revenue.update({
            where: { id },
            data: {
                status,
            },
        });
    }
    /**
     * =========================================
     * SETTLEMENT
     * =========================================
     */
    async settleRevenue(id, settlementReference, remarks) {
        return prisma_1.default.revenue.update({
            where: { id },
            data: {
                status: "SETTLED",
                settlementReference,
                settlementDate: new Date(),
                remarks,
            },
        });
    }
    /**
     * =========================================
     * DELETE
     * =========================================
     */
    async deleteRevenue(id) {
        return prisma_1.default.revenue.delete({
            where: {
                id,
            },
        });
    }
    /**
     * =========================================
     * EXISTS
     * =========================================
     */
    async exists(id) {
        const revenue = await prisma_1.default.revenue.findUnique({
            where: { id },
            select: {
                id: true,
            },
        });
        return !!revenue;
    }
    /**
     * =========================================
     * COUNT
     * =========================================
     */
    async count(where) {
        return prisma_1.default.revenue.count({
            where,
        });
    }
    buildWhere(filters) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.source) {
            where.source = filters.source;
        }
        if (filters.revenueType) {
            where.revenueType = filters.revenueType;
        }
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.loanId) {
            where.loanId = filters.loanId;
        }
        if (filters.partnerId) {
            where.partnerId = filters.partnerId;
        }
        if (filters.paymentId) {
            where.paymentId = filters.paymentId;
        }
        if (filters.startDate ||
            filters.endDate) {
            where.revenueDate = {};
            if (filters.startDate) {
                where.revenueDate.gte =
                    filters.startDate;
            }
            if (filters.endDate) {
                where.revenueDate.lte =
                    filters.endDate;
            }
        }
        if (filters.minAmount !== undefined ||
            filters.maxAmount !== undefined) {
            where.amount = {};
            if (filters.minAmount !== undefined) {
                where.amount.gte =
                    filters.minAmount;
            }
            if (filters.maxAmount !== undefined) {
                where.amount.lte =
                    filters.maxAmount;
            }
        }
        if (filters.search &&
            filters.search.trim() !== "") {
            where.OR = [
                {
                    transactionReference: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
                {
                    source: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
                {
                    revenueType: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
                {
                    remarks: {
                        contains: filters.search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        return where;
    }
    /**
     * =========================================
     * GET ALL REVENUE
     * =========================================
     */
    async getAllRevenue(filters = {}) {
        const page = filters.page && filters.page > 0
            ? filters.page
            : 1;
        const limit = filters.limit && filters.limit > 0
            ? filters.limit
            : 10;
        const skip = (page - 1) * limit;
        const where = this.buildWhere(filters);
        const orderBy = {
            [filters.sortBy ??
                "createdAt"]: filters.sortOrder ??
                "desc",
        };
        const [data, total,] = await prisma_1.default.$transaction([
            prisma_1.default.revenue.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    loan: {
                        select: {
                            id: true,
                            loanType: true,
                            amount: true,
                            status: true,
                        },
                    },
                    partner: {
                        select: {
                            id: true,
                            companyName: true,
                            email: true,
                        },
                    },
                    payment: {
                        select: {
                            id: true,
                            amount: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma_1.default.revenue.count({
                where,
            }),
        ]);
        return {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }
    /**
     * =========================================
     * GET BY USER
     * =========================================
     */
    async getRevenueByUser(userId) {
        return prisma_1.default.revenue.findMany({
            where: {
                userId,
            },
            include: {
                loan: true,
                partner: true,
                payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * =========================================
     * GET BY PARTNER
     * =========================================
     */
    async getRevenueByPartner(partnerId) {
        return prisma_1.default.revenue.findMany({
            where: {
                partnerId,
            },
            include: {
                user: true,
                payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * =========================================
     * GET BY LOAN
     * =========================================
     */
    async getRevenueByLoan(loanId) {
        return prisma_1.default.revenue.findMany({
            where: {
                loanId,
            },
            include: {
                user: true,
                partner: true,
                payment: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * =========================================
     * GET BY PAYMENT
     * =========================================
     */
    async getRevenueByPayment(paymentId) {
        return prisma_1.default.revenue.findMany({
            where: {
                paymentId,
            },
            include: {
                user: true,
                partner: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
const revenueRepository = new RevenueRepository();
exports.default = revenueRepository;
