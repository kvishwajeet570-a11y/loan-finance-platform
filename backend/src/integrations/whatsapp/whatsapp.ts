// src/integrations/whatsapp/whatsapp.ts

import axios from "axios";

const whatsappApi = axios.create({
  baseURL: process.env.WHATSAPP_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const sendWhatsappMessage = async (
  phone: string,
  message: string
) => {
  const { data } = await whatsappApi.post(
    "/send",
    {
      phone,
      message,
    }
  );

  return data;
};

export const sendOtpWhatsapp = async (
  phone: string,
  otp: string
) => {
  return sendWhatsappMessage(
    phone,
    `Your OTP is ${otp}. Valid for 10 minutes.`
  );
};

export const sendLoanApprovedWhatsapp = async (
  phone: string,
  name: string
) => {
  return sendWhatsappMessage(
    phone,
    `Hello ${name}, your loan application has been approved.`
  );
};

export const sendLoanRejectedWhatsapp = async (
  phone: string,
  name: string
) => {
  return sendWhatsappMessage(
    phone,
    `Hello ${name}, your loan application status has been updated.`
  );
};