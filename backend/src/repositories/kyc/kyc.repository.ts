import { prisma } from "../../prisma/prisma";

export class KycRepository {

  /* ==========================
      CREATE KYC
  ========================== */

  static async createKyc(data: {
    userId: string;
    aadhaarNumber?: string;
    panNumber?: string;
  }) {

    return prisma.kyc.create({
      data
    });
  }

  /* ==========================
      GET KYC BY ID
  ========================== */

  static async getById(
    kycId: string
  ) {

    return prisma.kyc.findUnique({
      where: {
        id: kycId
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      GET USER KYC
  ========================== */

  static async getUserKyc(
    userId: string
  ) {

    return prisma.kyc.findUnique({
      where: {
        userId
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      VERIFY AADHAAR
  ========================== */

  static async verifyAadhaar(
    userId: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        aadhaarVerified: true
      }
    });
  }

  /* ==========================
      VERIFY PAN
  ========================== */

  static async verifyPan(
    userId: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        panVerified: true
      }
    });
  }

  /* ==========================
      VERIFY BANK
  ========================== */

  static async verifyBank(
    userId: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        bankVerified: true
      }
    });
  }

  /* ==========================
      VERIFY SELFIE
  ========================== */

  static async verifySelfie(
    userId: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        selfieVerified: true
      }
    });
  }

  /* ==========================
      APPROVE KYC
  ========================== */

  static async approveKyc(
    userId: string,
    adminId: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        kycStatus: "APPROVED",
        verifiedBy: adminId,
        verifiedAt: new Date()
      }
    });
  }

  /* ==========================
      REJECT KYC
  ========================== */

  static async rejectKyc(
    userId: string,
    reason: string
  ) {

    return prisma.kyc.update({
      where: {
        userId
      },
      data: {
        kycStatus: "REJECTED",
        rejectionReason: reason
      }
    });
  }

  /* ==========================
      PENDING KYC
  ========================== */

  static async getPendingKyc() {

    return prisma.kyc.findMany({
      where: {
        kycStatus: "PENDING"
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      APPROVED KYC
  ========================== */

  static async getApprovedKyc() {

    return prisma.kyc.findMany({
      where: {
        kycStatus: "APPROVED"
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      REJECTED KYC
  ========================== */

  static async getRejectedKyc() {

    return prisma.kyc.findMany({
      where: {
        kycStatus: "REJECTED"
      },
      include: {
        user: true
      }
    });
  }

  /* ==========================
      SEARCH KYC
  ========================== */

  static async searchKyc(
    keyword: string
  ) {

    return prisma.kyc.findMany({
      where: {
        OR: [
          {
            aadhaarNumber: {
              contains: keyword
            }
          },
          {
            panNumber: {
              contains: keyword
            }
          }
        ]
      }
    });
  }

  /* ==========================
      ALL KYC
  ========================== */

  static async getAllKyc(
    page = 1,
    limit = 20
  ) {

    const skip = (page - 1) * limit;

    const [records, total] =
      await Promise.all([

        prisma.kyc.findMany({
          skip,
          take: limit,
          include: {
            user: true
          },
          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.kyc.count()
      ]);

    return {
      total,
      page,
      limit,
      records
    };
  }

  /* ==========================
      KYC ANALYTICS
  ========================== */

  static async getAnalytics() {

    const [
      totalKyc,
      approved,
      pending,
      rejected
    ] = await Promise.all([

      prisma.kyc.count(),

      prisma.kyc.count({
        where: {
          kycStatus: "APPROVED"
        }
      }),

      prisma.kyc.count({
        where: {
          kycStatus: "PENDING"
        }
      }),

      prisma.kyc.count({
        where: {
          kycStatus: "REJECTED"
        }
      })
    ]);

    return {
      totalKyc,
      approved,
      pending,
      rejected
    };
  }

  /* ==========================
      KYC COMPLETION %
  ========================== */

  static async getKycCompletion(
    userId: string
  ) {

    const kyc =
      await prisma.kyc.findUnique({
        where: { userId }
      });

    if (!kyc) return 0;

    let completed = 0;

    if (kyc.aadhaarVerified) completed++;
    if (kyc.panVerified) completed++;
    if (kyc.bankVerified) completed++;
    if (kyc.selfieVerified) completed++;

    return (completed / 4) * 100;
  }
}