"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFastagAnalytics = exports.rechargeFastag = exports.blockFastag = exports.activateFastag = exports.createFastag = exports.getFastagById = exports.getFastags = void 0;
const fastag_service_1 = __importDefault(require("../../services/fastag/fastag.service"));
const getFastags = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const status = String(req.query.status || "");
        const result = await fastag_service_1.default.getFastags({
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
        res.status(500).json({
            success: false,
            message: "Failed to fetch FASTags",
        });
    }
};
exports.getFastags = getFastags;
const getFastagById = async (req, res) => {
    try {
        const fastag = await fastag_service_1.default.getFastagById(req.params.id);
        if (!fastag) {
            return void res.status(404).json({
                success: false,
                message: "FASTag not found",
            });
        }
        res.status(200).json({
            success: true,
            data: fastag,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FASTag",
        });
    }
};
exports.getFastagById = getFastagById;
const createFastag = async (req, res) => {
    try {
        const fastag = await fastag_service_1.default.createFastag(req.body);
        res.status(201).json({
            success: true,
            message: "FASTag created successfully",
            data: fastag,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createFastag = createFastag;
const activateFastag = async (req, res) => {
    try {
        const fastag = await fastag_service_1.default.activateFastag(req.params.id);
        res.status(200).json({
            success: true,
            message: "FASTag activated successfully",
            data: fastag,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Activation failed",
        });
    }
};
exports.activateFastag = activateFastag;
const blockFastag = async (req, res) => {
    try {
        const fastag = await fastag_service_1.default.blockFastag(req.params.id);
        res.status(200).json({
            success: true,
            message: "FASTag blocked successfully",
            data: fastag,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Block failed",
        });
    }
};
exports.blockFastag = blockFastag;
const rechargeFastag = async (req, res) => {
    try {
        const recharge = await fastag_service_1.default.rechargeFastag({
            fastagId: req.params.id,
            amount: Number(req.body.amount),
        });
        res.status(200).json({
            success: true,
            message: "Recharge successful",
            data: recharge,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Recharge failed",
        });
    }
};
exports.rechargeFastag = rechargeFastag;
const getFastagAnalytics = async (req, res) => {
    try {
        const analytics = await fastag_service_1.default.getAnalytics();
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
exports.getFastagAnalytics = getFastagAnalytics;
