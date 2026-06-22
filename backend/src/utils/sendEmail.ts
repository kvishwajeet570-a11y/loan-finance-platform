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
      port: 2525, // 587 की जगह 2525 टेस्ट करो
      secure: false,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
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