import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS EXISTS =", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525,
      secure: false,

      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },

      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    console.log("VERIFYING SMTP...");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    const info = await transporter.sendMail({
      from: {
        name: "Loan Finance Platform",
        address: process.env.EMAIL_USER!,
      },
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