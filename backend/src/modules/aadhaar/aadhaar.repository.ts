import prisma from "../../prisma/prisma";

export class AadhaarRepository {
  /**
   * FIND AADHAAR BY USER ID
   */
  static async findByUserId(userId: string) {
    return prisma.aadhaar.findUnique({
      where: {
        userId,
      },
    });
  }

  /**
   * FIND AADHAAR BY ID
   */
  static async findById(id: string) {
    return prisma.aadhaar.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * CREATE AADHAAR RECORD
   */
  static async create(data: {
    userId: string;
    maskedAadhaar: string;
    fullName: string;
    dob: string;
    status?: string;
  }) {
    return prisma.aadhaar.create({
      data: {
        userId: data.userId,
        maskedAadhaar: data.maskedAadhaar,
        fullName: data.fullName,
        dob: data.dob,
        status: data.status ?? "PENDING",
      },
    });
  }

  /**
   * UPDATE AADHAAR DETAILS
   */
  static async update(
    userId: string,
    data: {
      maskedAadhaar?: string;
      fullName?: string;
      dob?: string;
    }
  ) {
    return prisma.aadhaar.update({
      where: {
        userId,
      },
      data,
    });
  }

  /**
   * UPDATE STATUS
   */
  static async updateStatus(
    id: string,
    status: string
  ) {
    return prisma.aadhaar.update({
      where: {
        id,
      },
      data: {
        status,
        rejectionReason: null,
      },
    });
  }

  /**
   * REJECT AADHAAR
   */
  static async reject(
    id: string,
    reason: string
  ) {
    return prisma.aadhaar.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /**
   * GET ALL AADHAAR RECORDS
   */
  static async findAll() {
    return prisma.aadhaar.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * DELETE AADHAAR BY USER ID
   */
  static async deleteByUserId(userId: string) {
    return prisma.aadhaar.delete({
      where: {
        userId,
      },
    });
  }
}