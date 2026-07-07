"use strict";
// src/services/insurance.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const prisma_1 = require("../config/prisma");
class InsuranceService {
    /* ========================================
       CREATE POLICY
    ======================================== */
    static async createPolicy(payload) {
        return prisma_1.prisma.insurancePolicy.create({
            data: {
                customerId: payload.customerId,
                policyType: payload.policyType,
                providerName: payload.providerName,
                policyNumber: payload.policyNumber,
                premiumAmount: payload.premiumAmount,
                sumInsured: payload.sumInsured,
                startDate: payload.startDate,
                endDate: payload.endDate,
                status: "ACTIVE",
            },
        });
    }
    /* ========================================
       GET POLICY BY ID
    ======================================== */
    static async getPolicyById(id) {
        return prisma_1.prisma.insurancePolicy.findUnique({
            where: { id },
        });
    }
    /* ========================================
       GET CUSTOMER POLICIES
    ======================================== */
    static async getCustomerPolicies(customerId) {
        return prisma_1.prisma.insurancePolicy.findMany({
            where: { customerId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       GET ALL POLICIES
    ======================================== */
    static async getAllPolicies() {
        return prisma_1.prisma.insurancePolicy.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       RENEW POLICY
    ======================================== */
    static async renewPolicy(policyId, endDate) {
        return prisma_1.prisma.insurancePolicy.update({
            where: { id: policyId },
            data: {
                endDate,
                status: "ACTIVE",
            },
        });
    }
    /* ========================================
       EXPIRE POLICY
    ======================================== */
    static async expirePolicy(policyId) {
        return prisma_1.prisma.insurancePolicy.update({
            where: { id: policyId },
            data: {
                status: "EXPIRED",
            },
        });
    }
    /* ========================================
       CREATE CLAIM
    ======================================== */
    static async createClaim(policyId, claimAmount, reason) {
        return prisma_1.prisma.insuranceClaim.create({
            data: {
                policyId,
                claimAmount,
                reason,
                status: "PENDING",
            },
        });
    }
    /* ========================================
       APPROVE CLAIM
    ======================================== */
    static async approveClaim(claimId) {
        return prisma_1.prisma.insuranceClaim.update({
            where: { id: claimId },
            data: {
                status: "APPROVED",
            },
        });
    }
    /* ========================================
       REJECT CLAIM
    ======================================== */
    static async rejectClaim(claimId) {
        return prisma_1.prisma.insuranceClaim.update({
            where: { id: claimId },
            data: {
                status: "REJECTED",
            },
        });
    }
    /* ========================================
       POLICY ANALYTICS
    ======================================== */
    static async getAnalytics() {
        const totalPolicies = await prisma_1.prisma.insurancePolicy.count();
        const activePolicies = await prisma_1.prisma.insurancePolicy.count({
            where: {
                status: "ACTIVE",
            },
        });
        const totalClaims = await prisma_1.prisma.insuranceClaim.count();
        return {
            totalPolicies,
            activePolicies,
            totalClaims,
        };
    }
}
exports.InsuranceService = InsuranceService;
