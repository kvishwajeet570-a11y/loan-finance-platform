"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class PartnerRepository {
    /* =========================
        CREATE PARTNER
    ========================= */
    static async createPartner(data) {
        return prisma_1.default.partner.create({
            data: {
                companyName: data.companyName,
                email: data.email,
                phone: data.phone,
                contactPerson: data.contactPerson,
                partnerCode: data.partnerCode,
                city: data.city,
                state: data.state,
            },
        });
    }
    /* =========================
        GET BY ID
    ========================= */
    static async getPartnerById(id) {
        return prisma_1.default.partner.findUnique({
            where: { id },
        });
    }
    /* =========================
        GET BY EMAIL
    ========================= */
    static async getPartnerByEmail(email) {
        return prisma_1.default.partner.findUnique({
            where: { email },
        });
    }
    /* =========================
        GET BY CODE
    ========================= */
    static async getPartnerByCode(partnerCode) {
        return prisma_1.default.partner.findUnique({
            where: { partnerCode },
        });
    }
    /* =========================
        UPDATE PARTNER
    ========================= */
    static async updatePartner(id, data) {
        return prisma_1.default.partner.update({
            where: { id },
            data,
        });
    }
    /* =========================
        APPROVE PARTNER
    ========================= */
    static async approvePartner(id, approvedBy) {
        return prisma_1.default.partner.update({
            where: { id },
            data: {
                status: "APPROVED",
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }
    /* =========================
        REJECT PARTNER
    ========================= */
    static async rejectPartner(id, rejectionReason) {
        return prisma_1.default.partner.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionReason,
            },
        });
    }
    /* =========================
        BLOCK PARTNER
    ========================= */
    static async blockPartner(id) {
        return prisma_1.default.partner.update({
            where: { id },
            data: {
                isBlocked: true,
            },
        });
    }
    /* =========================
        UNBLOCK PARTNER
    ========================= */
    static async unblockPartner(id) {
        return prisma_1.default.partner.update({
            where: { id },
            data: {
                isBlocked: false,
            },
        });
    }
    /* =========================
        TOGGLE ACTIVE
    ========================= */
    static async togglePartnerStatus(id, isActive) {
        return prisma_1.default.partner.update({
            where: { id },
            data: {
                isActive,
            },
        });
    }
    /* =========================
        SEARCH PARTNERS
    ========================= */
    static async searchPartners(keyword) {
        return prisma_1.default.partner.findMany({
            where: {
                OR: [
                    {
                        companyName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        partnerCode: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /* =========================
        GET ALL PARTNERS
    ========================= */
    static async getAllPartners(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [partners, total] = await Promise.all([
            prisma_1.default.partner.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.partner.count(),
        ]);
        return {
            partners,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    /* =========================
        DELETE PARTNER
    ========================= */
    static async deletePartner(id) {
        return prisma_1.default.partner.delete({
            where: { id },
        });
    }
    /* =========================
        ANALYTICS
    ========================= */
    static async getAnalytics() {
        const [totalPartners, activePartners, blockedPartners, approvedPartners, pendingPartners,] = await Promise.all([
            prisma_1.default.partner.count(),
            prisma_1.default.partner.count({
                where: {
                    isActive: true,
                },
            }),
            prisma_1.default.partner.count({
                where: {
                    isBlocked: true,
                },
            }),
            prisma_1.default.partner.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.partner.count({
                where: {
                    status: "PENDING",
                },
            }),
        ]);
        return {
            totalPartners,
            activePartners,
            blockedPartners,
            approvedPartners,
            pendingPartners,
        };
    }
    /* =========================
        DASHBOARD
    ========================= */
    static async getPartnerDashboard(id) {
        const partner = await prisma_1.default.partner.findUnique({
            where: { id },
        });
        if (!partner) {
            return null;
        }
        return {
            id: partner.id,
            companyName: partner.companyName,
            email: partner.email,
            status: partner.status,
            isActive: partner.isActive,
            isBlocked: partner.isBlocked,
            createdAt: partner.createdAt,
        };
    }
}
exports.PartnerRepository = PartnerRepository;
