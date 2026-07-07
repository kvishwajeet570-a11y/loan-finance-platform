// src/integrations/kyc.ts

import axios from "axios";

const kycApi = axios.create({
  baseURL: process.env.KYC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.KYC_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const verifyPan = async (
  panNo: string
) => {
  const { data } = await kycApi.post(
    "/pan/verify",
    { panNo }
  );

  return data;
};

export const verifyDob = async (
  panNo: string,
  dob: string
) => {
  const { data } = await kycApi.post(
    "/pan-dob/verify",
    {
      panNo,
      dob,
    }
  );

  return data;
};

export const getKycStatus = async (
  userId: string
) => {
  const { data } = await kycApi.get(
    `/status/${userId}`
  );

  return data;
};