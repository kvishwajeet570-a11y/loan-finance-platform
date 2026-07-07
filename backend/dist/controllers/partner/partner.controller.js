"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerAnalytics = exports.togglePartnerStatus = exports.rejectPartner = exports.approvePartner = exports.getPartnerById = exports.getAllPartners = exports.createPartner = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
/**
 * CREATE PARTNER
 */
const createPartner = async (req, res) => {
    try {
        const exists = await prisma_1.default.partner.findFirst({
            where: {
                OR: [
                    { email: req.body.email },
                    { partnerCode: req.body.partnerCode }
                ]
            }
        });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Partner already exists"
            });
            return;
        }
        const partner = await prisma_1.default.partner.create({
            data: req.body
        });
        res.status(201).json({
            success: true,
            data: partner
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create partner"
        });
    }
};
exports.createPartner = createPartner;
/**
 * GET ALL PARTNERS
 */
const getAllPartners = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const search = String(req.query.search || "");
        const skip = (page - 1) * limit;
        const where = {
            OR: [
                {
                    companyName: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    contactPerson: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        };
        const [partners, total] = await Promise.all([
            prisma_1.default.partner.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma_1.default.partner.count({ where })
        ]);
        res.status(200).json({
            success: true,
            total,
            page,
            data: partners
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch partners"
        });
    }
};
exports.getAllPartners = getAllPartners;
/**
 * GET SINGLE PARTNER
 */
const getPartnerById = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!partner) {
            res.status(404).json({
                success: false,
                message: "Partner not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: partner
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed"
        });
    }
};
exports.getPartnerById = getPartnerById;
/**
 * APPROVE PARTNER
 */
const approvePartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: req.params.id
            },
            data: {
                status: "APPROVED",
                approvedBy: req.user?.id,
                approvedAt: new Date()
            }
        });
        res.status(200).json({
            success: true,
            message: "Partner approved",
            data: partner
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed"
        });
    }
};
exports.approvePartner = approvePartner;
/**
 * REJECT PARTNER
 */
const rejectPartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: req.params.id
            },
            data: {
                status: "REJECTED",
                remarks: req.body.remarks
            }
        });
        res.status(200).json({
            success: true,
            data: partner
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed"
        });
    }
};
exports.rejectPartner = rejectPartner;
/**
 * BLOCK / UNBLOCK
 */
const togglePartnerStatus = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.findUnique({
            where: { id: req.params.id }
        });
        if (!partner) {
            res.status(404).json({
                success: false,
                message: "Partner not found"
            });
            return;
        }
        const updated = await prisma_1.default.partner.update({
            where: { id: req.params.id },
            data: {
                isActive: !partner.isActive
            }
        });
        res.status(200).json({
            success: true,
            data: updated
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};
exports.togglePartnerStatus = togglePartnerStatus;
/**
 * ANALYTICS
 */
const partnerAnalytics = async (req, res) => {
    try {
        const [totalPartners, activePartners, approvedPartners, pendingPartners] = await Promise.all([
            prisma_1.default.partner.count(),
            prisma_1.default.partner.count({
                where: { isActive: true }
            }),
            prisma_1.default.partner.count({
                where: { status: "APPROVED" }
            }),
            prisma_1.default.partner.count({
                where: { status: "PENDING" }
            })
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalPartners,
                activePartners,
                approvedPartners,
                pendingPartners
            }
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed"
        });
    }
};
exports.partnerAnalytics = partnerAnalytics;
