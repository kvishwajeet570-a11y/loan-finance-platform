"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadAnalytics = exports.deleteLead = exports.updateLeadStatus = exports.assignLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const lead_service_1 = __importDefault(require("../../services/lead/lead.service"));
const createLead = async (req, res) => {
    try {
        const lead = await lead_service_1.default.createLead(req.body);
        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: lead,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const status = String(req.query.status || "");
        const result = await lead_service_1.default.getLeads({
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
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch leads",
        });
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res) => {
    try {
        const lead = await lead_service_1.default.getLeadById(req.params.id);
        if (!lead) {
            res.status(404).json({
                success: false,
                message: "Lead not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: lead,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch lead",
        });
    }
};
exports.getLeadById = getLeadById;
const assignLead = async (req, res) => {
    try {
        const lead = await lead_service_1.default.assignLead({
            leadId: req.params.id,
            assignedTo: req.body.assignedTo,
        });
        res.status(200).json({
            success: true,
            message: "Lead assigned successfully",
            data: lead,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Assignment failed",
        });
    }
};
exports.assignLead = assignLead;
const updateLeadStatus = async (req, res) => {
    try {
        const lead = await lead_service_1.default.updateStatus({
            leadId: req.params.id,
            status: req.body.status,
        });
        res.status(200).json({
            success: true,
            message: "Lead status updated",
            data: lead,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Status update failed",
        });
    }
};
exports.updateLeadStatus = updateLeadStatus;
const deleteLead = async (req, res) => {
    try {
        await lead_service_1.default.softDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};
exports.deleteLead = deleteLead;
const getLeadAnalytics = async (req, res) => {
    try {
        const analytics = await lead_service_1.default.getAnalytics();
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
exports.getLeadAnalytics = getLeadAnalytics;
