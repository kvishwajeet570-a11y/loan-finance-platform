"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDSAAnalytics = exports.getTopDSA = exports.getDSADashboard = exports.getDSALoans = exports.unblockDSA = exports.blockDSA = exports.rejectDSA = exports.approveDSA = exports.createDSA = exports.getDSAById = exports.getDSAs = void 0;
const dsa_service_1 = __importDefault(require("../../services/dsa/dsa.service"));
/* ==========================
   GET ALL DSA
========================== */
const getDSAs = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const result = await dsa_service_1.default.getDSAList({
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
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch DSA list",
        });
    }
};
exports.getDSAs = getDSAs;
/* ==========================
   GET DSA BY ID
========================== */
const getDSAById = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.getDSAProfile(String(req.params.id));
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
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch DSA",
        });
    }
};
exports.getDSAById = getDSAById;
/* ==========================
   CREATE DSA
========================== */
const createDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.registerDSA({
            name: req.body.name,
            email: req.body.email,
            phoneNo: req.body.phoneNo,
            password: req.body.password,
            referralCode: req.body.referralCode,
        });
        res.status(201).json({
            success: true,
            message: "DSA created successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error?.message ||
                "Failed to create DSA",
        });
    }
};
exports.createDSA = createDSA;
/* ==========================
   APPROVE DSA
========================== */
const approveDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.verifyDSA(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "DSA approved successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Approval failed",
        });
    }
};
exports.approveDSA = approveDSA;
/* ==========================
   REJECT DSA
========================== */
const rejectDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.updateDSA(String(req.params.id), {
            isVerified: false,
        });
        res.status(200).json({
            success: true,
            message: "DSA rejected successfully",
            data: dsa,
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
exports.rejectDSA = rejectDSA;
/* ==========================
   BLOCK DSA
========================== */
const blockDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.blockDSA(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "DSA blocked successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Block failed",
        });
    }
};
exports.blockDSA = blockDSA;
/* ==========================
   UNBLOCK DSA
========================== */
const unblockDSA = async (req, res) => {
    try {
        const dsa = await dsa_service_1.default.unblockDSA(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "DSA unblocked successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unblock failed",
        });
    }
};
exports.unblockDSA = unblockDSA;
/* ==========================
   DSA LOANS
========================== */
const getDSALoans = async (req, res) => {
    try {
        const loans = await dsa_service_1.default.getDSALoans(String(req.params.id));
        res.status(200).json({
            success: true,
            data: loans,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loans",
        });
    }
};
exports.getDSALoans = getDSALoans;
/* ==========================
   DSA DASHBOARD
========================== */
const getDSADashboard = async (req, res) => {
    try {
        const dashboard = await dsa_service_1.default.getDSADashboard(String(req.params.id));
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard",
        });
    }
};
exports.getDSADashboard = getDSADashboard;
/* ==========================
   TOP DSA
========================== */
const getTopDSA = async (req, res) => {
    try {
        const data = await dsa_service_1.default.getTopDSA();
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top DSA",
        });
    }
};
exports.getTopDSA = getTopDSA;
/* ==========================
   ANALYTICS
========================== */
const getDSAAnalytics = async (req, res) => {
    try {
        const analytics = {
            totalDsa: 0,
            activeDsa: 0,
            totalBusiness: 0,
            totalCommission: 0,
        };
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
exports.getDSAAnalytics = getDSAAnalytics;
