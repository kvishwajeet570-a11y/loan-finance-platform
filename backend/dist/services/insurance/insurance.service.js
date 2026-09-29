"use strict";
// src/services/insurance/insurance.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insuranceService = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class InsuranceService {
    async createInsurance(data) {
        return prisma_1.default.insurance.create({
            data: {
                ...data,
            },
        });
    }
    async getInsurances(filters) {
        const { page = 1, limit = 10, search, type, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    policyNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (type) {
            where.type = type;
        }
        const [items, total] = await Promise.all([
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
            data: items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getInsuranceById(id) {
        return prisma_1.default.insurance.findUnique({
            where: {
                id,
            },
            include: {
                applications: true,
                claims: true,
            },
        });
    }
    async updateInsurance(id, data) {
        return prisma_1.default.insurance.update({
            where: {
                id,
            },
            data,
        });
    }
    async deleteInsurance(id) {
        return prisma_1.default.insurance.delete({
            where: {
                id,
            },
        });
    }
    async applyInsurance(userId, insuranceId, amount) {
        const policy = await prisma_1.default.insurance.findUnique({
            where: {
                id: insuranceId,
            },
        });
        if (!policy) {
            throw new Error("Insurance policy not found");
        }
        return prisma_1.default.insuranceApplication.create({
            data: {
                applicationNo: `APP-${Date.now()}`,
                insuranceType: policy.type,
                amount,
                userId,
                insuranceId,
                status: "PENDING",
            },
        });
    }
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
    async rejectInsurance(applicationId, reason) {
        return prisma_1.default.insuranceApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                status: "REJECTED",
                rejectedAt: new Date(),
                rejectionReason: reason,
            },
        });
    }
    async getUserPolicies(userId) {
        return prisma_1.default.insuranceApplication.findMany({
            where: {
                userId,
            },
            include: {
                insuranceRef: true,
                claims: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async createClaim(data) {
        return prisma_1.default.insuranceClaim.create({
            data: {
                claimNo: `CLM-${Date.now()}`,
                ...data,
            },
        });
    }
    async getPolicyClaims(applicationId) {
        return prisma_1.default.insuranceClaim.findMany({
            where: {
                applicationId,
            },
            include: {
                insurance: true,
                application: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async approveClaim(claimId) {
        return prisma_1.default.insuranceClaim.update({
            where: {
                id: claimId,
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });
    }
    async rejectClaim(claimId, reason) {
        return prisma_1.default.insuranceClaim.update({
            where: {
                id: claimId,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
                rejectedAt: new Date(),
            },
        });
    }
    async getInsuranceStats() {
        const [totalPolicies, totalApplications, approvedApplications, rejectedApplications, pendingApplications, totalClaims, approvedClaims, rejectedClaims,] = await Promise.all([
            prisma_1.default.insurance.count(),
            prisma_1.default.insuranceApplication.count(),
            prisma_1.default.insuranceApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.insuranceApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.insuranceApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.insuranceClaim.count(),
            prisma_1.default.insuranceClaim.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.insuranceClaim.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        return {
            totalPolicies,
            totalApplications,
            approvedApplications,
            rejectedApplications,
            pendingApplications,
            totalClaims,
            approvedClaims,
            rejectedClaims,
        };
    }
    async getInsuranceAnalytics() {
        return this.getInsuranceStats();
    }
}
exports.insuranceService = new InsuranceService();
exports.default = exports.insuranceService;
