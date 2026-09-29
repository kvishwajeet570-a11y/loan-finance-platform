"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class InsuranceRepository {
    /* ==========================
        INSURANCE PRODUCTS
    ========================== */
    static async createInsurance(data) {
        return prisma_1.default.insurance.create({
            data,
        });
    }
    static async getInsuranceById(id) {
        return prisma_1.default.insurance.findUnique({
            where: { id },
            include: {
                applications: true,
                claims: true,
            },
        });
    }
    static async getInsuranceByPolicyNumber(policyNumber) {
        return prisma_1.default.insurance.findUnique({
            where: {
                policyNumber,
            },
        });
    }
    static async getAllInsurances(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma_1.default.insurance.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.insurance.count(),
        ]);
        return {
            total,
            page,
            limit,
            data,
        };
    }
    static async updateInsurance(id, data) {
        return prisma_1.default.insurance.update({
            where: { id },
            data,
        });
    }
    static async deleteInsurance(id) {
        return prisma_1.default.insurance.delete({
            where: { id },
        });
    }
    /* ==========================
        APPLICATIONS
    ========================== */
    static async createApplication(data) {
        return prisma_1.default.insuranceApplication.create({
            data: {
                ...data,
                status: "PENDING",
            },
        });
    }
    static async getApplicationById(applicationId) {
        return prisma_1.default.insuranceApplication.findUnique({
            where: {
                id: applicationId,
            },
            include: {
                user: true,
                insuranceRef: true,
                claims: true,
            },
        });
    }
    static async getUserApplications(userId) {
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
    static async approveApplication(applicationId) {
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
    static async rejectApplication(applicationId, reason) {
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
    /* ==========================
        CLAIMS
    ========================== */
    static async createClaim(data) {
        return prisma_1.default.insuranceClaim.create({
            data,
        });
    }
    static async getClaimById(claimId) {
        return prisma_1.default.insuranceClaim.findUnique({
            where: {
                id: claimId,
            },
            include: {
                application: true,
                insurance: true,
            },
        });
    }
    static async getApplicationClaims(applicationId) {
        return prisma_1.default.insuranceClaim.findMany({
            where: {
                applicationId,
            },
            include: {
                insurance: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async approveClaim(claimId) {
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
    static async rejectClaim(claimId, reason) {
        return prisma_1.default.insuranceClaim.update({
            where: {
                id: claimId,
            },
            data: {
                status: "REJECTED",
                rejectedAt: new Date(),
                rejectionReason: reason,
            },
        });
    }
    /* ==========================
        ANALYTICS
    ========================== */
    static async getAnalytics() {
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
}
exports.InsuranceRepository = InsuranceRepository;
exports.default = InsuranceRepository;
