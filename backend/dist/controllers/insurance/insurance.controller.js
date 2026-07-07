"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsuranceAnalytics = exports.renewPolicy = exports.rejectPolicy = exports.approvePolicy = exports.createPolicy = exports.getPolicyById = exports.getPolicies = void 0;
const insurance_service_1 = __importDefault(require("../../services/insurance/insurance.service"));
const getPolicies = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const type = String(req.query.type || "");
        const result = await insurance_service_1.default.getPolicies({
            page,
            limit,
            search,
            type,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch policies",
        });
    }
};
exports.getPolicies = getPolicies;
const getPolicyById = async (req, res) => {
    try {
        const policy = await insurance_service_1.default.getPolicyById(req.params.id);
        if (!policy) {
            return void res.status(404).json({
                success: false,
                message: "Policy not found",
            });
        }
        res.status(200).json({
            success: true,
            data: policy,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch policy",
        });
    }
};
exports.getPolicyById = getPolicyById;
const createPolicy = async (req, res) => {
    try {
        const policy = await insurance_service_1.default.createPolicy(req.body);
        res.status(201).json({
            success: true,
            message: "Policy created successfully",
            data: policy,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createPolicy = createPolicy;
const approvePolicy = async (req, res) => {
    try {
        const policy = await insurance_service_1.default.approvePolicy(req.params.id);
        res.status(200).json({
            success: true,
            message: "Policy approved successfully",
            data: policy,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approvePolicy = approvePolicy;
const rejectPolicy = async (req, res) => {
    try {
        const policy = await insurance_service_1.default.rejectPolicy(req.params.id, req.body.reason);
        res.status(200).json({
            success: true,
            message: "Policy rejected",
            data: policy,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectPolicy = rejectPolicy;
const renewPolicy = async (req, res) => {
    try {
        const policy = await insurance_service_1.default.renewPolicy(req.params.id);
        res.status(200).json({
            success: true,
            message: "Policy renewed successfully",
            data: policy,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Renewal failed",
        });
    }
};
exports.renewPolicy = renewPolicy;
const getInsuranceAnalytics = async (req, res) => {
    try {
        const analytics = await insurance_service_1.default.getAnalytics();
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
exports.getInsuranceAnalytics = getInsuranceAnalytics;
