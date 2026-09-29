import prisma from "../../prisma/prisma";

export class PartnerRepository {
  /* =========================
      CREATE PARTNER
  ========================= */

  static async createPartner(data: {
    companyName: string;
    email: string;
    phone?: string;
    contactPerson?: string;
    partnerCode?: string;
    city?: string;
    state?: string;
  }) {
    return prisma.partner.create({
      data: {
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        contactPerson: data.contactPerson,
        partnerCode: data.partnerCode,
        city: data.city,
        state: data.state,
      },
    });
  }

  /* =========================
      GET BY ID
  ========================= */

  static async getPartnerById(id: string) {
    return prisma.partner.findUnique({
      where: { id },
    });
  }

  /* =========================
      GET BY EMAIL
  ========================= */

  static async getPartnerByEmail(email: string) {
    return prisma.partner.findUnique({
      where: { email },
    });
  }

  /* =========================
      GET BY CODE
  ========================= */

  static async getPartnerByCode(partnerCode: string) {
    return prisma.partner.findUnique({
      where: { partnerCode },
    });
  }

  /* =========================
      UPDATE PARTNER
  ========================= */

  static async updatePartner(
    id: string,
    data: Partial<{
      companyName: string;
      contactPerson: string;
      phone: string;
      city: string;
      state: string;
      remarks: string;
      status: string;
    }>
  ) {
    return prisma.partner.update({
      where: { id },
      data,
    });
  }

  /* =========================
      APPROVE PARTNER
  ========================= */

  static async approvePartner(
    id: string,
    approvedBy?: string
  ) {
    return prisma.partner.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }

  /* =========================
      REJECT PARTNER
  ========================= */

  static async rejectPartner(
    id: string,
    rejectionReason?: string
  ) {
    return prisma.partner.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason,
      },
    });
  }

  /* =========================
      BLOCK PARTNER
  ========================= */

  static async blockPartner(id: string) {
    return prisma.partner.update({
      where: { id },
      data: {
        isBlocked: true,
      },
    });
  }

  /* =========================
      UNBLOCK PARTNER
  ========================= */

  static async unblockPartner(id: string) {
    return prisma.partner.update({
      where: { id },
      data: {
        isBlocked: false,
      },
    });
  }

  /* =========================
      TOGGLE ACTIVE
  ========================= */

  static async togglePartnerStatus(
    id: string,
    isActive: boolean
  ) {
    return prisma.partner.update({
      where: { id },
      data: {
        isActive,
      },
    });
  }

  /* =========================
      SEARCH PARTNERS
  ========================= */

  static async searchPartners(keyword: string) {
    return prisma.partner.findMany({
      where: {
        OR: [
          {
            companyName: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
          {
            phone: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
          {
            partnerCode: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* =========================
      GET ALL PARTNERS
  ========================= */

  static async getAllPartners(
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.partner.count(),
    ]);

    return {
      partners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /* =========================
      DELETE PARTNER
  ========================= */

  static async deletePartner(id: string) {
    return prisma.partner.delete({
      where: { id },
    });
  }

  /* =========================
      ANALYTICS
  ========================= */

  static async getAnalytics() {
    const [
      totalPartners,
      activePartners,
      blockedPartners,
      approvedPartners,
      pendingPartners,
    ] = await Promise.all([
      prisma.partner.count(),

      prisma.partner.count({
        where: {
          isActive: true,
        },
      }),

      prisma.partner.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.partner.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.partner.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    return {
      totalPartners,
      activePartners,
      blockedPartners,
      approvedPartners,
      pendingPartners,
    };
  }

  /* =========================
      DASHBOARD
  ========================= */

  static async getPartnerDashboard(id: string) {
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return null;
    }

    return {
      id: partner.id,
      companyName: partner.companyName,
      email: partner.email,
      status: partner.status,
      isActive: partner.isActive,
      isBlocked: partner.isBlocked,
      createdAt: partner.createdAt,
    };
  }
}