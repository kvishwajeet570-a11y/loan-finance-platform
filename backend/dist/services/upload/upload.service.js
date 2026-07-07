"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UploadService {
    /**
     * Save Upload Record
     */
    async createUpload(data) {
        return prisma_1.default.upload.create({
            data,
        });
    }
    /**
     * Upload Profile Image
     */
    async uploadProfileImage(userId, file) {
        const upload = await this.createUpload({
            userId,
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            fileSize: file.size,
            category: "PROFILE",
        });
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                profileImage: upload.fileUrl,
            },
        });
        return upload;
    }
    /**
     * Upload PAN
     */
    async uploadPanDocument(userId, file) {
        return this.createUpload({
            userId,
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            fileSize: file.size,
            category: "PAN_CARD",
        });
    }
    /**
     * Upload Loan Document
     */
    async uploadLoanDocument(userId, file) {
        return this.createUpload({
            userId,
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            fileSize: file.size,
            category: "LOAN_DOCUMENT",
        });
    }
    /**
     * Upload Insurance Document
     */
    async uploadInsuranceDocument(userId, file) {
        return this.createUpload({
            userId,
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            mimeType: file.mimetype,
            fileSize: file.size,
            category: "INSURANCE_DOCUMENT",
        });
    }
    /**
     * Upload Multiple Files
     */
    async uploadMultipleFiles(userId, files, category) {
        const uploads = [];
        for (const file of files) {
            const upload = await this.createUpload({
                userId,
                fileName: file.filename,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                mimeType: file.mimetype,
                fileSize: file.size,
                category,
            });
            uploads.push(upload);
        }
        return uploads;
    }
    /**
     * User Upload History
     */
    async getUserUploads(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [uploads, total] = await Promise.all([
            prisma_1.default.upload.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.upload.count({
                where: { userId },
            }),
        ]);
        return {
            uploads,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Get Upload By ID
     */
    async getUploadById(id) {
        return prisma_1.default.upload.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    /**
     * Delete Upload
     */
    async deleteUpload(id) {
        const upload = await prisma_1.default.upload.findUnique({
            where: { id },
        });
        if (!upload) {
            throw new Error("Upload not found");
        }
        const filePath = path_1.default.join(process.cwd(), "uploads", upload.fileName);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        return prisma_1.default.upload.delete({
            where: { id },
        });
    }
    /**
     * Admin Upload Analytics
     */
    async getUploadStats() {
        const [totalUploads, totalUsers, totalSize,] = await Promise.all([
            prisma_1.default.upload.count(),
            prisma_1.default.upload.groupBy({
                by: ["userId"],
            }),
            prisma_1.default.upload.aggregate({
                _sum: {
                    fileSize: true,
                },
            }),
        ]);
        return {
            totalUploads,
            uniqueUsers: totalUsers.length,
            totalStorageUsed: totalSize._sum.fileSize || 0,
        };
    }
    /**
     * Category Analytics
     */
    async categoryAnalytics() {
        return prisma_1.default.upload.groupBy({
            by: ["category"],
            _count: {
                category: true,
            },
            orderBy: {
                _count: {
                    category: "desc",
                },
            },
        });
    }
    /**
     * Recent Uploads
     */
    async recentUploads() {
        return prisma_1.default.upload.findMany({
            take: 20,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
exports.default = new UploadService();
