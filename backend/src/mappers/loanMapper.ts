// src/mappers/loanMapper.ts

export const loanMapper = (loan: any) => {
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

export const loanListMapper = (loans: any[]) => {
  return loans.map(loanMapper);
};