"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const axios_1 = __importDefault(require("axios"));
class ChatbotService {
    async sendMessage(message) {
        try {
            const response = await axios_1.default.post(process.env.GEMINI_API_URL, {
                contents: [
                    {
                        parts: [{ text: message }],
                    },
                ],
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY,
                },
            });
            return {
                success: true,
                reply: response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    "No response generated",
            };
        }
        catch (error) {
            console.error("Chatbot Error:", error.message);
            return {
                success: false,
                message: "Unable to process request",
            };
        }
    }
    async loanAssistant(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("personal loan")) {
            return {
                success: true,
                answer: "Personal Loan available from ₹50,000 to ₹40 Lakhs.",
            };
        }
        if (lowerQuery.includes("home loan")) {
            return {
                success: true,
                answer: "Home Loan available up to ₹5 Crore with attractive interest rates.",
            };
        }
        if (lowerQuery.includes("business loan")) {
            return {
                success: true,
                answer: "Business Loan available up to ₹2 Crore without collateral in selected cases.",
            };
        }
        return this.sendMessage(query);
    }
}
exports.ChatbotService = ChatbotService;
exports.default = new ChatbotService();
