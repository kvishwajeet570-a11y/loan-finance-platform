"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRepository = void 0;
const prisma_1 = require("../../prisma");
class UploadRepository {
    /* =====================================
        CREATE UPLOAD
    ===================================== */
    static async createUpload(data) {
        return prisma_1.prisma.upload.create({
            data
        });
    }
    /* =====================================
        GET BY ID
    ===================================== */
    static async getById(id) {
        return prisma_1.prisma.upload.findUnique({
            where: { id },
            include: {
                user: true
            }
        });
    }
    /* =====================================
        GET FILE
    ===================================== */
    static async getFileByUrl(fileUrl) {
        return prisma_1.prisma.upload.findFirst({
            where: {
                fileUrl
            }
        });
    }
    /* =====================================
        USER FILES
    ===================================== */
    static async getUserFiles(userId, page = 1, limit = 20) {
        return prisma_1.prisma.upload.findMany({
            where: {
                userId
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =====================================
        CATEGORY FILES
    ===================================== */
    static async getByCategory(category) {
        return prisma_1.prisma.upload.findMany({
            where: {
                category
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =====================================
        FILE TYPE
    ===================================== */
    static async getByFileType(fileType) {
        return prisma_1.prisma.upload.findMany({
            where: {
                fileType
            }
        });
    }
    /* =====================================
        UPDATE FILE
    ===================================== */
    static async updateFile(id, data) {
        return prisma_1.prisma.upload.update({
            where: { id },
            data
        });
    }
    /* =====================================
        VIEW COUNT
    ===================================== */
    static async incrementView(id) {
        return prisma_1.prisma.upload.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });
    }
    /* =====================================
        DOWNLOAD COUNT
    ===================================== */
    static async incrementDownload(id) {
        return prisma_1.prisma.upload.update({
            where: { id },
            data: {
                downloadCount: {
                    increment: 1
                }
            }
        });
    }
    /* =====================================
        MAKE PUBLIC
    ===================================== */
    static async makePublic(id) {
        return prisma_1.prisma.upload.update({
            where: { id },
            data: {
                isPublic: true
            }
        });
    }
    /* =====================================
        MAKE PRIVATE
    ===================================== */
    static async makePrivate(id) {
        return prisma_1.prisma.upload.update({
            where: { id },
            data: {
                isPublic: false
            }
        });
    }
    /* =====================================
        DELETE FILE
    ===================================== */
    static async deleteFile(id) {
        return prisma_1.prisma.upload.delete({
            where: { id }
        });
    }
    /* =====================================
        SEARCH FILES
    ===================================== */
    static async searchFiles(keyword) {
        return prisma_1.prisma.upload.findMany({
            where: {
                OR: [
                    {
                        fileName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        originalName: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    },
                    {
                        category: {
                            contains: keyword,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =====================================
        ALL FILES
    ===================================== */
    static async getAllFiles(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [files, total] = await Promise.all([
            prisma_1.prisma.upload.findMany({
                skip,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.prisma.upload.count()
        ]);
        return {
            files,
            total,
            page,
            limit
        };
    }
    /* =====================================
        STORAGE ANALYTICS
    ===================================== */
    static async getAnalytics() {
        const [totalFiles, totalStorage, publicFiles, privateFiles] = await Promise.all([
            prisma_1.prisma.upload.count(),
            prisma_1.prisma.upload.aggregate({
                _sum: {
                    fileSize: true
                }
            }),
            prisma_1.prisma.upload.count({
                where: {
                    isPublic: true
                }
            }),
            prisma_1.prisma.upload.count({
                where: {
                    isPublic: false
                }
            })
        ]);
        return {
            totalFiles,
            totalStorage: totalStorage._sum.fileSize || 0,
            publicFiles,
            privateFiles
        };
    }
    /* =====================================
        RECENT FILES
    ===================================== */
    static async getRecentFiles(limit = 20) {
        return prisma_1.prisma.upload.findMany({
            take: limit,
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    /* =====================================
        DASHBOARD
    ===================================== */
    static async getDashboard() {
        const [analytics, recentFiles] = await Promise.all([
            this.getAnalytics(),
            this.getRecentFiles()
        ]);
        return {
            analytics,
            recentFiles
        };
    }
}
exports.UploadRepository = UploadRepository;
