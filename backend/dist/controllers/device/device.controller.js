"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceAnalytics = exports.deleteDevice = exports.unblockDevice = exports.blockDevice = exports.getUserDevices = exports.getDeviceById = exports.getDevices = void 0;
const device_service_1 = __importDefault(require("../../services/device/device.service"));
const getDevices = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const devices = await device_service_1.default.getDevices({
            page,
            limit,
            search,
        });
        res.status(200).json({
            success: true,
            ...devices,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch devices",
        });
    }
};
exports.getDevices = getDevices;
const getDeviceById = async (req, res) => {
    try {
        const device = await device_service_1.default.getDeviceById(req.params.id);
        if (!device) {
            res.status(404).json({
                success: false,
                message: "Device not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: device,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch device",
        });
    }
};
exports.getDeviceById = getDeviceById;
const getUserDevices = async (req, res) => {
    try {
        const devices = await device_service_1.default.getUserDevices(req.params.userId);
        res.status(200).json({
            success: true,
            data: devices,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user devices",
        });
    }
};
exports.getUserDevices = getUserDevices;
const blockDevice = async (req, res) => {
    try {
        const device = await device_service_1.default.blockDevice(req.params.id);
        res.status(200).json({
            success: true,
            message: "Device blocked successfully",
            data: device,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to block device",
        });
    }
};
exports.blockDevice = blockDevice;
const unblockDevice = async (req, res) => {
    try {
        const device = await device_service_1.default.unblockDevice(req.params.id);
        res.status(200).json({
            success: true,
            message: "Device unblocked successfully",
            data: device,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to unblock device",
        });
    }
};
exports.unblockDevice = unblockDevice;
const deleteDevice = async (req, res) => {
    try {
        await device_service_1.default.deleteDevice(req.params.id);
        res.status(200).json({
            success: true,
            message: "Device removed successfully",
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to remove device",
        });
    }
};
exports.deleteDevice = deleteDevice;
const getDeviceAnalytics = async (req, res) => {
    try {
        const analytics = await device_service_1.default.getAnalytics();
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
exports.getDeviceAnalytics = getDeviceAnalytics;
