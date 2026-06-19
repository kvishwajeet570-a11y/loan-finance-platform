"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRechargeService = exports.createRechargeService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE RECHARGE SERVICE
======================================== */
const createRechargeService = async (data) => {
    return await prisma_1.default.recharge.create({
        data: {
            userId: data.userId,
            mobileNumber: data.mobileNumber,
            operator: data.operator,
            amount: data.amount,
            rechargeType: data.rechargeType,
            status: "success",
        },
    });
};
exports.createRechargeService = createRechargeService;
/* ========================================
   GET USER RECHARGES
======================================== */
const getUserRechargeService = async (userId) => {
    return await prisma_1.default.recharge.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getUserRechargeService = getUserRechargeService;
