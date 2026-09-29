"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDocumentsPdf = exports.exportDocumentsExcel = exports.bulkRejectDocuments = exports.bulkVerifyDocuments = exports.getExpiredDocuments = exports.getRecentDocuments = exports.getDocumentDashboard = exports.downloadDocument = exports.getDocumentsByType = exports.getRejectedDocuments = exports.getVerifiedDocuments = exports.getPendingDocuments = exports.searchDocuments = exports.updateDocument = exports.getAllDocuments = exports.getUserDocuments = exports.getDocumentAnalytics = exports.deleteDocument = exports.rejectDocument = exports.verifyDocument = exports.uploadDocument = exports.getDocumentById = exports.getDocuments = void 0;
const document_service_1 = __importDefault(require("../../services/document/document.service"));
const getDocuments = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const status = String(req.query.status || "");
        const result = await document_service_1.default.getDocuments({
            page,
            limit,
            search,
            status,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch documents",
        });
    }
};
exports.getDocuments = getDocuments;
const getDocumentById = async (req, res) => {
    try {
        const document = await document_service_1.default.getDocumentById(String(req.params.id));
        if (!document) {
            return void res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }
        res.status(200).json({
            success: true,
            data: document,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch document",
        });
    }
};
exports.getDocumentById = getDocumentById;
const uploadDocument = async (req, res) => {
    try {
        const file = req.file;
        const document = await document_service_1.default.uploadDocument({
            userId: req.body.userId,
            loanId: req.body.loanId,
            documentType: req.body.documentType,
            documentName: req.body.documentName,
            fileUrl: file?.path || "",
            fileSize: file?.size || 0,
            mimeType: file?.mimetype || "",
        });
        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            data: document,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message ||
                "Document upload failed",
        });
    }
};
exports.uploadDocument = uploadDocument;
const verifyDocument = async (req, res) => {
    try {
        const document = await document_service_1.default.verifyDocument(String(req.params.id), "SYSTEM");
        res.status(200).json({
            success: true,
            message: "Document verified successfully",
            data: document,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    }
};
exports.verifyDocument = verifyDocument;
const rejectDocument = async (req, res) => {
    try {
        const document = await document_service_1.default.rejectDocument(String(req.params.id), req.body.reason);
        res.status(200).json({
            success: true,
            message: "Document rejected",
            data: document,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectDocument = rejectDocument;
const deleteDocument = async (req, res) => {
    try {
        await document_service_1.default.deleteDocument(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteDocument = deleteDocument;
const getDocumentAnalytics = async (req, res) => {
    try {
        const analytics = await document_service_1.default.getDocumentStats();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Analytics failed",
        });
    }
};
exports.getDocumentAnalytics = getDocumentAnalytics;
const getUserDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getUserDocuments not implemented" });
};
exports.getUserDocuments = getUserDocuments;
const getAllDocuments = async (req, res) => {
    return (0, exports.getDocuments)(req, res);
};
exports.getAllDocuments = getAllDocuments;
const updateDocument = async (req, res) => {
    res.status(501).json({ success: false, message: "updateDocument not implemented" });
};
exports.updateDocument = updateDocument;
const searchDocuments = async (req, res) => {
    return (0, exports.getDocuments)(req, res);
};
exports.searchDocuments = searchDocuments;
const getPendingDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getPendingDocuments not implemented" });
};
exports.getPendingDocuments = getPendingDocuments;
const getVerifiedDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getVerifiedDocuments not implemented" });
};
exports.getVerifiedDocuments = getVerifiedDocuments;
const getRejectedDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getRejectedDocuments not implemented" });
};
exports.getRejectedDocuments = getRejectedDocuments;
const getDocumentsByType = async (req, res) => {
    res.status(501).json({ success: false, message: "getDocumentsByType not implemented" });
};
exports.getDocumentsByType = getDocumentsByType;
const downloadDocument = async (req, res) => {
    res.status(501).json({ success: false, message: "downloadDocument not implemented" });
};
exports.downloadDocument = downloadDocument;
const getDocumentDashboard = async (req, res) => {
    res.status(501).json({ success: false, message: "getDocumentDashboard not implemented" });
};
exports.getDocumentDashboard = getDocumentDashboard;
const getRecentDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getRecentDocuments not implemented" });
};
exports.getRecentDocuments = getRecentDocuments;
const getExpiredDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "getExpiredDocuments not implemented" });
};
exports.getExpiredDocuments = getExpiredDocuments;
const bulkVerifyDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "bulkVerifyDocuments not implemented" });
};
exports.bulkVerifyDocuments = bulkVerifyDocuments;
const bulkRejectDocuments = async (req, res) => {
    res.status(501).json({ success: false, message: "bulkRejectDocuments not implemented" });
};
exports.bulkRejectDocuments = bulkRejectDocuments;
const exportDocumentsExcel = async (req, res) => {
    res.status(501).json({ success: false, message: "exportDocumentsExcel not implemented" });
};
exports.exportDocumentsExcel = exportDocumentsExcel;
const exportDocumentsPdf = async (req, res) => {
    res.status(501).json({ success: false, message: "exportDocumentsPdf not implemented" });
};
exports.exportDocumentsPdf = exportDocumentsPdf;
