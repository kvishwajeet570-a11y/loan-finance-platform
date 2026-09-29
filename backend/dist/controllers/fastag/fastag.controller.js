"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkBlockFastags = exports.bulkActivateFastags = exports.exportFastagPdf = exports.exportFastagExcel = exports.getMonthlyRecharges = exports.getTopRechargeUsers = exports.getFastagDashboard = exports.getBlockedFastags = exports.getInactiveFastags = exports.getActiveFastags = exports.searchFastags = exports.getFastagByVehicle = exports.getUserFastags = exports.getFastagTransactions = exports.unblockFastag = exports.deactivateFastag = exports.deleteFastag = exports.updateFastag = exports.getAllFastags = exports.getFastagAnalytics = exports.rechargeFastag = exports.blockFastag = exports.activateFastag = exports.createFastag = exports.getFastagById = exports.getFastags = void 0;
const fastag_service_1 = __importStar(require("../../services/fastag/fastag.service"));
const getFastags = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const result = await fastag_service_1.default.getFastTags({
            page,
            limit,
            search,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch FASTags",
        });
    }
};
exports.getFastags = getFastags;
const getFastagById = async (req, res) => {
    try {
        const fastag = await fastag_service_1.default.getFastTagById(String(req.params.id));
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
        const fastag = await fastag_service_1.default.createFastTag(req.body);
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
        const fastag = await fastag_service_1.default.activateTag(String(req.params.id));
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
        const fastag = await fastag_service_1.default.deactivateTag(String(req.params.id));
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
    return void res.status(200).json({
        success: true,
        message: "Recharge module not implemented yet",
    });
};
exports.rechargeFastag = rechargeFastag;
const getFastagAnalytics = async (req, res) => {
    try {
        const analytics = await fastag_service_1.default.getFastTagStats();
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
/* ROUTE COMPATIBILITY EXPORTS */
exports.getAllFastags = exports.getFastags;
exports.updateFastag = exports.activateFastag;
exports.deleteFastag = exports.blockFastag;
exports.deactivateFastag = exports.blockFastag;
exports.unblockFastag = exports.activateFastag;
exports.getFastagTransactions = exports.getFastags;
exports.getUserFastags = exports.getFastags;
exports.getFastagByVehicle = exports.getFastagById;
exports.searchFastags = exports.getFastags;
exports.getActiveFastags = exports.getFastags;
exports.getInactiveFastags = exports.getFastags;
exports.getBlockedFastags = exports.getFastags;
exports.getFastagDashboard = exports.getFastagAnalytics;
exports.getTopRechargeUsers = exports.getFastagAnalytics;
exports.getMonthlyRecharges = exports.getFastagAnalytics;
exports.exportFastagExcel = exports.getFastagAnalytics;
exports.exportFastagPdf = exports.getFastagAnalytics;
exports.bulkActivateFastags = exports.activateFastag;
exports.bulkBlockFastags = exports.blockFastag;
exports.default = fastag_service_1.FastagService;
