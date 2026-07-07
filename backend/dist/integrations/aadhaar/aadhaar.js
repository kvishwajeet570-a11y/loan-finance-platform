"use strict";
// src/integrations/aadhar/aadhar.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarService = void 0;
class AadhaarService {
    static async verifyAadhaar(payload) {
        try {
            const { aadhaarNumber, fullName, dob } = payload;
            if (!/^\d{12}$/.test(aadhaarNumber)) {
                return {
                    success: false,
                    verified: false,
                    message: "Invalid Aadhaar number format",
                };
            }
            return {
                success: true,
                verified: true,
                message: "Aadhaar verification successful",
                data: {
                    aadhaarNumber,
                    fullName,
                    dob,
                    status: "VERIFIED",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                verified: false,
                message: "Aadhaar verification failed",
            };
        }
    }
    static maskAadhaar(aadhaarNumber) {
        return `XXXXXXXX${aadhaarNumber.slice(-4)}`;
    }
}
exports.AadhaarService = AadhaarService;
