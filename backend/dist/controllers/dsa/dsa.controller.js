"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDSAAnalytics = exports.blockDSA = exports.rejectDSA = exports.approveDSA = exports.createDSA = exports.getDSAById = exports.getDSAs = void 0;
const dsa_service_1 = __importDefault(require("../../services/dsa/dsa.service"));
const getDSAs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const result = await dsa_service_1.default.getDSAs({
            page,
            limit,
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
            message: "Failed to fetch DSAs",
        });
    }
};
exports.getDSAs = getDSAs;
const getDSAById = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.getDSAById(req.params.id);
        if (!dsa) {
            return void res.status(404).json({
                success: false,
                message: "DSA not found",
            });
        }
        res.status(200).json({
            success: true,
            data: dsa,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch DSA",
        });
    }
};
exports.getDSAById = getDSAById;
const createDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.createDSA(req.body);
        res.status(201).json({
            success: true,
            message: "DSA created successfully",
            data: dsa,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createDSA = createDSA;
const approveDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.approveDSA(req.params.id);
        res.status(200).json({
            success: true,
            message: "DSA approved successfully",
            data: dsa,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approveDSA = approveDSA;
const rejectDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.rejectDSA(req.params.id, req.body.reason);
        res.status(200).json({
            success: true,
            message: "DSA rejected",
            data: dsa,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Rejection failed",
        });
    }
};
exports.rejectDSA = rejectDSA;
const blockDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.blockDSA(req.params.id);
        res.status(200).json({
            success: true,
            message: "DSA blocked successfully",
            data: dsa,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Block failed",
        });
    }
};
exports.blockDSA = blockDSA;
const getDSAAnalytics = async (req, res) => {
    try {
        const analytics = await dsa_service_1.default.getAnalytics();
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
exports.getDSAAnalytics = getDSAAnalytics;
