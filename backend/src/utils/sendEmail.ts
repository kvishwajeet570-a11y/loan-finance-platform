import axios from "axios";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    console.log(
      "BREVO_API_KEY EXISTS =",
      !!process.env.BREVO_API_KEY
    );

    console.log(
      "BREVO_API_KEY FIRST 15 =",
      process.env.BREVO_API_KEY?.substring(0, 15)
    );

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Loan Finance Platform",
          email: "kvishwajeet570@gmail.com" // Brevo verified sender email
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY || "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("EMAIL SENT =>", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "BREVO API ERROR =>",
      error?.response?.data || error.message
    );

    throw error;
  }
};