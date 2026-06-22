import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: `"Loan Finance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("EMAIL SENT =>", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL ERROR =>", error);
    throw error;
  }
};