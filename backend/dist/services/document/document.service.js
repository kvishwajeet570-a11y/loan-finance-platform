"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class DocumentService {
    /**
     * Upload Document
     */
    async uploadDocument(data) {
        return prisma_1.default.document.create({
            data: {
                ...data,
                status: "PENDING",
            },
        });
    }
    /**
     * Get Document By ID
     */
    async getDocumentById(id) {
        return prisma_1.default.document.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    /**
     * User Documents
     */
    async getUserDocuments(userId) {
        return prisma_1.default.document.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Verify Document
     */
    async verifyDocument(documentId, verifiedBy) {
        return prisma_1.default.document.update({
            where: { id: documentId },
            data: {
                status: "VERIFIED",
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
    }
    /**
     * Reject Document
     */
    async rejectDocument(documentId, reason) {
        return prisma_1.default.document.update({
            where: { id: documentId },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * Get All Documents
     */
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
            where.documentType =
                documentType;
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
    /**
     * Pending Documents
     */
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
    /**
     * Delete Document
     */
    async deleteDocument(id) {
        return prisma_1.default.document.delete({
            where: { id },
        });
    }
    /**
     * Loan Documents
     */
    async getLoanDocuments(loanId) {
        return prisma_1.default.document.findMany({
            where: {
                loanId,
            },
        });
    }
    /**
     * KYC Completion Check
     */
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
    /**
     * Dashboard Statistics
     */
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
}
exports.default = new DocumentService();
