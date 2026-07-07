"use strict";
// src/mappers/loanMapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanListMapper = exports.loanMapper = void 0;
const loanMapper = (loan) => {
    return {
        id: loan.id,
        fullName: loan.fullName,
        email: loan.email,
        phone: loan.phone,
        loanType: loan.loanType,
        amount: loan.amount,
        status: loan.status,
        interestRate: loan.interestRate,
        tenureMonths: loan.tenureMonths,
        monthlyEMI: loan.monthlyEMI,
        income: loan.income,
        panNo: loan.panNo,
        dob: loan.dob,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
    };
};
exports.loanMapper = loanMapper;
const loanListMapper = (loans) => {
    return loans.map(exports.loanMapper);
};
exports.loanListMapper = loanListMapper;
