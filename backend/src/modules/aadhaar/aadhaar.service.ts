import { AadhaarRepository } from "./aadhaar.repository";

export class AadhaarService {
  /**
   * VERIFY / CREATE AADHAAR
   */
  static async verifyAadhaar(data: {
    userId: string;
    aadhaarNo: string;
    fullName: string;
    dob: string;
  }) {
    const aadhaarNo =
      data.aadhaarNo.replace(/\s+/g, "");

    if (!/^\d{12}$/.test(aadhaarNo)) {
      throw new Error(
        "Aadhaar number must contain exactly 12 digits"
      );
    }

    const existing =
      await AadhaarRepository.findByUserId(
        data.userId
      );

    if (existing) {
      throw new Error(
        "Aadhaar already submitted"
      );
    }

    const maskedAadhaar =
      "XXXXXXXX" + aadhaarNo.slice(-4);

    return AadhaarRepository.create({
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
  static async getAadhaarStatus(
    userId: string
  ) {
    const record =
      await AadhaarRepository.findByUserId(
        userId
      );

    if (!record) {
      throw new Error(
        "Aadhaar record not found"
      );
    }

    return record;
  }

  /**
   * UPDATE AADHAAR DETAILS
   */
  static async updateAadhaar(
    userId: string,
    data: {
      maskedAadhaar?: string;
      fullName?: string;
      dob?: string;
    }
  ) {
    const existing =
      await AadhaarRepository.findByUserId(
        userId
      );

    if (!existing) {
      throw new Error(
        "Aadhaar record not found"
      );
    }

    return AadhaarRepository.update(
      userId,
      data
    );
  }

  /**
   * DELETE AADHAAR
   */
  static async deleteAadhaar(
    userId: string
  ) {
    const existing =
      await AadhaarRepository.findByUserId(
        userId
      );

    if (!existing) {
      throw new Error(
        "Aadhaar record not found"
      );
    }

    return AadhaarRepository.deleteByUserId(
      userId
    );
  }

  /**
   * APPROVE AADHAAR
   */
  static async approveAadhaar(
    id: string
  ) {
    const record =
      await AadhaarRepository.findById(id);

    if (!record) {
      throw new Error(
        "Aadhaar record not found"
      );
    }

    return AadhaarRepository.updateStatus(
      id,
      "APPROVED"
    );
  }

  /**
   * REJECT AADHAAR
   */
  static async rejectAadhaar(
    id: string,
    reason: string
  ) {
    const record =
      await AadhaarRepository.findById(id);

    if (!record) {
      throw new Error(
        "Aadhaar record not found"
      );
    }

    if (!reason?.trim()) {
      throw new Error(
        "Rejection reason is required"
      );
    }

    return AadhaarRepository.reject(
      id,
      reason.trim()
    );
  }

  /**
   * GET ALL AADHAAR RECORDS
   */
  static async getAllRecords() {
    return AadhaarRepository.findAll();
  }
}