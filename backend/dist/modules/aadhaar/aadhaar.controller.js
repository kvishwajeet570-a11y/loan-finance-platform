"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAadhaar = exports.updateAadhaar = exports.getAadhaarStatus = exports.verifyAadhaar = void 0;
const aadhaar_service_1 = require("./aadhaar.service");
/**
 * EXPRESS PARAM HELPER
 */
const getParam = (value) => {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }
    return value ?? "";
};
/**
 * VERIFY AADHAAR
 */
const verifyAadhaar = async (req, res) => {
    try {
        const { userId, aadhaarNo, fullName, dob, } = req.body;
        if (!userId ||
            !aadhaarNo ||
            !fullName ||
            !dob) {
            res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
            return;
        }
        const aadhaarNumber = String(aadhaarNo).replace(/\s+/g, "");
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            res.status(400).json({
                success: false,
                message: "Aadhaar number must contain exactly 12 digits",
            });
            return;
        }
        const result = await aadhaar_service_1.AadhaarService.verifyAadhaar({
            userId: String(userId),
            aadhaarNo: aadhaarNumber,
            fullName: String(fullName),
            dob: String(dob),
        });
        res.status(200).json({
            success: true,
            message: "Aadhaar submitted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error?.message ||
                "Aadhaar verification failed",
        });
    }
};
exports.verifyAadhaar = verifyAadhaar;
/**
 * GET AADHAAR STATUS
 */
const getAadhaarStatus = async (req, res) => {
    try {
        const userId = getParam(req.params.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const result = await aadhaar_service_1.AadhaarService.getAadhaarStatus(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error?.message ||
                "Aadhaar record not found",
        });
    }
};
exports.getAadhaarStatus = getAadhaarStatus;
/**
 * UPDATE AADHAAR
 */
const updateAadhaar = async (req, res) => {
    try {
        const userId = getParam(req.params.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        const { aadhaarNo, fullName, dob, } = req.body;
        const updateData = {};
        if (aadhaarNo !== undefined) {
            const aadhaarNumber = String(aadhaarNo).replace(/\s+/g, "");
            if (!/^\d{12}$/.test(aadhaarNumber)) {
                res.status(400).json({
                    success: false,
                    message: "Aadhaar number must contain exactly 12 digits",
                });
                return;
            }
            updateData.maskedAadhaar =
                "XXXXXXXX" +
                    aadhaarNumber.slice(-4);
        }
        if (fullName !== undefined) {
            updateData.fullName =
                String(fullName);
        }
        if (dob !== undefined) {
            updateData.dob =
                String(dob);
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: "No Aadhaar fields provided for update",
            });
            return;
        }
        const result = await aadhaar_service_1.AadhaarService.updateAadhaar(userId, updateData);
        res.status(200).json({
            success: true,
            message: "Aadhaar details updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error?.message ||
                "Failed to update Aadhaar details",
        });
    }
};
exports.updateAadhaar = updateAadhaar;
/**
 * DELETE AADHAAR
 */
const deleteAadhaar = async (req, res) => {
    try {
        const userId = getParam(req.params.userId);
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }
        await aadhaar_service_1.AadhaarService.deleteAadhaar(userId);
        res.status(200).json({
            success: true,
            message: "Aadhaar record deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error?.message ||
                "Failed to delete Aadhaar record",
        });
    }
};
exports.deleteAadhaar = deleteAadhaar;
