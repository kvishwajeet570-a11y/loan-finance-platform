"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastagService = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class FastagService {
    /* ========================================
       CREATE FASTAG
    ======================================== */
    static async createFastag(payload) {
        return prisma_1.default.fastTag.create({
            data: {
                userId: payload.customerId,
                vehicleNo: payload.vehicleNumber,
                provider: payload.vehicleType,
                amount: payload.amount,
                status: "ACTIVE",
            },
        });
    }
    /* ========================================
       GET FASTAG BY ID
    ======================================== */
    static async getFastagById(id) {
        return prisma_1.default.fastTag.findUnique({
            where: { id },
        });
    }
    /* ========================================
       GET CUSTOMER FASTAGS
    ======================================== */
    static async getCustomerFastags(customerId) {
        return prisma_1.default.fastTag.findMany({
            where: {
                userId: customerId,
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
        const fastag = await prisma_1.default.fastTag.findUnique({
            where: { id: fastagId },
        });
        if (!fastag) {
            throw new Error("FASTag not found");
        }
        return prisma_1.default.fastTag.update({
            where: {
                id: fastagId,
            },
            data: {
                amount: fastag.amount + amount,
            },
        });
    }
    /* ========================================
       ACTIVATE FASTAG
    ======================================== */
    static async activateFastag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: true,
                status: "ACTIVE",
            },
        });
    }
    /* ========================================
       DEACTIVATE FASTAG
    ======================================== */
    static async deactivateFastag(id) {
        return prisma_1.default.fastTag.update({
            where: { id },
            data: {
                isActive: false,
                status: "INACTIVE",
            },
        });
    }
    /* ========================================
       GET ALL FASTAGS
    ======================================== */
    static async getAllFastags() {
        const data = await prisma_1.default.fastTag.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            data,
            total: data.length,
            page: 1,
            limit: data.length,
            totalPages: 1,
        };
    }
    /* ========================================
       FASTAG STATS
    ======================================== */
    static async getStats() {
        const total = await prisma_1.default.fastTag.count();
        const active = await prisma_1.default.fastTag.count({
            where: {
                isActive: true,
            },
        });
        const inactive = await prisma_1.default.fastTag.count({
            where: {
                isActive: false,
            },
        });
        return {
            total,
            active,
            inactive,
        };
    }
    /* ========================================
       TRANSACTIONS (TEMP)
    ======================================== */
    static async getTransactions(fastagId) {
        return [];
    }
    /* ========================================
       CONTROLLER COMPATIBILITY METHODS
    ======================================== */
    static async getFastTags(params) {
        return this.getAllFastags();
    }
    static async getFastTagById(id) {
        return this.getFastagById(id);
    }
    static async createFastTag(payload) {
        return this.createFastag(payload);
    }
    static async activateTag(id) {
        return this.activateFastag(id);
    }
    static async deactivateTag(id) {
        return this.deactivateFastag(id);
    }
    static async getFastTagStats() {
        return this.getStats();
    }
}
exports.FastagService = FastagService;
exports.default = FastagService;
