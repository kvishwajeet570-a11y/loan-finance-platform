"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastagService = void 0;
const prisma_1 = require("../config/prisma");
class FastagService {
    /* ========================================
       CREATE FASTAG
    ======================================== */
    static async createFastag(payload) {
        return prisma_1.prisma.fastag.create({
            data: {
                customerId: payload.customerId,
                vehicleNumber: payload.vehicleNumber,
                vehicleType: payload.vehicleType,
                mobileNumber: payload.mobileNumber,
                balance: payload.amount,
                status: "ACTIVE",
            },
        });
    }
    /* ========================================
       GET FASTAG BY ID
    ======================================== */
    static async getFastagById(id) {
        return prisma_1.prisma.fastag.findUnique({
            where: { id },
        });
    }
    /* ========================================
       GET CUSTOMER FASTAGS
    ======================================== */
    static async getCustomerFastags(customerId) {
        return prisma_1.prisma.fastag.findMany({
            where: {
                customerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       RECHARGE FASTAG
    ======================================== */
    static async rechargeFastag(fastagId, amount) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const fastag = await tx.fastag.findUnique({
                where: { id: fastagId },
            });
            if (!fastag) {
                throw new Error("Fastag not found");
            }
            const updated = await tx.fastag.update({
                where: {
                    id: fastagId,
                },
                data: {
                    balance: fastag.balance + amount,
                },
            });
            await tx.fastagTransaction.create({
                data: {
                    fastagId,
                    amount,
                    type: "RECHARGE",
                    status: "SUCCESS",
                },
            });
            return updated;
        });
    }
    /* ========================================
       DEDUCT TOLL
    ======================================== */
    static async deductToll(fastagId, amount) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const fastag = await tx.fastag.findUnique({
                where: { id: fastagId },
            });
            if (!fastag) {
                throw new Error("Fastag not found");
            }
            if (fastag.balance < amount) {
                throw new Error("Insufficient balance");
            }
            const updated = await tx.fastag.update({
                where: {
                    id: fastagId,
                },
                data: {
                    balance: fastag.balance - amount,
                },
            });
            await tx.fastagTransaction.create({
                data: {
                    fastagId,
                    amount,
                    type: "TOLL_DEDUCTION",
                    status: "SUCCESS",
                },
            });
            return updated;
        });
    }
    /* ========================================
       GET TRANSACTIONS
    ======================================== */
    static async getTransactions(fastagId) {
        return prisma_1.prisma.fastagTransaction.findMany({
            where: {
                fastagId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* ========================================
       BLOCK FASTAG
    ======================================== */
    static async blockFastag(fastagId) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId,
            },
            data: {
                status: "BLOCKED",
            },
        });
    }
    /* ========================================
       ACTIVATE FASTAG
    ======================================== */
    static async activateFastag(fastagId) {
        return prisma_1.prisma.fastag.update({
            where: {
                id: fastagId,
            },
            data: {
                status: "ACTIVE",
            },
        });
    }
}
exports.FastagService = FastagService;
