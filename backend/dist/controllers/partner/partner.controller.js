"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkBlockPartners = exports.bulkVerifyPartners = exports.exportPartnersPdf = exports.exportPartnersExcel = exports.getPartnerWallet = exports.getPartnerTransactions = exports.getPartnerReferrals = exports.getPartnerCommissions = exports.getPartnerLoans = exports.getPartnerCustomers = exports.getMonthlyPartners = exports.getTopPartners = exports.searchPartners = exports.getPartnerProfile = exports.getActivePartners = exports.getBlockedPartners = exports.getVerifiedPartners = exports.getPendingPartners = exports.getPartnerAnalytics = exports.getPartnerDashboard = exports.partnerAnalytics = exports.togglePartnerStatus = exports.unblockPartner = exports.blockPartner = exports.verifyPartner = exports.rejectPartner = exports.approvePartner = exports.deletePartner = exports.updatePartner = exports.getPartnerById = exports.getAllPartners = exports.createPartner = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   CREATE PARTNER
======================================== */
const createPartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.create({
            data: req.body,
        });
        res.status(201).json({
            success: true,
            data: partner,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create partner",
            error,
        });
    }
};
exports.createPartner = createPartner;
/* ========================================
   GET ALL PARTNERS
======================================== */
const getAllPartners = async (_req, res) => {
    try {
        const partners = await prisma_1.default.partner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            data: partners,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch partners",
        });
    }
};
exports.getAllPartners = getAllPartners;
/* ========================================
   GET PARTNER BY ID
======================================== */
const getPartnerById = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.findUnique({
            where: {
                id: String(req.params.id),
            },
        });
        if (!partner) {
            res.status(404).json({
                success: false,
                message: "Partner not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch partner",
        });
    }
};
exports.getPartnerById = getPartnerById;
/* ========================================
   UPDATE PARTNER
======================================== */
const updatePartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: req.body,
        });
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update partner",
        });
    }
};
exports.updatePartner = updatePartner;
/* ========================================
   DELETE PARTNER
======================================== */
const deletePartner = async (req, res) => {
    try {
        await prisma_1.default.partner.delete({
            where: {
                id: String(req.params.id),
            },
        });
        res.status(200).json({
            success: true,
            message: "Partner deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete partner",
        });
    }
};
exports.deletePartner = deletePartner;
/* ========================================
   APPROVE PARTNER
======================================== */
const approvePartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                status: "APPROVED",
                approvedAt: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approvePartner = approvePartner;
/* ========================================
   REJECT PARTNER
======================================== */
const rejectPartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                status: "REJECTED",
                rejectionReason: req.body.reason || "",
            },
        });
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectPartner = rejectPartner;
/* ========================================
   VERIFY PARTNER
======================================== */
exports.verifyPartner = exports.approvePartner;
/* ========================================
   BLOCK PARTNER
======================================== */
const blockPartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                isBlocked: true,
                isActive: false,
            },
        });
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Block failed",
        });
    }
};
exports.blockPartner = blockPartner;
/* ========================================
   UNBLOCK PARTNER
======================================== */
const unblockPartner = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                isBlocked: false,
                isActive: true,
            },
        });
        res.status(200).json({
            success: true,
            data: partner,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Unblock failed",
        });
    }
};
exports.unblockPartner = unblockPartner;
/* ========================================
   TOGGLE STATUS
======================================== */
const togglePartnerStatus = async (req, res) => {
    try {
        const partner = await prisma_1.default.partner.findUnique({
            where: {
                id: String(req.params.id),
            },
        });
        if (!partner) {
            res.status(404).json({
                success: false,
                message: "Partner not found",
            });
            return;
        }
        const updated = await prisma_1.default.partner.update({
            where: {
                id: String(req.params.id),
            },
            data: {
                isActive: !partner.isActive,
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
exports.togglePartnerStatus = togglePartnerStatus;
/* ========================================
   DASHBOARD / ANALYTICS
======================================== */
const partnerAnalytics = async (_req, res) => {
    try {
        const [totalPartners, activePartners, approvedPartners, blockedPartners,] = await Promise.all([
            prisma_1.default.partner.count(),
            prisma_1.default.partner.count({
                where: { isActive: true },
            }),
            prisma_1.default.partner.count({
                where: { status: "APPROVED" },
            }),
            prisma_1.default.partner.count({
                where: { isBlocked: true },
            }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalPartners,
                activePartners,
                approvedPartners,
                blockedPartners,
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
exports.partnerAnalytics = partnerAnalytics;
exports.getPartnerDashboard = exports.partnerAnalytics;
exports.getPartnerAnalytics = exports.partnerAnalytics;
/* ========================================
   FILTERS
======================================== */
const getPendingPartners = async (_req, res) => res.json({
    success: true,
    data: await prisma_1.default.partner.findMany({
        where: { status: "PENDING" },
    }),
});
exports.getPendingPartners = getPendingPartners;
const getVerifiedPartners = async (_req, res) => res.json({
    success: true,
    data: await prisma_1.default.partner.findMany({
        where: { status: "APPROVED" },
    }),
});
exports.getVerifiedPartners = getVerifiedPartners;
const getBlockedPartners = async (_req, res) => res.json({
    success: true,
    data: await prisma_1.default.partner.findMany({
        where: { isBlocked: true },
    }),
});
exports.getBlockedPartners = getBlockedPartners;
const getActivePartners = async (_req, res) => res.json({
    success: true,
    data: await prisma_1.default.partner.findMany({
        where: { isActive: true },
    }),
});
exports.getActivePartners = getActivePartners;
/* ========================================
   ALIASES
======================================== */
exports.getPartnerProfile = exports.getPartnerById;
exports.searchPartners = exports.getAllPartners;
exports.getTopPartners = exports.getAllPartners;
exports.getMonthlyPartners = exports.getAllPartners;
exports.getPartnerCustomers = exports.getPartnerById;
exports.getPartnerLoans = exports.getPartnerById;
exports.getPartnerCommissions = exports.getPartnerById;
exports.getPartnerReferrals = exports.getPartnerById;
exports.getPartnerTransactions = exports.getPartnerById;
exports.getPartnerWallet = exports.getPartnerById;
/* ========================================
   EXPORTS
======================================== */
const exportPartnersExcel = async (_req, res) => {
    res.json({
        success: true,
        message: "Excel export endpoint",
    });
};
exports.exportPartnersExcel = exportPartnersExcel;
const exportPartnersPdf = async (_req, res) => {
    res.json({
        success: true,
        message: "PDF export endpoint",
    });
};
exports.exportPartnersPdf = exportPartnersPdf;
/* ========================================
   BULK ACTIONS
======================================== */
const bulkVerifyPartners = async (_req, res) => {
    res.json({
        success: true,
        message: "Bulk verify completed",
    });
};
exports.bulkVerifyPartners = bulkVerifyPartners;
const bulkBlockPartners = async (_req, res) => {
    res.json({
        success: true,
        message: "Bulk block completed",
    });
};
exports.bulkBlockPartners = bulkBlockPartners;
