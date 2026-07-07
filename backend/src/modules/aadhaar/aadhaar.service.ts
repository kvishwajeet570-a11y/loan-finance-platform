import { AadhaarRepository } from "./aadhaar.repository";

export class AadhaarService {
  static async verifyAadhaar(data: {
    userId: string;
    aadhaarNo: string;
    fullName: string;
    dob: string;
  }) {
    const maskedAadhaar =
      "XXXXXXXX" + data.aadhaarNo.slice(-4);

    const existing =
      await AadhaarRepository.findByUserId(data.userId);

    if (existing) {
      throw new Error("Aadhaar already submitted");
    }

    const aadhaarRecord =
      await AadhaarRepository.create({
        userId: data.userId,
        maskedAadhaar,
        fullName: data.fullName,
        dob: data.dob,
        status: "PENDING",
      });

    return aadhaarRecord;
  }

  static async getAadhaarStatus(userId: string) {
    const record =
      await AadhaarRepository.findByUserId(userId);

    if (!record) {
      throw new Error("Aadhaar record not found");
    }

    return record;
  }

  static async approveAadhaar(id: string) {
    return AadhaarRepository.updateStatus(
      id,
      "APPROVED"
    );
  }

  static async rejectAadhaar(
    id: string,
    reason: string
  ) {
    return AadhaarRepository.reject(
      id,
      reason
    );
  }

  static async getAllRecords() {
    return AadhaarRepository.findAll();
  }
}