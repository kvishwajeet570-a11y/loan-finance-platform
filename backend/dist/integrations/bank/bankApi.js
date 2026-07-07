"use strict";
// src/integrations/bankApi.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoanLead = exports.checkEligibility = exports.getLoanProducts = exports.getBanks = void 0;
const axios_1 = __importDefault(require("axios"));
const bankApi = axios_1.default.create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
const getBanks = async () => {
    const response = await bankApi.get(`${process.env.BANK_API_URL}/banks`);
    return response.data;
};
exports.getBanks = getBanks;
const getLoanProducts = async (bankCode) => {
    const response = await bankApi.get(`${process.env.BANK_API_URL}/loan-products/${bankCode}`);
    return response.data;
};
exports.getLoanProducts = getLoanProducts;
const checkEligibility = async (payload) => {
    const response = await bankApi.post(`${process.env.BANK_API_URL}/eligibility`, payload);
    return response.data;
};
exports.checkEligibility = checkEligibility;
const createLoanLead = async (payload) => {
    const response = await bankApi.post(`${process.env.BANK_API_URL}/loan-lead`, payload);
    return response.data;
};
exports.createLoanLead = createLoanLead;
exports.default = bankApi;
