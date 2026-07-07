"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaAnalytics = exports.toggleMediaStatus = exports.deleteMedia = exports.getMediaById = exports.getAllMedia = exports.uploadMedia = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const uploadMedia = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File is required",
            });
        }
        const media = await prisma_1.default.media.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                fileUrl: `/uploads/${file.filename}`,
                fileType: file.mimetype.split("/")[0],
                mimeType: file.mimetype,
                fileSize: file.size,
                category: req.body.category,
                uploadedBy: req.user?.id,
            },
        });
        res.status(201).json({
            success: true,
            data: media,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};
exports.uploadMedia = uploadMedia;
const getAllMedia = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page - 1) * limit;
        const [media, total] = await Promise.all([
            prisma_1.default.media.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.media.count(),
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: media,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch media",
        });
    }
};
exports.getAllMedia = getAllMedia;
const getMediaById = async (req, res) => {
    try {
        const media = await prisma_1.default.media.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Media not found",
            });
        }
        res.status(200).json({
            success: true,
            data: media,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed",
        });
    }
};
exports.getMediaById = getMediaById;
const deleteMedia = async (req, res) => {
    try {
        await prisma_1.default.media.delete({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Media deleted",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteMedia = deleteMedia;
const toggleMediaStatus = async (req, res) => {
    try {
        const media = await prisma_1.default.media.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!media) {
            return res.status(404).json({
                success: false,
                message: "Media not found",
            });
        }
        const updated = await prisma_1.default.media.update({
            where: {
                id: req.params.id,
            },
            data: {
                isActive: !media.isActive,
            },
        });
        res.status(200).json({
            success: true,
            data: updated,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed",
        });
    }
};
exports.toggleMediaStatus = toggleMediaStatus;
const getMediaAnalytics = async (req, res) => {
    try {
        const totalFiles = await prisma_1.default.media.count();
        const activeFiles = await prisma_1.default.media.count({
            where: {
                isActive: true,
            },
        });
        const imageFiles = await prisma_1.default.media.count({
            where: {
                fileType: "image",
            },
        });
        const documentFiles = await prisma_1.default.media.count({
            where: {
                fileType: "application",
            },
        });
        res.status(200).json({
            success: true,
            data: {
                totalFiles,
                activeFiles,
                imageFiles,
                documentFiles,
            },
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.getMediaAnalytics = getMediaAnalytics;
