"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const sendEmail = async (to, subject, text) => {
    try {
        console.log("BREVO_API_KEY EXISTS =", !!process.env.BREVO_API_KEY);
        console.log("BREVO_API_KEY FIRST 15 =", process.env.BREVO_API_KEY?.substring(0, 15));
        const response = await axios_1.default.post("https://api.brevo.com/v3/smtp/email", {
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
        }, {
            headers: {
                "api-key": process.env.BREVO_API_KEY || "",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        console.log("EMAIL SENT =>", response.data);
        return response.data;
    }
    catch (error) {
        console.error("BREVO API ERROR =>", error?.response?.data || error.message);
        throw error;
    }
};
exports.sendEmail = sendEmail;
