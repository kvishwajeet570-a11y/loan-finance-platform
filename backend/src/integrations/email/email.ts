// src/integrations/email.ts

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  return transporter.sendMail({
    from: `"India Loan Finance" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};