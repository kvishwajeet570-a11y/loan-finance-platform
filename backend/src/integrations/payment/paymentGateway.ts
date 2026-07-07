// src/integrations/payment/paymentGateway.ts

import axios from "axios";

const paymentApi = axios.create({
  baseURL: process.env.PAYMENT_GATEWAY_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${process.env.PAYMENT_GATEWAY_KEY}`,
    "Content-Type": "application/json",
  },
});

export const createPaymentOrder = async (
  amount: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string
) => {
  const { data } = await paymentApi.post("/orders", {
    amount,
    customerName,
    customerEmail,
    customerPhone,
  });

  return data;
};

export const verifyPayment = async (
  transactionId: string
) => {
  const { data } = await paymentApi.get(
    `/payments/${transactionId}`
  );

  return data;
};

export const refundPayment = async (
  transactionId: string,
  amount: number
) => {
  const { data } = await paymentApi.post(
    "/refund",
    {
      transactionId,
      amount,
    }
  );

  return data;
};

export default paymentApi;