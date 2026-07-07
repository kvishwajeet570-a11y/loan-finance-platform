"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAnalytics = exports.deleteUpload = exports.verifyUpload = exports.getUploadById = exports.getUserUploads = exports.getAllUploads = exports.uploadFile = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * UPLOAD FILE
 */
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "File required",
            });
            return;
        }
        const upload = await prisma_1.default.upload.create({
            data: {
                userId: req.body.userId,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileUrl: `/uploads/${req.file.filename}`,
                fileType: req.body.category,
                category: req.body.category,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
            },
        });
        res.status(201).json({
            success: true,
            data: upload,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Upload failed",
            error,
        });
    }
};
exports.uploadFile = uploadFile;
/**
 * GET ALL FILES
 */
const getAllUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            count: uploads.length,
            data: uploads,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getAllUploads = getAllUploads;
/**
 * GET USER FILES
 */
const getUserUploads = async (req, res) => {
    try {
        const uploads = await prisma_1.default.upload.findMany({
            where: {
                userId: req.params.userId,
            },
        });
        res.status(200).json({
            success: true,
            data: uploads,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getUserUploads = getUserUploads;
/**
 * GET SINGLE FILE
 */
const getUploadById = async (req, res) => {
    try {
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!upload) {
            res.status(404).json({
                success: false,
                message: "File not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: upload,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getUploadById = getUploadById;
/**
 * VERIFY FILE
 */
const verifyUpload = async (req, res) => {
    try {
        const upload = await prisma_1.default.upload.update({
            where: {
                id: req.params.id,
            },
            data: {
                isVerified: true,
            },
        });
        res.status(200).json({
            success: true,
            data: upload,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.verifyUpload = verifyUpload;
/**
 * DELETE FILE
 */
const deleteUpload = async (req, res) => {
    try {
        await prisma_1.default.upload.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.deleteUpload = deleteUpload;
/**
 * UPLOAD ANALYTICS
 */
const uploadAnalytics = async (req, res) => {
    try {
        const [totalFiles, verifiedFiles, pendingFiles,] = await Promise.all([
            prisma_1.default.upload.count(),
            prisma_1.default.upload.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.upload.count({
                where: {
                    isVerified: false,
                },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalFiles,
                verifiedFiles,
                pendingFiles,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.uploadAnalytics = uploadAnalytics;
