"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLoansService = exports.createLoanService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE LOAN
======================================== */
const createLoanService = async (data) => {
    return await prisma_1.default.loanApplication.create({
        data,
    });
};
exports.createLoanService = createLoanService;
/* ========================================
   GET USER LOANS
======================================== */
const getUserLoansService = async (userId) => {
    return await prisma_1.default.loanApplication.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getUserLoansService = getUserLoansService;
