import axios from "axios";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Loan Finance Platform",
          email: "yourverifiedemail@gmail.com",
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
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("EMAIL SENT =>", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "EMAIL ERROR =>",
      error?.response?.data || error.message
    );
    throw error;
  }
};
