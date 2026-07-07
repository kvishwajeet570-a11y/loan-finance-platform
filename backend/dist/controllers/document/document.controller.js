"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentAnalytics = exports.deleteDocument = exports.rejectDocument = exports.verifyDocument = exports.uploadDocument = exports.getDocumentById = exports.getDocuments = void 0;
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
        const document = await document_service_1.default.getDocumentById(req.params.id);
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
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch document",
        });
    }
};
exports.getDocumentById = getDocumentById;
const uploadDocument = async (req, res) => {
    try {
        const document = await document_service_1.default.uploadDocument({
            ...req.body,
            file: req.file,
        });
        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            data: document,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.uploadDocument = uploadDocument;
const verifyDocument = async (req, res) => {
    try {
        const document = await document_service_1.default.verifyDocument(req.params.id);
        res.status(200).json({
            success: true,
            message: "Document verified successfully",
            data: document,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    }
};
exports.verifyDocument = verifyDocument;
const rejectDocument = async (req, res) => {
    try {
        const document = await document_service_1.default.rejectDocument(req.params.id, req.body.reason);
        res.status(200).json({
            success: true,
            message: "Document rejected",
            data: document,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectDocument = rejectDocument;
const deleteDocument = async (req, res) => {
    try {
        await document_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteDocument = deleteDocument;
const getDocumentAnalytics = async (req, res) => {
    try {
        const analytics = await document_service_1.default.getAnalytics();
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
exports.getDocumentAnalytics = getDocumentAnalytics;
