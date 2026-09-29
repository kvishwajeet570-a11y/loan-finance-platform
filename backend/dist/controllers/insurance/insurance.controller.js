"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsuranceAnalytics = exports.rejectClaim = exports.approveClaim = exports.getPolicyClaims = exports.createClaim = exports.getUserPolicies = exports.rejectInsurance = exports.approveInsurance = exports.deleteInsurance = exports.updateInsurance = exports.getInsuranceById = exports.getAllInsurances = exports.createInsurance = void 0;
const insurance_service_1 = __importDefault(require("../../services/insurance/insurance.service"));
/* =========================================
   INSURANCE POLICY CRUD
========================================= */
const createInsurance = async (req, res) => {
    try {
        const insurance = await insurance_service_1.default.createInsurance(req.body);
        res.status(201).json({
            success: true,
            message: "Insurance policy created successfully",
            data: insurance,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error?.message || "Failed to create insurance",
        });
    }
};
exports.createInsurance = createInsurance;
const getAllInsurances = async (req, res) => {
    try {
        const result = await insurance_service_1.default.getInsurances({
            page: Number(req.query.page || 1),
            limit: Number(req.query.limit || 10),
            search: String(req.query.search || ""),
            type: String(req.query.type || ""),
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch insurances",
        });
    }
};
exports.getAllInsurances = getAllInsurances;
const getInsuranceById = async (req, res) => {
    try {
        const insurance = await insurance_service_1.default.getInsuranceById(String(req.params.id));
        if (!insurance) {
            return void res.status(404).json({
                success: false,
                message: "Insurance not found",
            });
        }
        res.status(200).json({
            success: true,
            data: insurance,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch insurance",
        });
    }
};
exports.getInsuranceById = getInsuranceById;
const updateInsurance = async (req, res) => {
    try {
        const insurance = await insurance_service_1.default.updateInsurance(String(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "Insurance updated successfully",
            data: insurance,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to update insurance",
        });
    }
};
exports.updateInsurance = updateInsurance;
const deleteInsurance = async (req, res) => {
    try {
        await insurance_service_1.default.deleteInsurance(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Insurance deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to delete insurance",
        });
    }
};
exports.deleteInsurance = deleteInsurance;
/* =========================================
   APPLICATIONS
========================================= */
const approveInsurance = async (req, res) => {
    try {
        const result = await insurance_service_1.default.approveInsurance(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Application approved",
            data: result,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approveInsurance = approveInsurance;
const rejectInsurance = async (req, res) => {
    try {
        const result = await insurance_service_1.default.rejectInsurance(String(req.params.id), req.body.reason);
        res.status(200).json({
            success: true,
            message: "Application rejected",
            data: result,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectInsurance = rejectInsurance;
const getUserPolicies = async (req, res) => {
    try {
        const policies = await insurance_service_1.default.getUserPolicies(String(req.params.userId));
        res.status(200).json({
            success: true,
            data: policies,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch policies",
        });
    }
};
exports.getUserPolicies = getUserPolicies;
/* =========================================
   CLAIMS
========================================= */
const createClaim = async (req, res) => {
    try {
        const claim = await insurance_service_1.default.createClaim({
            applicationId: String(req.params.id),
            ...req.body,
        });
        res.status(201).json({
            success: true,
            message: "Claim created successfully",
            data: claim,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to create claim",
        });
    }
};
exports.createClaim = createClaim;
const getPolicyClaims = async (req, res) => {
    try {
        const claims = await insurance_service_1.default.getPolicyClaims(String(req.params.id));
        res.status(200).json({
            success: true,
            data: claims,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch claims",
        });
    }
};
exports.getPolicyClaims = getPolicyClaims;
const approveClaim = async (req, res) => {
    try {
        const claim = await insurance_service_1.default.approveClaim(String(req.params.claimId));
        res.status(200).json({
            success: true,
            data: claim,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Claim approval failed",
        });
    }
};
exports.approveClaim = approveClaim;
const rejectClaim = async (req, res) => {
    try {
        const claim = await insurance_service_1.default.rejectClaim(String(req.params.claimId), req.body.reason);
        res.status(200).json({
            success: true,
            data: claim,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Claim rejection failed",
        });
    }
};
exports.rejectClaim = rejectClaim;
/* =========================================
   ANALYTICS
========================================= */
const getInsuranceAnalytics = async (req, res) => {
    try {
        const analytics = await insurance_service_1.default.getInsuranceAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getInsuranceAnalytics = getInsuranceAnalytics;
