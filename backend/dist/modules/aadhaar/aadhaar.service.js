"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarService = void 0;
const aadhaar_repository_1 = require("./aadhaar.repository");
class AadhaarService {
    /**
     * VERIFY / CREATE AADHAAR
     */
    static async verifyAadhaar(data) {
        const aadhaarNo = data.aadhaarNo.replace(/\s+/g, "");
        if (!/^\d{12}$/.test(aadhaarNo)) {
            throw new Error("Aadhaar number must contain exactly 12 digits");
        }
        const existing = await aadhaar_repository_1.AadhaarRepository.findByUserId(data.userId);
        if (existing) {
            throw new Error("Aadhaar already submitted");
        }
        const maskedAadhaar = "XXXXXXXX" + aadhaarNo.slice(-4);
        return aadhaar_repository_1.AadhaarRepository.create({
            userId: data.userId,
            maskedAadhaar,
            fullName: data.fullName,
            dob: data.dob,
            status: "PENDING",
        });
    }
    /**
     * GET AADHAAR STATUS
     */
    static async getAadhaarStatus(userId) {
        const record = await aadhaar_repository_1.AadhaarRepository.findByUserId(userId);
        if (!record) {
            throw new Error("Aadhaar record not found");
        }
        return record;
    }
    /**
     * UPDATE AADHAAR DETAILS
     */
    static async updateAadhaar(userId, data) {
        const existing = await aadhaar_repository_1.AadhaarRepository.findByUserId(userId);
        if (!existing) {
            throw new Error("Aadhaar record not found");
        }
        return aadhaar_repository_1.AadhaarRepository.update(userId, data);
    }
    /**
     * DELETE AADHAAR
     */
    static async deleteAadhaar(userId) {
        const existing = await aadhaar_repository_1.AadhaarRepository.findByUserId(userId);
        if (!existing) {
            throw new Error("Aadhaar record not found");
        }
        return aadhaar_repository_1.AadhaarRepository.deleteByUserId(userId);
    }
    /**
     * APPROVE AADHAAR
     */
    static async approveAadhaar(id) {
        const record = await aadhaar_repository_1.AadhaarRepository.findById(id);
        if (!record) {
            throw new Error("Aadhaar record not found");
        }
        return aadhaar_repository_1.AadhaarRepository.updateStatus(id, "APPROVED");
    }
    /**
     * REJECT AADHAAR
     */
    static async rejectAadhaar(id, reason) {
        const record = await aadhaar_repository_1.AadhaarRepository.findById(id);
        if (!record) {
            throw new Error("Aadhaar record not found");
        }
        if (!reason?.trim()) {
            throw new Error("Rejection reason is required");
        }
        return aadhaar_repository_1.AadhaarRepository.reject(id, reason.trim());
    }
    /**
     * GET ALL AADHAAR RECORDS
     */
    static async getAllRecords() {
        return aadhaar_repository_1.AadhaarRepository.findAll();
    }
}
exports.AadhaarService = AadhaarService;
