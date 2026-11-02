export function validateEmiInput(input: any) {
  return Number.isFinite(Number(input?.principal)) && Number(input.principal) > 0 && Number.isFinite(Number(input?.interestRate)) && Number(input.interestRate) >= 0 && Number.isInteger(Number(input?.tenureMonths)) && Number(input.tenureMonths) > 0;
}
