"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class DocumentService {
    async uploadDocument(data) {
        return prisma_1.default.document.create({
            data: {
                ...data,
                status: "PENDING",
            },
        });
    }
    async getDocumentById(id) {
        return prisma_1.default.document.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    async getUserDocuments(userId) {
        return prisma_1.default.document.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async verifyDocument(documentId, verifiedBy) {
        return prisma_1.default.document.update({
            where: { id: documentId },
            data: {
                status: "VERIFIED",
                verifiedBy,
            },
        });
    }
    async rejectDocument(documentId, reason) {
        return prisma_1.default.document.update({
            where: { id: documentId },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    async getDocuments(filters) {
        const { page = 1, limit = 20, search, documentType, status, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                {
                    documentName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }
        if (documentType) {
            where.documentType = documentType;
        }
        if (status) {
            where.status = status;
        }
        const [documents, total] = await Promise.all([
            prisma_1.default.document.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.document.count({
                where,
            }),
        ]);
        return {
            documents,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    async getPendingDocuments() {
        return prisma_1.default.document.findMany({
            where: {
                status: "PENDING",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getVerifiedDocuments() {
        return prisma_1.default.document.findMany({
            where: {
                status: "VERIFIED",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getRejectedDocuments() {
        return prisma_1.default.document.findMany({
            where: {
                status: "REJECTED",
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async deleteDocument(id) {
        return prisma_1.default.document.delete({
            where: { id },
        });
    }
    async getLoanDocuments(loanId) {
        return prisma_1.default.document.findMany({
            where: { loanId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async checkKYCCompletion(userId) {
        const documents = await prisma_1.default.document.findMany({
            where: {
                userId,
                status: "VERIFIED",
            },
        });
        const requiredDocs = [
            "PAN",
            "AADHAAR",
            "BANK_STATEMENT",
        ];
        const uploaded = documents.map((doc) => doc.documentType);
        const completed = requiredDocs.every((doc) => uploaded.includes(doc));
        return {
            completed,
            uploaded,
            requiredDocs,
        };
    }
    async getDocumentStats() {
        const [total, verified, pending, rejected,] = await Promise.all([
            prisma_1.default.document.count(),
            prisma_1.default.document.count({
                where: {
                    status: "VERIFIED",
                },
            }),
            prisma_1.default.document.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.document.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        return {
            total,
            verified,
            pending,
            rejected,
        };
    }
    // ========================================
    // UPDATE DOCUMENT
    // ========================================
    async updateDocument(id, data) {
        return prisma_1.default.document.update({
            where: { id },
            data,
        });
    }
    // ========================================
    // SEARCH DOCUMENTS
    // ========================================
    async searchDocuments(search) {
        return prisma_1.default.document.findMany({
            where: {
                OR: [
                    {
                        documentName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        documentType: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // ========================================
    // DOCUMENTS BY TYPE
    // ========================================
    async getDocumentsByType(type) {
        return prisma_1.default.document.findMany({
            where: {
                documentType: type,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // ========================================
    // DOWNLOAD DOCUMENT
    // ========================================
    async downloadDocument(id) {
        return prisma_1.default.document.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    // ========================================
    // DOCUMENT DASHBOARD
    // ========================================
    async getDocumentDashboard() {
        return this.getDocumentStats();
    }
    // ========================================
    // RECENT DOCUMENTS
    // ========================================
    async getRecentDocuments(limit = 10) {
        return prisma_1.default.document.findMany({
            take: limit,
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // ========================================
    // BULK VERIFY DOCUMENTS
    // ========================================
    async bulkVerifyDocuments(ids, verifiedBy) {
        return prisma_1.default.document.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: "VERIFIED",
                verifiedBy,
            },
        });
    }
    // ========================================
    // BULK REJECT DOCUMENTS
    // ========================================
    async bulkRejectDocuments(ids, reason) {
        return prisma_1.default.document.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    // ========================================
    // EXPORT DOCUMENTS EXCEL
    // ========================================
    async exportDocumentsExcel() {
        return prisma_1.default.document.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    // ========================================
    // EXPORT DOCUMENTS PDF
    // ========================================
    async exportDocumentsPdf() {
        return prisma_1.default.document.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
} // Class DocumentService ends here
exports.default = new DocumentService();
