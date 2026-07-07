// src/integrations/investment/investment.ts

import axios from "axios";

const investmentApi = axios.create({
  baseURL: process.env.INVESTMENT_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.INVESTMENT_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getMutualFunds = async () => {
  const { data } = await investmentApi.get("/mutual-funds");
  return data;
};

export const getFixedDeposits = async () => {
  const { data } = await investmentApi.get("/fixed-deposits");
  return data;
};

export const getInvestmentPlans = async () => {
  const { data } = await investmentApi.get("/plans");
  return data;
};

export const createInvestmentLead = async (
  payload: {
    name: string;
    phone: string;
    email: string;
    amount: number;
    investmentType: string;
  }
) => {
  const { data } = await investmentApi.post(
    "/lead",
    payload
  );

  return data;
};