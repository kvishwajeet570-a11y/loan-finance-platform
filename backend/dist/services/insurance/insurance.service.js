"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class InsuranceService {
    /**
     * Create Insurance Product
     */
    async createInsurance(data) {
        return prisma_1.default.insurance.create({
            data,
        });
    }
    /**
     * Update Insurance
     */
    async updateInsurance(id, data) {
        return prisma_1.default.insurance.update({
            where: { id },
            data,
        });
    }
    /**
     * Delete Insurance
     */
    async deleteInsurance(id) {
        return prisma_1.default.insurance.delete({
            where: { id },
        });
    }
    /**
     * Insurance Details
     */
    async getInsuranceById(id) {
        return prisma_1.default.insurance.findUnique({
            where: { id },
        });
    }
    /**
     * Insurance List
     */
    async getInsurances(filters) {
        const { page = 1, limit = 20, search, category, company, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    company: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (company) {
            where.company = company;
        }
        const [products, total] = await Promise.all([
            prisma_1.default.insurance.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.insurance.count({
                where,
            }),
        ]);
        return {
            products,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Apply Insurance
     */
    async applyInsurance(userId, insuranceId) {
        return prisma_1.default.insuranceApplication.create({
            data: {
                userId,
                insuranceId,
                status: "PENDING",
            },
        });
    }
    /**
     * Approve Insurance
     */
    async approveInsurance(applicationId) {
        return prisma_1.default.insuranceApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });
    }
    /**
     * Reject Insurance
     */
    async rejectInsurance(applicationId, reason) {
        return prisma_1.default.insuranceApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * User Policies
     */
    async getUserPolicies(userId) {
        return prisma_1.default.insuranceApplication.findMany({
            where: {
                userId,
            },
            include: {
                insurance: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Dashboard Stats
     */
    async getInsuranceStats() {
        const [totalProducts, totalPolicies, approvedPolicies, pendingPolicies,] = await Promise.all([
            prisma_1.default.insurance.count(),
            prisma_1.default.insuranceApplication.count(),
            prisma_1.default.insuranceApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.insuranceApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
        ]);
        return {
            totalProducts,
            totalPolicies,
            approvedPolicies,
            pendingPolicies,
        };
    }
}
exports.default = new InsuranceService();
