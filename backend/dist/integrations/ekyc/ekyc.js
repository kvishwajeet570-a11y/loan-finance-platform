"use strict";
// src/integrations/kyc.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKycStatus = exports.verifyDob = exports.verifyPan = void 0;
const axios_1 = __importDefault(require("axios"));
const kycApi = axios_1.default.create({
    baseURL: process.env.KYC_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.KYC_API_KEY}`,
        "Content-Type": "application/json",
    },
});
const verifyPan = async (panNo) => {
    const { data } = await kycApi.post("/pan/verify", { panNo });
    return data;
};
exports.verifyPan = verifyPan;
const verifyDob = async (panNo, dob) => {
    const { data } = await kycApi.post("/pan-dob/verify", {
        panNo,
        dob,
    });
    return data;
};
exports.verifyDob = verifyDob;
const getKycStatus = async (userId) => {
    const { data } = await kycApi.get(`/status/${userId}`);
    return data;
};
exports.getKycStatus = getKycStatus;
