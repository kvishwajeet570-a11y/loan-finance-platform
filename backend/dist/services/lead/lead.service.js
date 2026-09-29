"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class LeadService {
    async createLead(data) {
        return prisma_1.default.lead.create({
            data,
        });
    }
    async getLeads(filters = {}) {
        const { page = 1, limit = 10, search = "", status = "", } = filters;
        const where = {
            isDeleted: false,
        };
        if (search) {
            where.OR = [
                {
                    fullName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    mobileNumber: {
                        contains: search,
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (status) {
            where.status = status;
        }
        const [data, total] = await Promise.all([
            prisma_1.default.lead.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.lead.count({
                where,
            }),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getLeadById(id) {
        return prisma_1.default.lead.findFirst({
            where: {
                id,
                isDeleted: false,
            },
        });
    }
    async assignLead(data) {
        return prisma_1.default.lead.update({
            where: {
                id: data.leadId,
            },
            data: {
                assignedTo: data.assignedTo,
            },
        });
    }
    async updateStatus(data) {
        return prisma_1.default.lead.update({
            where: {
                id: data.leadId,
            },
            data: {
                status: data.status,
            },
        });
    }
    async softDelete(id) {
        return prisma_1.default.lead.update({
            where: {
                id: String(id),
            },
            data: {
                isDeleted: true,
            },
        });
    }
    async getAnalytics() {
        const totalLeads = await prisma_1.default.lead.count({
            where: {
                isDeleted: false,
            },
        });
        const newLeads = await prisma_1.default.lead.count({
            where: {
                status: "NEW",
                isDeleted: false,
            },
        });
        const assignedLeads = await prisma_1.default.lead.count({
            where: {
                assignedTo: {
                    not: null,
                },
                isDeleted: false,
            },
        });
        return {
            totalLeads,
            newLeads,
            assignedLeads,
        };
    }
}
exports.default = new LeadService();
