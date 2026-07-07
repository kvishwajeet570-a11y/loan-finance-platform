"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKYCAnalytics = exports.rejectKYC = exports.approveKYC = exports.submitKYC = exports.getKYCById = exports.getKYCs = void 0;
const kyc_service_1 = __importDefault(require("../../services/kyc/kyc.service"));
const getKYCs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const status = String(req.query.status || "");
        const search = String(req.query.search || "");
        const result = await kyc_service_1.default.getKYCs({
            page,
            limit,
            status,
            search,
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
const getKYCById = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.getKYCById(req.params.id);
        if (!kyc) {
            return void res.status(404).json({
                success: false,
                message: "KYC not found",
            });
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
const submitKYC = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.submitKYC({
            ...req.body,
            documents: req.files,
        });
        res.status(201).json({
            success: true,
            message: "KYC submitted successfully",
            data: kyc,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.submitKYC = submitKYC;
const approveKYC = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.approveKYC(req.params.id);
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
const rejectKYC = async (req, res) => {
    try {
        const kyc = await kyc_service_1.default.rejectKYC(req.params.id, req.body.reason);
        res.status(200).json({
            success: true,
            message: "KYC rejected",
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
