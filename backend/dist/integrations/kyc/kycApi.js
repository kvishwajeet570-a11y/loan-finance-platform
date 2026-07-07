"use strict";
// src/integrations/kycApi.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKycStatusApi = exports.verifyPanDobApi = exports.verifyPanApi = void 0;
const axios_1 = __importDefault(require("axios"));
const kycApi = axios_1.default.create({
    baseURL: process.env.KYC_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.KYC_API_KEY}`,
        "Content-Type": "application/json",
    },
});
const verifyPanApi = async (panNo) => {
    const { data } = await kycApi.post("/pan/verify", { panNo });
    return data;
};
exports.verifyPanApi = verifyPanApi;
const verifyPanDobApi = async (panNo, dob) => {
    const { data } = await kycApi.post("/pan-dob/verify", {
        panNo,
        dob,
    });
    return data;
};
exports.verifyPanDobApi = verifyPanDobApi;
const getKycStatusApi = async (referenceId) => {
    const { data } = await kycApi.get(`/status/${referenceId}`);
    return data;
};
exports.getKycStatusApi = getKycStatusApi;
