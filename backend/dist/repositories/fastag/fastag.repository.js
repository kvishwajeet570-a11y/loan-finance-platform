"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastagRepository = void 0;
const prisma_1 = require("../../prisma/prisma");
class FastagRepository {
    /* ==========================
        CREATE FASTAG
    ========================== */
    static async createFastag(data) {
        return prisma_1.prisma.fastag.create({
            data
        });
    }
    /* ==========================
        GET FASTAG BY ID
    ========================== */
    static async getById(fastagId) {
        return prisma_1.prisma.fastag.findUnique({
            where: {
                id: fastagId
            },
            include: {
                user: true
            }
        });
    }
    /* ==========================
        GET BY VEHICLE NUMBER
    ========================== */
    static async getByVehicleNumber(vehicleNumber) {
        return prisma_1.prisma.fastag.findUnique({
            where: {
                vehicleNumber
            }
        });
    }
    /* ==========================
        GET BY FASTAG NUMBER
    ========================== */
    static async getByFastagNumber(fastagNumber) {
        return prisma_1.prisma.fastag.findUnique({
            where: {
                fastagNumber
            }
        });
    }
    /* ==========================
        USER FASTAGS
    ========================== */
    static async getUserFastags(userId) {
        return prisma_1.prisma.fastag.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        UPDATE FASTAG
    ========================== */
    static async updateFastag(fastagId, data) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data
        });
    }
    /* ==========================
        VERIFY KYC
    ========================== */
    static async verifyKyc(fastagId) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data: {
                kycVerified: true
            }
        });
    }
    /* ==========================
        CREDIT WALLET
    ========================== */
    static async creditWallet(fastagId, amount) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data: {
                walletBalance: {
                    increment: amount
                }
            }
        });
    }
    /* ==========================
        DEBIT WALLET
    ========================== */
    static async debitWallet(fastagId, amount) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data: {
                walletBalance: {
                    decrement: amount
                }
            }
        });
    }
    /* ==========================
        BLOCK FASTAG
    ========================== */
    static async blockFastag(fastagId) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data: {
                status: "BLOCKED"
            }
        });
    }
    /* ==========================
        ACTIVATE FASTAG
    ========================== */
    static async activateFastag(fastagId) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId
            },
            data: {
                status: "ACTIVE"
            }
        });
    }
    /* ==========================
        DELETE FASTAG
    ========================== */
    static async deleteFastag(fastagId) {
        return prisma_1.prisma.fastag.delete({
            where: {
                id: fastagId
            }
        });
    }
    /* ==========================
        SEARCH FASTAGS
    ========================== */
    static async searchFastags(keyword) {
        return prisma_1.prisma.fastag.findMany({
            where: {
                OR: [
                    {
                        vehicleNumber: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        fastagNumber: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        provider: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* ==========================
        GET ALL FASTAGS
    ========================== */
    static async getAllFastags(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            prisma_1.prisma.fastag.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.prisma.fastag.count()
        ]);
        return {
            total,
            page,
            limit,
            records
        };
    }
    /* ==========================
        FASTAG ANALYTICS
    ========================== */
    static async getAnalytics() {
        const [totalFastags, activeFastags, blockedFastags, kycVerified] = await Promise.all([
            prisma_1.prisma.fastag.count(),
            prisma_1.prisma.fastag.count({
                where: {
                    status: "ACTIVE"
                }
            }),
            prisma_1.prisma.fastag.count({
                where: {
                    status: "BLOCKED"
                }
            }),
            prisma_1.prisma.fastag.count({
                where: {
                    kycVerified: true
                }
            })
        ]);
        return {
            totalFastags,
            activeFastags,
            blockedFastags,
            kycVerified
        };
    }
    /* ==========================
        PROVIDER ANALYTICS
    ========================== */
    static async providerAnalytics() {
        return prisma_1.prisma.fastag.groupBy({
            by: ["provider"],
            _count: {
                provider: true
            }
        });
    }
}
exports.FastagRepository = FastagRepository;
