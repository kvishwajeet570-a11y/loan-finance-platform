"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarService = void 0;
const aadhaar_repository_1 = require("./aadhaar.repository");
class AadhaarService {
    static async verifyAadhaar(data) {
        const maskedAadhaar = "XXXXXXXX" + data.aadhaarNo.slice(-4);
        const existing = await aadhaar_repository_1.AadhaarRepository.findByUserId(data.userId);
        if (existing) {
            throw new Error("Aadhaar already submitted");
        }
        const aadhaarRecord = await aadhaar_repository_1.AadhaarRepository.create({
            userId: data.userId,
            maskedAadhaar,
            fullName: data.fullName,
            dob: data.dob,
            status: "PENDING",
        });
        return aadhaarRecord;
    }
    static async getAadhaarStatus(userId) {
        const record = await aadhaar_repository_1.AadhaarRepository.findByUserId(userId);
        if (!record) {
            throw new Error("Aadhaar record not found");
        }
        return record;
    }
    static async approveAadhaar(id) {
        return aadhaar_repository_1.AadhaarRepository.updateStatus(id, "APPROVED");
    }
    static async rejectAadhaar(id, reason) {
        return aadhaar_repository_1.AadhaarRepository.reject(id, reason);
    }
    static async getAllRecords() {
        return aadhaar_repository_1.AadhaarRepository.findAll();
    }
}
exports.AadhaarService = AadhaarService;
