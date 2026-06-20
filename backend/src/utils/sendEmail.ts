import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email environment variables missing");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Loan Finance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("EMAIL SENT =>", info.messageId);

    return info;
  } catch (error: any) {
    console.log("EMAIL ERROR =>", error);

    throw new Error("Failed to send email");
  }
};