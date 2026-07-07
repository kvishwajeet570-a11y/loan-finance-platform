import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

import authRepository from "../../repositories/auth/auth.repository";

interface RegisterDTO {
  name: string;
  email: string;
  phoneNo: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterDTO) {
    const emailExists = await authRepository.findByEmail(data.email);

    if (emailExists) {
      throw new Error("Email already registered.");
    }

    const phoneExists = await authRepository.findByPhone(data.phoneNo);

    if (phoneExists) {
      throw new Error("Phone number already registered.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await authRepository.createUser({
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

export default new AuthService();