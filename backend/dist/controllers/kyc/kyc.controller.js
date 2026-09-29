"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKycById = exports.getAllKycs = exports.bulkRejectKycs = exports.bulkApproveKycs = exports.exportKycPdf = exports.exportKycExcel = exports.getExpiringKycs = exports.getRecentKycs = exports.searchKyc = exports.verifyBank = exports.verifyPan = exports.verifyAadhaar = exports.getKycDashboard = exports.getKycAnalytics = exports.getKYCAnalytics = exports.getUnderReviewKycs = exports.getRejectedKycs = exports.getApprovedKycs = exports.getPendingKycs = exports.getUserKyc = exports.rejectKyc = exports.rejectKYC = exports.approveKyc = exports.approveKYC = exports.deleteKyc = exports.updateKyc = exports.submitKyc = exports.createKyc = exports.submitKYC = exports.getKYCById = exports.getKYCs = void 0;
const kyc_service_1 = __importDefault(require("../../services/kyc/kyc.service"));
/* ========================================
   GET ALL KYCS
======================================== */
const getKYCs = async (req, res) => {
    try {
        const result = await kyc_service_1.default.getAllKYC({
            page: Number(req.query.page || 1),
            limit: Number(req.query.limit || 10),
            status: String(req.query.status || ""),
            search: String(req.query.search || ""),
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch KYC records",
        });
    }
};
exports.getKYCs = getKYCs;
/* ========================================
   GET KYC BY ID
======================================== */
const getKYCById = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.getKYCById(String(req.params.id));
        if (!kyc) {
            res.status(404).json({
                success: false,
                message: "KYC not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: kyc,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch KYC",
        });
    }
};
exports.getKYCById = getKYCById;
/* ========================================
   CREATE / SUBMIT KYC
======================================== */
const submitKYC = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.submitKYC(req.body);
        res.status(201).json({
            success: true,
            message: "KYC submitted successfully",
            data: kyc,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error?.message ||
                "Failed to submit KYC",
        });
    }
};
exports.submitKYC = submitKYC;
exports.createKyc = exports.submitKYC;
exports.submitKyc = exports.submitKYC;
/* ========================================
   UPDATE KYC
======================================== */
const updateKyc = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.updateKYC(String(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "KYC updated successfully",
            data: kyc,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update KYC",
        });
    }
};
exports.updateKyc = updateKyc;
/* ========================================
   DELETE KYC
======================================== */
const deleteKyc = async (req, res) => {
    try {
        await kyc_service_1.default.deleteKYC(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "KYC deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete KYC",
        });
    }
};
exports.deleteKyc = deleteKyc;
/* ========================================
   APPROVE KYC
======================================== */
const approveKYC = async (req, res) => {
    try {
        const adminId = String(req.body.adminId || "SYSTEM");
        const kyc = await kyc_service_1.default.approveKYC(String(req.params.id), adminId);
        res.status(200).json({
            success: true,
            message: "KYC approved successfully",
            data: kyc,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approveKYC = approveKYC;
exports.approveKyc = exports.approveKYC;
/* ========================================
   REJECT KYC
======================================== */
const rejectKYC = async (req, res) => {
    try {
        const reason = String(req.body.reason || "");
        const adminId = String(req.body.adminId || "SYSTEM");
        const kyc = await kyc_service_1.default.rejectKYC(String(req.params.id), reason, adminId);
        res.status(200).json({
            success: true,
            message: "KYC rejected successfully",
            data: kyc,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectKYC = rejectKYC;
exports.rejectKyc = exports.rejectKYC;
/* ========================================
   USER KYC
======================================== */
const getUserKyc = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.getUserKYC(String(req.params.userId));
        res.status(200).json({
            success: true,
            data: kyc,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user KYC",
        });
    }
};
exports.getUserKyc = getUserKyc;
/* ========================================
   STATUS LISTS
======================================== */
const getPendingKycs = async (req, res) => {
    try {
        const data = await kyc_service_1.default.getPendingKYC();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getPendingKycs = getPendingKycs;
const getApprovedKycs = async (req, res) => {
    try {
        const data = await kyc_service_1.default.getApprovedKYC();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getApprovedKycs = getApprovedKycs;
const getRejectedKycs = async (req, res) => {
    try {
        const data = await kyc_service_1.default.getRejectedKYC();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getRejectedKycs = getRejectedKycs;
const getUnderReviewKycs = async (req, res) => {
    try {
        const data = await kyc_service_1.default.getUnderReviewKYC();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getUnderReviewKycs = getUnderReviewKycs;
/* ========================================
   ANALYTICS
======================================== */
const getKYCAnalytics = async (req, res) => {
    try {
        const analytics = await kyc_service_1.default.getAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.getKYCAnalytics = getKYCAnalytics;
exports.getKycAnalytics = exports.getKYCAnalytics;
exports.getKycDashboard = exports.getKYCAnalytics;
/* ========================================
   PLACEHOLDERS
======================================== */
const verifyAadhaar = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Aadhaar verification pending",
    });
};
exports.verifyAadhaar = verifyAadhaar;
const verifyPan = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "PAN verification pending",
    });
};
exports.verifyPan = verifyPan;
const verifyBank = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bank verification pending",
    });
};
exports.verifyBank = verifyBank;
exports.searchKyc = exports.getKYCs;
exports.getRecentKycs = exports.getKYCs;
exports.getExpiringKycs = exports.getKYCs;
const exportKycExcel = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Excel export pending",
    });
};
exports.exportKycExcel = exportKycExcel;
const exportKycPdf = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "PDF export pending",
    });
};
exports.exportKycPdf = exportKycPdf;
const bulkApproveKycs = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bulk approve pending",
    });
};
exports.bulkApproveKycs = bulkApproveKycs;
const bulkRejectKycs = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bulk reject pending",
    });
};
exports.bulkRejectKycs = bulkRejectKycs;
exports.getAllKycs = exports.getKYCs;
exports.getKycById = exports.getKYCById;
