"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFileById = exports.getAllFiles = exports.uploadFile = void 0;
const uploadFile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload file",
        });
    }
};
exports.uploadFile = uploadFile;
const getAllFiles = async (req, res) => {
    res.status(200).json({
        success: true,
        data: [],
    });
};
exports.getAllFiles = getAllFiles;
const getFileById = async (req, res) => {
    res.status(200).json({
        success: true,
        data: null,
    });
};
exports.getFileById = getFileById;
const deleteFile = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "File deleted successfully",
    });
};
exports.deleteFile = deleteFile;
