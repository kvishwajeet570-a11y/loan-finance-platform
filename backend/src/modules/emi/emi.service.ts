export function calculateEMI(principal: number, interestRate: number, tenureMonths: number) {
  const monthlyRate = interestRate / 1200;
  const monthlyEMI = monthlyRate === 0 ? principal / tenureMonths :
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  const emi = Math.round(monthlyEMI * 100) / 100;
  const totalPayment = Math.round(emi * tenureMonths * 100) / 100;
  return { principal, interestRate, tenureMonths, monthlyEMI: emi, totalPayment, totalInterest: Math.round((totalPayment - principal) * 100) / 100 };
}
