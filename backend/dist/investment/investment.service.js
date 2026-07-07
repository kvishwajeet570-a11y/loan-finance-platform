"use strict";
// src/integrations/investment/investment.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvestmentLead = exports.getInvestmentPlans = exports.getFixedDeposits = exports.getMutualFunds = void 0;
const axios_1 = __importDefault(require("axios"));
const investmentApi = axios_1.default.create({
    baseURL: process.env.INVESTMENT_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.INVESTMENT_API_KEY}`,
        "Content-Type": "application/json",
    },
});
const getMutualFunds = async () => {
    const { data } = await investmentApi.get("/mutual-funds");
    return data;
};
exports.getMutualFunds = getMutualFunds;
const getFixedDeposits = async () => {
    const { data } = await investmentApi.get("/fixed-deposits");
    return data;
};
exports.getFixedDeposits = getFixedDeposits;
const getInvestmentPlans = async () => {
    const { data } = await investmentApi.get("/plans");
    return data;
};
exports.getInvestmentPlans = getInvestmentPlans;
const createInvestmentLead = async (payload) => {
    const { data } = await investmentApi.post("/lead", payload);
    return data;
};
exports.createInvestmentLead = createInvestmentLead;
