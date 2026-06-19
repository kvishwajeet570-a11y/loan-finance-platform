"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
/* ========================================
   CLOUDINARY CONFIG
======================================== */
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
/* ========================================
   UPLOAD FILE
======================================== */
const uploadFile = async (filePath) => {
    const result = await cloudinary_1.default.v2.uploader.upload(filePath, {
        folder: "loan-finance",
    });
    return result.secure_url;
};
exports.default = uploadFile;
