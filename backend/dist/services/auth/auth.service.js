"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const auth_repository_1 = __importDefault(require("../../repositories/auth/auth.repository"));
class AuthService {
    async register(data) {
        const emailExists = await auth_repository_1.default.findByEmail(data.email);
        if (emailExists) {
            throw new Error("Email already registered.");
        }
        const phoneExists = await auth_repository_1.default.findByPhone(data.phoneNo);
        if (phoneExists) {
            throw new Error("Phone number already registered.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
        const otp = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const user = await auth_repository_1.default.createUser({
            name: data.name,
            email: data.email,
            phoneNo: data.phoneNo,
            password: hashedPassword,
            otp,
            otpExpiry,
        });
        // TODO:
        // Send OTP using Email / SMS provider
        // Create Wallet
        // Create Referral
        // Insert Security Log
        // Insert Login History
        return {
            success: true,
            message: "Registration successful. Verify OTP.",
            userId: user.id,
        };
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
