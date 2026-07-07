// src/integrations/bankApi.ts

import axios from "axios";

const bankApi = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBanks = async () => {
  const response = await bankApi.get(
    `${process.env.BANK_API_URL}/banks`
  );

  return response.data;
};

export const getLoanProducts = async (
  bankCode: string
) => {
  const response = await bankApi.get(
    `${process.env.BANK_API_URL}/loan-products/${bankCode}`
  );

  return response.data;
};

export const checkEligibility = async (
  payload: {
    name: string;
    phone: string;
    income: number;
    loanAmount: number;
  }
) => {
  const response = await bankApi.post(
    `${process.env.BANK_API_URL}/eligibility`,
    payload
  );

  return response.data;
};

export const createLoanLead = async (
  payload: any
) => {
  const response = await bankApi.post(
    `${process.env.BANK_API_URL}/loan-lead`,
    payload
  );

  return response.data;
};

export default bankApi;