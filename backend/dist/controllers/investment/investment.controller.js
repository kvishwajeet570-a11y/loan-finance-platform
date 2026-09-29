"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkRejectInvestments = exports.bulkApproveInvestments = exports.exportInvestmentsPdf = exports.exportInvestmentsExcel = exports.calculateReturns = exports.getInvestmentReturns = exports.getMonthlyInvestments = exports.getTopPlans = exports.getTopInvestors = exports.getInvestmentDashboard = exports.getInvestmentAnalytics = exports.getRejectedInvestments = exports.getClosedInvestments = exports.getActiveInvestments = exports.getPendingInvestments = exports.getUserInvestments = exports.searchInvestments = exports.closeInvestment = exports.activateInvestment = exports.rejectInvestment = exports.approveInvestment = exports.deleteInvestment = exports.updateInvestment = exports.getInvestmentById = exports.getAllInvestments = exports.createInvestment = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* =========================================
   CREATE
========================================= */
const createInvestment = async (req, res) => {
    try {
        const investment = await prisma_1.default.investment.create({
            data: req.body,
        });
        return res.status(201).json({
            success: true,
            data: investment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createInvestment = createInvestment;
/* =========================================
   GET ALL
========================================= */
const getAllInvestments = async (req, res) => {
    try {
        const investments = await prisma_1.default.investment.findMany();
        return res.status(200).json({
            success: true,
            data: investments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAllInvestments = getAllInvestments;
/* =========================================
   GET BY ID
========================================= */
const getInvestmentById = async (req, res) => {
    try {
        const investment = await prisma_1.default.investment.findUnique({
            where: {
                id: String(req.params.id),
            },
        });
        return res.status(200).json({
            success: true,
            data: investment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getInvestmentById = getInvestmentById;
/* =========================================
   UPDATE
========================================= */
const updateInvestment = async (req, res) => {
    try {
        const investment = await prisma_1.default.investment.update({
            where: {
                id: String(req.params.id),
            },
            data: req.body,
        });
        return res.status(200).json({
            success: true,
            data: investment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateInvestment = updateInvestment;
/* =========================================
   DELETE
========================================= */
const deleteInvestment = async (req, res) => {
    try {
        await prisma_1.default.investment.delete({
            where: {
                id: String(req.params.id),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Deleted",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteInvestment = deleteInvestment;
/* =========================================
   APPROVE
========================================= */
const approveInvestment = async (req, res) => {
    return res.json({
        success: true,
        message: "approveInvestment",
    });
};
exports.approveInvestment = approveInvestment;
/* =========================================
   REJECT
========================================= */
const rejectInvestment = async (req, res) => {
    return res.json({
        success: true,
        message: "rejectInvestment",
    });
};
exports.rejectInvestment = rejectInvestment;
/* =========================================
   ACTIVATE
========================================= */
const activateInvestment = async (req, res) => {
    return res.json({
        success: true,
        message: "activateInvestment",
    });
};
exports.activateInvestment = activateInvestment;
/* =========================================
   CLOSE
========================================= */
const closeInvestment = async (req, res) => {
    return res.json({
        success: true,
        message: "closeInvestment",
    });
};
exports.closeInvestment = closeInvestment;
/* =========================================
   SEARCH
========================================= */
const searchInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "searchInvestments",
    });
};
exports.searchInvestments = searchInvestments;
/* =========================================
   USER INVESTMENTS
========================================= */
const getUserInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getUserInvestments",
    });
};
exports.getUserInvestments = getUserInvestments;
/* =========================================
   STATUS LISTS
========================================= */
const getPendingInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getPendingInvestments",
    });
};
exports.getPendingInvestments = getPendingInvestments;
const getActiveInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getActiveInvestments",
    });
};
exports.getActiveInvestments = getActiveInvestments;
const getClosedInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getClosedInvestments",
    });
};
exports.getClosedInvestments = getClosedInvestments;
const getRejectedInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getRejectedInvestments",
    });
};
exports.getRejectedInvestments = getRejectedInvestments;
/* =========================================
   ANALYTICS
========================================= */
const getInvestmentAnalytics = async (req, res) => {
    return res.json({
        success: true,
        message: "getInvestmentAnalytics",
    });
};
exports.getInvestmentAnalytics = getInvestmentAnalytics;
const getInvestmentDashboard = async (req, res) => {
    return res.json({
        success: true,
        message: "getInvestmentDashboard",
    });
};
exports.getInvestmentDashboard = getInvestmentDashboard;
/* =========================================
   TOP DATA
========================================= */
const getTopInvestors = async (req, res) => {
    return res.json({
        success: true,
        message: "getTopInvestors",
    });
};
exports.getTopInvestors = getTopInvestors;
const getTopPlans = async (req, res) => {
    return res.json({
        success: true,
        message: "getTopPlans",
    });
};
exports.getTopPlans = getTopPlans;
const getMonthlyInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "getMonthlyInvestments",
    });
};
exports.getMonthlyInvestments = getMonthlyInvestments;
/* =========================================
   RETURNS
========================================= */
const getInvestmentReturns = async (req, res) => {
    return res.json({
        success: true,
        message: "getInvestmentReturns",
    });
};
exports.getInvestmentReturns = getInvestmentReturns;
const calculateReturns = async (req, res) => {
    return res.json({
        success: true,
        message: "calculateReturns",
    });
};
exports.calculateReturns = calculateReturns;
/* =========================================
   EXPORT
========================================= */
const exportInvestmentsExcel = async (req, res) => {
    return res.json({
        success: true,
        message: "exportInvestmentsExcel",
    });
};
exports.exportInvestmentsExcel = exportInvestmentsExcel;
const exportInvestmentsPdf = async (req, res) => {
    return res.json({
        success: true,
        message: "exportInvestmentsPdf",
    });
};
exports.exportInvestmentsPdf = exportInvestmentsPdf;
/* =========================================
   BULK ACTIONS
========================================= */
const bulkApproveInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "bulkApproveInvestments",
    });
};
exports.bulkApproveInvestments = bulkApproveInvestments;
const bulkRejectInvestments = async (req, res) => {
    return res.json({
        success: true,
        message: "bulkRejectInvestments",
    });
};
exports.bulkRejectInvestments = bulkRejectInvestments;
