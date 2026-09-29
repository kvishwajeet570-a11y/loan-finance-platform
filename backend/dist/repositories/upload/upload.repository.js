"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExists = exports.findUploadByFileName = exports.countActiveUploads = exports.countUploads = exports.getUploadAuditLogs = exports.bulkDeleteUploads = exports.bulkRejectUploads = exports.bulkApproveUploads = exports.getFileTypeAnalytics = exports.getStorageAnalytics = exports.getUploadAnalytics = exports.getUploadDashboard = exports.getLargeFiles = exports.getRecentUploads = exports.searchUploads = exports.getExpiredUploads = exports.getRejectedUploads = exports.getApprovedUploads = exports.getPendingUploads = exports.restoreUpload = exports.deleteUpload = exports.verifyUpload = exports.rejectUpload = exports.approveUpload = exports.getPartnerUploads = exports.getDsaUploads = exports.getCustomerUploads = exports.getUserUploads = exports.getAllUploads = exports.getUploadById = exports.updateUpload = exports.createUpload = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ===========================================================
   CREATE UPLOAD
=========================================================== */
const createUpload = async (data) => {
    return prisma_1.default.upload.create({
        data,
    });
};
exports.createUpload = createUpload;
/* ===========================================================
   UPDATE UPLOAD
=========================================================== */
const updateUpload = async (id, data) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data,
    });
};
exports.updateUpload = updateUpload;
/* ===========================================================
   GET UPLOAD BY ID
=========================================================== */
const getUploadById = async (id) => {
    return prisma_1.default.upload.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
};
exports.getUploadById = getUploadById;
/* ===========================================================
   GET ALL UPLOADS
=========================================================== */
const getAllUploads = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return prisma_1.default.upload.findMany({
        skip,
        take: limit,
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllUploads = getAllUploads;
/* ===========================================================
   GET USER UPLOADS
=========================================================== */
const getUserUploads = async (userId) => {
    return prisma_1.default.upload.findMany({
        where: {
            userId,
            isDeleted: false,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getUserUploads = getUserUploads;
/* ===========================================================
   GET CUSTOMER UPLOADS
=========================================================== */
const getCustomerUploads = async (customerId) => {
    return prisma_1.default.upload.findMany({
        where: {
            customerId,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getCustomerUploads = getCustomerUploads;
/* ===========================================================
   GET DSA UPLOADS
=========================================================== */
const getDsaUploads = async (dsaId) => {
    return prisma_1.default.upload.findMany({
        where: {
            dsaId,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getDsaUploads = getDsaUploads;
/* ===========================================================
   GET PARTNER UPLOADS
=========================================================== */
const getPartnerUploads = async (partnerId) => {
    return prisma_1.default.upload.findMany({
        where: {
            partnerId,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getPartnerUploads = getPartnerUploads;
/* ===========================================================
   APPROVE UPLOAD
=========================================================== */
const approveUpload = async (id, approvedBy) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data: {
            status: "APPROVED",
            isApproved: true,
            approvedBy,
            approvedAt: new Date(),
        },
    });
};
exports.approveUpload = approveUpload;
/* ===========================================================
   REJECT UPLOAD
=========================================================== */
const rejectUpload = async (id, rejectedBy, rejectReason) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data: {
            status: "REJECTED",
            rejectedBy,
            rejectedAt: new Date(),
            rejectReason,
        },
    });
};
exports.rejectUpload = rejectUpload;
/* ===========================================================
   VERIFY UPLOAD
=========================================================== */
const verifyUpload = async (id, verifiedBy) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data: {
            isVerified: true,
            verifiedBy,
            verifiedAt: new Date(),
        },
    });
};
exports.verifyUpload = verifyUpload;
/* ===========================================================
   DELETE UPLOAD (SOFT DELETE)
=========================================================== */
const deleteUpload = async (id) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            status: "DELETED",
        },
    });
};
exports.deleteUpload = deleteUpload;
/* ===========================================================
   RESTORE UPLOAD
=========================================================== */
const restoreUpload = async (id) => {
    return prisma_1.default.upload.update({
        where: {
            id,
        },
        data: {
            isDeleted: false,
            deletedAt: null,
            status: "ACTIVE",
        },
    });
};
exports.restoreUpload = restoreUpload;
/* ===========================================================
   GET PENDING UPLOADS
=========================================================== */
const getPendingUploads = async () => {
    return prisma_1.default.upload.findMany({
        where: {
            status: "PENDING",
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getPendingUploads = getPendingUploads;
/* ===========================================================
   GET APPROVED UPLOADS
=========================================================== */
const getApprovedUploads = async () => {
    return prisma_1.default.upload.findMany({
        where: {
            status: "APPROVED",
            isDeleted: false,
        },
        orderBy: {
            approvedAt: "desc",
        },
    });
};
exports.getApprovedUploads = getApprovedUploads;
/* ===========================================================
   GET REJECTED UPLOADS
=========================================================== */
const getRejectedUploads = async () => {
    return prisma_1.default.upload.findMany({
        where: {
            status: "REJECTED",
            isDeleted: false,
        },
        orderBy: {
            rejectedAt: "desc",
        },
    });
};
exports.getRejectedUploads = getRejectedUploads;
/* ===========================================================
   GET EXPIRED UPLOADS
=========================================================== */
const getExpiredUploads = async () => {
    return prisma_1.default.upload.findMany({
        where: {
            isExpired: true,
            isDeleted: false,
        },
        orderBy: {
            expiryDate: "asc",
        },
    });
};
exports.getExpiredUploads = getExpiredUploads;
/* ===========================================================
   SEARCH UPLOADS
=========================================================== */
const searchUploads = async (search, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
            OR: [
                {
                    fileName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    originalName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
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
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.searchUploads = searchUploads;
/* ===========================================================
   GET RECENT UPLOADS
=========================================================== */
const getRecentUploads = async (limit = 10) => {
    return prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
        },
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getRecentUploads = getRecentUploads;
/* ===========================================================
   GET LARGE FILES
=========================================================== */
const getLargeFiles = async (minSize = 5 * 1024 * 1024) => {
    return prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
            fileSize: {
                gte: minSize,
            },
        },
        orderBy: {
            fileSize: "desc",
        },
    });
};
exports.getLargeFiles = getLargeFiles;
/* ===========================================================
   UPLOAD DASHBOARD
=========================================================== */
const getUploadDashboard = async () => {
    const [total, pending, approved, rejected, deleted, expired,] = await Promise.all([
        prisma_1.default.upload.count(),
        prisma_1.default.upload.count({
            where: {
                status: "PENDING",
            },
        }),
        prisma_1.default.upload.count({
            where: {
                status: "APPROVED",
            },
        }),
        prisma_1.default.upload.count({
            where: {
                status: "REJECTED",
            },
        }),
        prisma_1.default.upload.count({
            where: {
                isDeleted: true,
            },
        }),
        prisma_1.default.upload.count({
            where: {
                isExpired: true,
            },
        }),
    ]);
    return {
        total,
        pending,
        approved,
        rejected,
        deleted,
        expired,
    };
};
exports.getUploadDashboard = getUploadDashboard;
/* ===========================================================
   UPLOAD ANALYTICS
=========================================================== */
const getUploadAnalytics = async () => {
    const uploads = await prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            category: true,
            fileSize: true,
        },
    });
    const totalFiles = uploads.length;
    const totalStorage = uploads.reduce((sum, item) => sum + (item.fileSize || 0), 0);
    const categoryStats = uploads.reduce((acc, item) => {
        const key = item.category || "OTHER";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    return {
        totalFiles,
        totalStorage,
        categoryStats,
    };
};
exports.getUploadAnalytics = getUploadAnalytics;
/* ===========================================================
   STORAGE ANALYTICS
=========================================================== */
const getStorageAnalytics = async () => {
    const uploads = await prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            fileSize: true,
        },
    });
    const totalFiles = uploads.length;
    const totalStorage = uploads.reduce((sum, item) => sum + (item.fileSize || 0), 0);
    return {
        totalFiles,
        totalStorage,
        averageSize: totalFiles === 0
            ? 0
            : Math.round(totalStorage / totalFiles),
    };
};
exports.getStorageAnalytics = getStorageAnalytics;
/* ===========================================================
   FILE TYPE ANALYTICS
=========================================================== */
const getFileTypeAnalytics = async () => {
    const uploads = await prisma_1.default.upload.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            extension: true,
        },
    });
    return uploads.reduce((acc, item) => {
        const key = item.extension || "UNKNOWN";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
};
exports.getFileTypeAnalytics = getFileTypeAnalytics;
/* ===========================================================
   BULK APPROVE UPLOADS
=========================================================== */
const bulkApproveUploads = async (ids, approvedBy) => {
    return prisma_1.default.upload.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            status: "APPROVED",
            isApproved: true,
            approvedBy,
            approvedAt: new Date(),
        },
    });
};
exports.bulkApproveUploads = bulkApproveUploads;
/* ===========================================================
   BULK REJECT UPLOADS
=========================================================== */
const bulkRejectUploads = async (ids, rejectedBy, rejectReason) => {
    return prisma_1.default.upload.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            status: "REJECTED",
            rejectedBy,
            rejectedAt: new Date(),
            rejectReason,
        },
    });
};
exports.bulkRejectUploads = bulkRejectUploads;
/* ===========================================================
   BULK DELETE UPLOADS
=========================================================== */
const bulkDeleteUploads = async (ids) => {
    return prisma_1.default.upload.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            status: "DELETED",
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};
exports.bulkDeleteUploads = bulkDeleteUploads;
/* ===========================================================
   GET UPLOAD AUDIT LOGS
=========================================================== */
const getUploadAuditLogs = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return prisma_1.default.upload.findMany({
        skip,
        take: limit,
        select: {
            id: true,
            fileName: true,
            originalName: true,
            status: true,
            uploadedBy: true,
            uploadedIp: true,
            deviceInfo: true,
            platform: true,
            approvedBy: true,
            approvedAt: true,
            rejectedBy: true,
            rejectedAt: true,
            rejectReason: true,
            verifiedBy: true,
            verifiedAt: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};
exports.getUploadAuditLogs = getUploadAuditLogs;
/* ===========================================================
   COUNT UPLOADS
=========================================================== */
const countUploads = async () => {
    return prisma_1.default.upload.count();
};
exports.countUploads = countUploads;
/* ===========================================================
   COUNT ACTIVE UPLOADS
=========================================================== */
const countActiveUploads = async () => {
    return prisma_1.default.upload.count({
        where: {
            isDeleted: false,
        },
    });
};
exports.countActiveUploads = countActiveUploads;
/* ===========================================================
   FIND UPLOAD BY FILE NAME
=========================================================== */
const findUploadByFileName = async (fileName) => {
    return prisma_1.default.upload.findFirst({
        where: {
            fileName,
        },
    });
};
exports.findUploadByFileName = findUploadByFileName;
/* ===========================================================
   CHECK UPLOAD EXISTS
=========================================================== */
const uploadExists = async (id) => {
    const count = await prisma_1.default.upload.count({
        where: {
            id,
        },
    });
    return count > 0;
};
exports.uploadExists = uploadExists;
