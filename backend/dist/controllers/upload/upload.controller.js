"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingDocuments = exports.searchDocuments = exports.updateDocument = exports.getAllDocuments = exports.getUserDocuments = exports.generateDownloadUrl = exports.generateUploadUrl = exports.getUploadAuditLogs = exports.bulkDeleteUploads = exports.bulkRejectUploads = exports.bulkApproveUploads = exports.exportUploadsPdf = exports.exportUploadsExcel = exports.searchUploads = exports.getFileTypeAnalytics = exports.getStorageAnalytics = exports.getUploadAnalytics = exports.getUploadDashboard = exports.getLargeFiles = exports.getRecentUploads = exports.getExpiredUploads = exports.getRejectedUploads = exports.getApprovedUploads = exports.getPendingUploads = exports.restoreFile = exports.deleteFile = exports.previewFile = exports.downloadFile = exports.rejectUploadedDocument = exports.rejectUpload = exports.approveUpload = exports.verifyUploadedDocument = exports.getPartnerUploads = exports.getDsaUploads = exports.getCustomerUploads = exports.getUserUploads = exports.getUploadById = exports.getAllUploads = exports.uploadInsuranceDocument = exports.uploadAgreement = exports.uploadDrivingLicense = exports.uploadPassport = exports.uploadAadhaarCard = exports.uploadPanCard = exports.uploadBankDocument = exports.uploadLoanDocument = exports.uploadKycDocument = exports.uploadProfileImage = exports.uploadMultipleFiles = exports.uploadSingleFile = void 0;
exports.exportDocumentsPdf = exports.exportDocumentsExcel = exports.bulkRejectDocuments = exports.bulkVerifyDocuments = exports.getRecentDocuments = exports.getDocumentDashboard = exports.downloadDocument = exports.getDocumentsByType = exports.getRejectedDocuments = exports.getVerifiedDocuments = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/**
 * ===========================================
 * Helpers
 * ===========================================
 */
const ensureUploadDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads");
ensureUploadDir(UPLOAD_DIR);
const generateFileName = (originalName) => {
    const ext = path_1.default.extname(originalName);
    const name = Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    return `${name}${ext}`;
};
const success = (res, message, data, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};
const failure = (res, error, status = 500) => {
    return res.status(status).json({
        success: false,
        message: error instanceof Error ? error.message : String(error),
    });
};
/**
 * ===========================================
 * Common Upload Helpers
 * ===========================================
 */
const saveUploadRecord = async ({ fileName, originalName, fileUrl, fileType, fileSize, category, uploadedBy, userId, }) => {
    return prisma_1.default.upload.create({
        data: {
            fileName,
            originalName,
            fileUrl,
            fileType,
            fileSize,
            category,
            uploadedBy,
            userId,
        },
    });
};
const getFileExtension = (fileName) => {
    return path_1.default.extname(fileName).replace(".", "").toLowerCase();
};
const isImage = (fileName) => {
    const ext = getFileExtension(fileName);
    return [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "bmp",
    ].includes(ext);
};
const isPdf = (fileName) => {
    return getFileExtension(fileName) === "pdf";
};
const removeFileIfExists = (filePath) => {
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
};
const createUploadResponse = (upload) => ({
    id: upload.id,
    fileName: upload.fileName,
    originalName: upload.originalName,
    fileUrl: upload.fileUrl,
    fileType: upload.fileType,
    fileSize: upload.fileSize,
    category: upload.category,
    uploadedBy: upload.uploadedBy,
    userId: upload.userId,
    createdAt: upload.createdAt,
});
/**
 * ===========================================
 * Upload Single File
 * ===========================================
 */
const uploadSingleFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return failure(res, "No file uploaded", 400);
        }
        const upload = await saveUploadRecord({
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            category: req.body.category,
            uploadedBy: req.body.uploadedBy,
            userId: req.body.userId,
        });
        return success(res, "File uploaded successfully", createUploadResponse(upload), 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadSingleFile = uploadSingleFile;
/**
 * ===========================================
 * Upload Multiple Files
 * ===========================================
 */
const uploadMultipleFiles = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return failure(res, "No files uploaded", 400);
        }
        const uploads = [];
        for (const file of files) {
            const upload = await saveUploadRecord({
                fileName: file.filename,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileType: file.mimetype,
                fileSize: file.size,
                category: req.body.category,
                uploadedBy: req.body.uploadedBy,
                userId: req.body.userId,
            });
            uploads.push(createUploadResponse(upload));
        }
        return success(res, `${uploads.length} file(s) uploaded successfully`, uploads, 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadMultipleFiles = uploadMultipleFiles;
/**
 * ===========================================
 * Upload Profile Image
 * ===========================================
 */
const uploadProfileImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return failure(res, "Profile image is required", 400);
        }
        if (!isImage(file.originalname)) {
            removeFileIfExists(file.path);
            return failure(res, "Only image files are allowed", 400);
        }
        const upload = await saveUploadRecord({
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            category: "PROFILE",
            uploadedBy: req.body.uploadedBy,
            userId: req.body.userId,
        });
        return success(res, "Profile image uploaded successfully", createUploadResponse(upload), 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadProfileImage = uploadProfileImage;
/**
 * ===========================================
 * Upload KYC Document
 * ===========================================
 */
const uploadKycDocument = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return failure(res, "KYC document is required", 400);
        }
        const upload = await saveUploadRecord({
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            category: "KYC",
            uploadedBy: req.body.uploadedBy,
            userId: req.body.userId,
        });
        return success(res, "KYC document uploaded successfully", createUploadResponse(upload), 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadKycDocument = uploadKycDocument;
/**
 * ===========================================
 * Upload Loan Document
 * ===========================================
 */
const uploadLoanDocument = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return failure(res, "Loan document is required", 400);
        }
        const upload = await saveUploadRecord({
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            category: "LOAN",
            uploadedBy: req.body.uploadedBy,
            userId: req.body.userId,
        });
        return success(res, "Loan document uploaded successfully", createUploadResponse(upload), 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadLoanDocument = uploadLoanDocument;
/**
 * ===========================================
 * Upload Bank Document
 * ===========================================
 */
const uploadBankDocument = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return failure(res, "Bank document is required", 400);
        }
        const upload = await saveUploadRecord({
            fileName: file.filename,
            originalName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileType: file.mimetype,
            fileSize: file.size,
            category: "BANK",
            uploadedBy: req.body.uploadedBy,
            userId: req.body.userId,
        });
        return success(res, "Bank document uploaded successfully", createUploadResponse(upload), 201);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.uploadBankDocument = uploadBankDocument;
/**
 * ===========================================
 * PAN CARD
 * ===========================================
 */
const uploadPanCard = async (req, res) => {
    req.body.category = "PAN";
    return (0, exports.uploadKycDocument)(req, res);
};
exports.uploadPanCard = uploadPanCard;
/**
 * ===========================================
 * AADHAAR CARD
 * ===========================================
 */
const uploadAadhaarCard = async (req, res) => {
    req.body.category = "AADHAAR";
    return (0, exports.uploadKycDocument)(req, res);
};
exports.uploadAadhaarCard = uploadAadhaarCard;
/**
 * ===========================================
 * PASSPORT
 * ===========================================
 */
const uploadPassport = async (req, res) => {
    req.body.category = "PASSPORT";
    return (0, exports.uploadKycDocument)(req, res);
};
exports.uploadPassport = uploadPassport;
/**
 * ===========================================
 * DRIVING LICENSE
 * ===========================================
 */
const uploadDrivingLicense = async (req, res) => {
    req.body.category = "DRIVING_LICENSE";
    return (0, exports.uploadKycDocument)(req, res);
};
exports.uploadDrivingLicense = uploadDrivingLicense;
/**
 * ===========================================
 * AGREEMENT
 * ===========================================
 */
const uploadAgreement = async (req, res) => {
    req.body.category = "AGREEMENT";
    return (0, exports.uploadLoanDocument)(req, res);
};
exports.uploadAgreement = uploadAgreement;
/**
 * ===========================================
 * INSURANCE DOCUMENT
 * ===========================================
 */
const uploadInsuranceDocument = async (req, res) => {
    req.body.category = "INSURANCE";
    return (0, exports.uploadLoanDocument)(req, res);
};
exports.uploadInsuranceDocument = uploadInsuranceDocument;
/**
 * ===========================================
 * GET ALL UPLOADS
 * ===========================================
 */
const getAllUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "Uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getAllUploads = getAllUploads;
/**
 * ===========================================
 * GET UPLOAD BY ID
 * ===========================================
 */
const getUploadById = async (req, res) => {
    try {
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: String(req.params.id)
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        return success(res, "Upload fetched successfully", upload);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getUploadById = getUploadById;
/**
 * ===========================================
 * GET USER UPLOADS
 * ===========================================
 */
const getUserUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                userId: String(req.params.userId)
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "User uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getUserUploads = getUserUploads;
/**
 * ===========================================
 * GET CUSTOMER UPLOADS
 * ===========================================
 */
const getCustomerUploads = async (req, res) => {
    return (0, exports.getUserUploads)(req, res);
};
exports.getCustomerUploads = getCustomerUploads;
/**
 * ===========================================
 * GET DSA UPLOADS
 * ===========================================
 */
const getDsaUploads = async (req, res) => {
    return (0, exports.getUserUploads)(req, res);
};
exports.getDsaUploads = getDsaUploads;
/**
 * ===========================================
 * GET PARTNER UPLOADS
 * ===========================================
 */
const getPartnerUploads = async (req, res) => {
    return (0, exports.getUserUploads)(req, res);
};
exports.getPartnerUploads = getPartnerUploads;
/**
 * ===========================================
 * VERIFY DOCUMENT
 * ===========================================
 */
const verifyUploadedDocument = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { verifiedBy } = req.body;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const updated = await prisma_1.default.upload.update({
            where: {
                id: id,
            },
            data: {
                isVerified: true,
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
        return success(res, "Document verified successfully", updated);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.verifyUploadedDocument = verifyUploadedDocument;
/**
 * ===========================================
 * APPROVE DOCUMENT
 * ===========================================
 */
const approveUpload = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { approvedBy } = req.body;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const updated = await prisma_1.default.upload.update({
            where: {
                id: id,
            },
            data: {
                status: "APPROVED",
                isApproved: true,
                approvedBy,
                approvedAt: new Date(),
            },
        });
        return success(res, "Upload approved successfully", updated);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.approveUpload = approveUpload;
/**
 * ===========================================
 * REJECT DOCUMENT
 * ===========================================
 */
const rejectUpload = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const { rejectedBy, rejectReason, } = req.body;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const updated = await prisma_1.default.upload.update({
            where: {
                id: id,
            },
            data: {
                status: "REJECTED",
                rejectedBy,
                rejectedAt: new Date(),
                rejectReason,
            },
        });
        return success(res, "Upload rejected successfully", updated);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.rejectUpload = rejectUpload;
/**
 * ===========================================
 * REJECT VERIFIED DOCUMENT
 * (Alias for compatibility)
 * ===========================================
 */
exports.rejectUploadedDocument = exports.rejectUpload;
/**
 * ===========================================
 * DOWNLOAD FILE
 * ===========================================
 */
const downloadFile = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const filePath = upload.filePath ||
            path_1.default.join(UPLOAD_DIR, upload.fileName);
        if (!fs_1.default.existsSync(filePath)) {
            return failure(res, "File not found", 404);
        }
        return res.download(filePath, upload.originalName || upload.fileName);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.downloadFile = downloadFile;
/**
 * ===========================================
 * PREVIEW FILE
 * ===========================================
 */
const previewFile = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const filePath = upload.filePath ||
            path_1.default.join(UPLOAD_DIR, upload.fileName);
        if (!fs_1.default.existsSync(filePath)) {
            return failure(res, "File not found", 404);
        }
        if (upload.mimeType) {
            res.setHeader("Content-Type", upload.mimeType);
        }
        return res.sendFile(filePath);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.previewFile = previewFile;
/**
 * ===========================================
 * DELETE FILE (SOFT DELETE)
 * ===========================================
 */
const deleteFile = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const updated = await prisma_1.default.upload.update({
            where: {
                id: id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: "DELETED",
            },
        });
        return success(res, "File deleted successfully", updated);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.deleteFile = deleteFile;
/**
 * ===========================================
 * RESTORE FILE
 * ===========================================
 */
const restoreFile = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        const updated = await prisma_1.default.upload.update({
            where: {
                id: id,
            },
            data: {
                isDeleted: false,
                deletedAt: null,
                status: "ACTIVE",
            },
        });
        return success(res, "File restored successfully", updated);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.restoreFile = restoreFile;
/**
 * ===========================================
 * GET PENDING UPLOADS
 * ===========================================
 */
const getPendingUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                status: "PENDING",
                isDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "Pending uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getPendingUploads = getPendingUploads;
/**
 * ===========================================
 * GET APPROVED UPLOADS
 * ===========================================
 */
const getApprovedUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                status: "APPROVED",
                isDeleted: false,
            },
            orderBy: {
                approvedAt: "desc",
            },
        });
        return success(res, "Approved uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getApprovedUploads = getApprovedUploads;
const getRejectedUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                status: "REJECTED",
                isDeleted: false,
            },
            orderBy: {
                rejectedAt: "desc",
            },
        });
        return success(res, "Rejected uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getRejectedUploads = getRejectedUploads;
/**
 * ===========================================
 * GET EXPIRED UPLOADS
 * ===========================================
 */
const getExpiredUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                isExpired: true,
                isDeleted: false,
            },
            orderBy: {
                expiryDate: "asc",
            },
        });
        return success(res, "Expired uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getExpiredUploads = getExpiredUploads;
/**
 * ===========================================
 * GET RECENT UPLOADS
 * ===========================================
 */
const getRecentUploads = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });
        return success(res, "Recent uploads fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getRecentUploads = getRecentUploads;
/**
 * ===========================================
 * GET LARGE FILES
 * ===========================================
 */
const getLargeFiles = async (req, res) => {
    try {
        const minSize = Number(req.query.minSize) || 5 * 1024 * 1024;
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                fileSize: {
                    gte: minSize,
                },
                isDeleted: false,
            },
            orderBy: {
                fileSize: "desc",
            },
        });
        return success(res, "Large files fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getLargeFiles = getLargeFiles;
/**
 * ===========================================
 * UPLOAD DASHBOARD
 * ===========================================
 */
const getUploadDashboard = async (req, res) => {
    try {
        const [total, pending, approved, rejected, deleted, expired,] = await Promise.all([
            prisma_1.default.upload.count(),
            prisma_1.default.upload.count({ where: { status: "PENDING" } }),
            prisma_1.default.upload.count({ where: { status: "APPROVED" } }),
            prisma_1.default.upload.count({ where: { status: "REJECTED" } }),
            prisma_1.default.upload.count({ where: { isDeleted: true } }),
            prisma_1.default.upload.count({ where: { isExpired: true } }),
        ]);
        return success(res, "Dashboard fetched successfully", {
            total,
            pending,
            approved,
            rejected,
            deleted,
            expired,
        });
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getUploadDashboard = getUploadDashboard;
/**
 * ===========================================
 * UPLOAD ANALYTICS
 * ===========================================
 */
const getUploadAnalytics = async (req, res) => {
    try {
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
        const byCategory = uploads.reduce((acc, item) => {
            const key = item.category || "OTHER";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        return success(res, "Analytics fetched successfully", {
            totalFiles,
            totalStorage,
            byCategory,
        });
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getUploadAnalytics = getUploadAnalytics;
/**
 * ===========================================
 * STORAGE ANALYTICS
 * ===========================================
 */
const getStorageAnalytics = async (req, res) => {
    try {
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
        const averageSize = totalFiles === 0
            ? 0
            : Math.round(totalStorage / totalFiles);
        return success(res, "Storage analytics fetched successfully", {
            totalFiles,
            totalStorage,
            averageSize,
        });
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getStorageAnalytics = getStorageAnalytics;
/**
 * ===========================================
 * FILE TYPE ANALYTICS
 * ===========================================
 */
const getFileTypeAnalytics = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                isDeleted: false,
            },
            select: {
                extension: true,
            },
        });
        const analytics = uploads.reduce((acc, item) => {
            const ext = item.extension || "unknown";
            acc[ext] = (acc[ext] || 0) + 1;
            return acc;
        }, {});
        return success(res, "File type analytics fetched successfully", analytics);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getFileTypeAnalytics = getFileTypeAnalytics;
/**
 * ===========================================
 * SEARCH UPLOADS
 * ===========================================
 */
const searchUploads = async (req, res) => {
    try {
        const q = String(req.query.q || "");
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                OR: [
                    {
                        fileName: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        originalName: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        documentType: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "Search completed successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.searchUploads = searchUploads;
/**
 * ===========================================
 * EXPORT UPLOADS (EXCEL)
 * ===========================================
 */
const exportUploadsExcel = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "Excel export data fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.exportUploadsExcel = exportUploadsExcel;
/**
 * ===========================================
 * EXPORT UPLOADS (PDF)
 * ===========================================
 */
const exportUploadsPdf = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return success(res, "PDF export data fetched successfully", uploads);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.exportUploadsPdf = exportUploadsPdf;
/**
 * ===========================================
 * BULK APPROVE
 * ===========================================
 */
const bulkApproveUploads = async (req, res) => {
    try {
        const { ids, approvedBy } = req.body;
        const result = await prisma_1.default.upload.updateMany({
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
        return success(res, "Uploads approved successfully", result);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.bulkApproveUploads = bulkApproveUploads;
/**
 * ===========================================
 * BULK REJECT
 * ===========================================
 */
const bulkRejectUploads = async (req, res) => {
    try {
        const { ids, rejectedBy, rejectReason, } = req.body;
        const result = await prisma_1.default.upload.updateMany({
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
        return success(res, "Uploads rejected successfully", result);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.bulkRejectUploads = bulkRejectUploads;
/**
 * ===========================================
 * BULK DELETE
 * ===========================================
 */
const bulkDeleteUploads = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await prisma_1.default.upload.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: "DELETED",
            },
        });
        return success(res, "Uploads deleted successfully", result);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.bulkDeleteUploads = bulkDeleteUploads;
/**
 * ===========================================
 * UPLOAD AUDIT LOGS
 * ===========================================
 */
const getUploadAuditLogs = async (req, res) => {
    try {
        const logs = await prisma_1.default.upload.findMany({
            orderBy: {
                updatedAt: "desc",
            },
            select: {
                id: true,
                fileName: true,
                status: true,
                uploadedBy: true,
                approvedBy: true,
                rejectedBy: true,
                verifiedBy: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return success(res, "Audit logs fetched successfully", logs);
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.getUploadAuditLogs = getUploadAuditLogs;
/**
 * ===========================================
 * GENERATE UPLOAD URL
 * ===========================================
 */
const generateUploadUrl = async (req, res) => {
    try {
        const fileName = req.body.fileName ||
            generateFileName("upload.bin");
        return success(res, "Upload URL generated successfully", {
            uploadUrl: `/uploads/${fileName}`,
            fileName,
        });
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.generateUploadUrl = generateUploadUrl;
/**
 * ===========================================
 * GENERATE DOWNLOAD URL
 * ===========================================
 */
const generateDownloadUrl = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: id,
            },
        });
        if (!upload) {
            return failure(res, "Upload not found", 404);
        }
        return success(res, "Download URL generated successfully", {
            downloadUrl: upload.downloadUrl || upload.fileUrl,
        });
    }
    catch (error) {
        return failure(res, error);
    }
};
exports.generateDownloadUrl = generateDownloadUrl;
const getUserDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getUserDocuments = getUserDocuments;
const getAllDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getAllDocuments = getAllDocuments;
const updateDocument = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.updateDocument = updateDocument;
const searchDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.searchDocuments = searchDocuments;
const getPendingDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getPendingDocuments = getPendingDocuments;
const getVerifiedDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getVerifiedDocuments = getVerifiedDocuments;
const getRejectedDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getRejectedDocuments = getRejectedDocuments;
const getDocumentsByType = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getDocumentsByType = getDocumentsByType;
const downloadDocument = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.downloadDocument = downloadDocument;
const getDocumentDashboard = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getDocumentDashboard = getDocumentDashboard;
const getRecentDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.getRecentDocuments = getRecentDocuments;
const bulkVerifyDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.bulkVerifyDocuments = bulkVerifyDocuments;
const bulkRejectDocuments = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.bulkRejectDocuments = bulkRejectDocuments;
const exportDocumentsExcel = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.exportDocumentsExcel = exportDocumentsExcel;
const exportDocumentsPdf = async (req, res) => {
    return res.status(501).json({ message: "Not implemented" });
};
exports.exportDocumentsPdf = exportDocumentsPdf;
