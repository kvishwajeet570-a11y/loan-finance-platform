"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class DocumentRepository {
    /* ==========================
        UPLOAD DOCUMENT
    ========================== */
    static async createDocument(data) {
        return prisma_1.default.document.create({
            data
        });
    }
    /* ==========================
        GET DOCUMENT BY ID
    ========================== */
    static async getDocumentById(documentId) {
        return prisma_1.default.document.findUnique({
            where: {
                id: documentId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true
                    }
                }
            }
        });
    }
    /* ==========================
        USER DOCUMENTS
    ========================== */
    static async getUserDocuments(userId) {
        return prisma_1.default.document.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        DOCUMENT TYPE FILTER
    ========================== */
    static async getDocumentsByType(documentType) {
        return prisma_1.default.document.findMany({
            where: {
                documentType
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* ==========================
        VERIFY DOCUMENT
    ========================== */
    static async verifyDocument(documentId, verifiedBy) {
        return prisma_1.default.document.update({
            where: {
                id: documentId
            },
            data: {
                status: "VERIFIED",
                verifiedBy,
            }
        });
    }
    /* ==========================
        REJECT DOCUMENT
    ========================== */
    static async rejectDocument(documentId, rejectionReason) {
        return prisma_1.default.document.update({
            where: {
                id: documentId
            },
            data: {
                status: "REJECTED",
                rejectionReason
            }
        });
    }
    /* ==========================
        UPDATE DOCUMENT
    ========================== */
    static async updateDocument(documentId, data) {
        return prisma_1.default.document.update({
            where: {
                id: documentId
            },
            data
        });
    }
    /* ==========================
        DELETE DOCUMENT
    ========================== */
    static async deleteDocument(documentId) {
        return prisma_1.default.document.delete({
            where: {
                id: documentId
            }
        });
    }
    /* ==========================
        SEARCH DOCUMENTS
    ========================== */
    static async searchDocuments(keyword) {
        return prisma_1.default.document.findMany({
            where: {
                OR: [
                    {
                        documentType: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        documentName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });
    }
    /* ==========================
        ADMIN ALL DOCUMENTS
    ========================== */
    static async getAllDocuments(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [documents, total] = await Promise.all([
            prisma_1.default.document.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: true
                }
            }),
            prisma_1.default.document.count()
        ]);
        return {
            total,
            page,
            limit,
            documents
        };
    }
    /* ==========================
        DOCUMENT ANALYTICS
    ========================== */
    static async getDocumentAnalytics() {
        const [totalDocuments, verifiedDocuments, pendingDocuments, rejectedDocuments] = await Promise.all([
            prisma_1.default.document.count(),
            prisma_1.default.document.count({
                where: {
                    status: "VERIFIED"
                }
            }),
            prisma_1.default.document.count({
                where: {
                    status: "PENDING"
                }
            }),
            prisma_1.default.document.count({
                where: {
                    status: "REJECTED"
                }
            })
        ]);
        return {
            totalDocuments,
            verifiedDocuments,
            pendingDocuments,
            rejectedDocuments
        };
    }
    /* ==========================
        PENDING DOCUMENTS
    ========================== */
    static async getPendingDocuments() {
        return prisma_1.default.document.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "asc"
            }
        });
    }
    /* ==========================
        RECENT DOCUMENTS
    ========================== */
    static async getRecentDocuments(limit = 10) {
        return prisma_1.default.document.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        });
    }
}
exports.DocumentRepository = DocumentRepository;
