// src/integrations/sms/sms.ts

import axios from "axios";

const smsApi = axios.create({
  baseURL: process.env.SMS_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.SMS_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const sendSms = async (
  phone: string,
  message: string
) => {
  const { data } = await smsApi.post(
    "/send",
    {
      phone,
      message,
    }
  );

  return data;
};

export const sendOtpSms = async (
  phone: string,
  otp: string
) => {
  return sendSms(
    phone,
    `Your OTP is ${otp}. Valid for 10 minutes.`
  );
};

export const sendLoanApprovedSms = async (
  phone: string
) => {
  return sendSms(
    phone,
    "Congratulations! Your loan application has been approved."
  );
};

export const sendLoanRejectedSms = async (
  phone: string
) => {
  return sendSms(
    phone,
    "Your loan application status has been updated. Please check your account."
  );
};