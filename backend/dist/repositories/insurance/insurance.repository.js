"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class InsuranceRepository {
    /* ==========================
        CREATE POLICY
    ========================== */
    static async createPolicy(data) {
        return prisma_1.prisma.insurancePolicy.create({
            data
        });
    }
    /* ==========================
        GET POLICY BY ID
    ========================== */
    static async getPolicyById(policyId) {
        return prisma_1.prisma.insurancePolicy.findUnique({
            where: {
                id: policyId
            },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        GET POLICY NUMBER
    ========================== */
    static async getPolicyByNumber(policyNumber) {
        return prisma_1.prisma.insurancePolicy.findUnique({
            where: {
                policyNumber
            }
        });
    }
    /* ==========================
        USER POLICIES
    ========================== */
    static async getUserPolicies(userId) {
        return prisma_1.prisma.insurancePolicy.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        ACTIVE POLICIES
    ========================== */
    static async getActivePolicies() {
        return prisma_1.prisma.insurancePolicy.findMany({
            where: {
                status: "ACTIVE"
            }
        });
    }
    /* ==========================
        EXPIRED POLICIES
    ========================== */
    static async getExpiredPolicies() {
        return prisma_1.prisma.insurancePolicy.findMany({
            where: {
                expiryDate: {
                    lt: new Date()
                }
            }
        });
    }
    /* ==========================
        RENEWAL DUE
    ========================== */
    static async getRenewalDuePolicies(days = 30) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        return prisma_1.prisma.insurancePolicy.findMany({
            where: {
                expiryDate: {
                    lte: targetDate
                },
                status: "ACTIVE"
            }
        });
    }
    /* ==========================
        UPDATE POLICY
    ========================== */
    static async updatePolicy(policyId, data) {
        return prisma_1.prisma.insurancePolicy.update({
            where: {
                id: policyId
            },
            data
        });
    }
    /* ==========================
        CANCEL POLICY
    ========================== */
    static async cancelPolicy(policyId) {
        return prisma_1.prisma.insurancePolicy.update({
            where: {
                id: policyId
            },
            data: {
                status: "CANCELLED"
            }
        });
    }
    /* ==========================
        RENEW POLICY
    ========================== */
    static async renewPolicy(policyId, expiryDate) {
        return prisma_1.prisma.insurancePolicy.update({
            where: {
                id: policyId
            },
            data: {
                expiryDate,
                status: "ACTIVE"
            }
        });
    }
    /* ==========================
        DELETE POLICY
    ========================== */
    static async deletePolicy(policyId) {
        return prisma_1.prisma.insurancePolicy.delete({
            where: {
                id: policyId
            }
        });
    }
    /* ==========================
        SEARCH POLICIES
    ========================== */
    static async searchPolicies(keyword) {
        return prisma_1.prisma.insurancePolicy.findMany({
            where: {
                OR: [
                    {
                        policyNumber: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        provider: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        policyType: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* ==========================
        ALL POLICIES
    ========================== */
    static async getAllPolicies(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [policies, total] = await Promise.all([
            prisma_1.prisma.insurancePolicy.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.prisma.insurancePolicy.count()
        ]);
        return {
            total,
            page,
            limit,
            policies
        };
    }
    /* ==========================
        INSURANCE ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalPolicies, activePolicies, expiredPolicies, premiumSum, coverageSum] = await Promise.all([
            prisma_1.prisma.insurancePolicy.count(),
            prisma_1.prisma.insurancePolicy.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma_1.prisma.insurancePolicy.count({
                where: {
                    expiryDate: {
                        lt: new Date()
                    }
                }
            }),
            prisma_1.prisma.insurancePolicy.aggregate({
                _sum: {
                    premiumAmount: true
                }
            }),
            prisma_1.prisma.insurancePolicy.aggregate({
                _sum: {
                    coverageAmount: true
                }
            })
        ]);
        return {
            totalPolicies,
            activePolicies,
            expiredPolicies,
            totalPremium: premiumSum._sum.premiumAmount || 0,
            totalCoverage: coverageSum._sum.coverageAmount || 0
        };
    }
    /* ==========================
        PROVIDER ANALYTICS
    ========================== */
    static async providerAnalytics() {
        return prisma_1.prisma.insurancePolicy.groupBy({
            by: ["provider"],
            _count: {
                provider: true
            },
            _sum: {
                premiumAmount: true
            }
        });
    }
}
exports.InsuranceRepository = InsuranceRepository;
