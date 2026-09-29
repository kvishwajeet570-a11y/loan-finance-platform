"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceAnalytics = exports.deleteDevice = exports.unblockDevice = exports.blockDevice = exports.getUserDevices = exports.getDeviceById = exports.getDevices = void 0;
const device_service_1 = __importDefault(require("../../device/device.service"));
const getDevices = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const devices = await device_service_1.default.getAllDevices(page, limit);
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
        const device = await device_service_1.default.getDeviceById(String(req.params.id));
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
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch device",
        });
    }
};
exports.getDeviceById = getDeviceById;
const getUserDevices = async (req, res) => {
    try {
        const devices = await device_service_1.default.getUserDevices(String(req.params.userId));
        res.status(200).json({
            success: true,
            data: devices,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user devices",
        });
    }
};
exports.getUserDevices = getUserDevices;
const blockDevice = async (req, res) => {
    try {
        const device = await device_service_1.default.blockDevice(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Device blocked successfully",
            data: device,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to block device",
        });
    }
};
exports.blockDevice = blockDevice;
const unblockDevice = async (req, res) => {
    try {
        const device = await device_service_1.default.unblockDevice(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Device unblocked successfully",
            data: device,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to unblock device",
        });
    }
};
exports.unblockDevice = unblockDevice;
const deleteDevice = async (req, res) => {
    try {
        await device_service_1.default.deleteDevice(String(req.params.id));
        res.status(200).json({
            success: true,
            message: "Device removed successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to remove device",
        });
    }
};
exports.deleteDevice = deleteDevice;
const getDeviceAnalytics = async (req, res) => {
    try {
        const analytics = await device_service_1.default.getDeviceAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getDeviceAnalytics = getDeviceAnalytics;
