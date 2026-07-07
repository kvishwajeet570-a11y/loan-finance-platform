import { prisma } from "../../prisma/prisma";

export class PartnerRepository {

  /* =========================
      CREATE PARTNER
  ========================= */

  static async createPartner(data: {
    userId: string;
    companyName?: string;
    partnerCode: string;
    partnerType: string;
  }) {

    return prisma.partnerProfile.create({
      data
    });
  }

  /* =========================
      GET BY ID
  ========================= */

  static async getPartnerById(
    id: string
  ) {

    return prisma.partnerProfile.findUnique({

      where: { id },

      include: {
        user: true
      }
    });
  }

  /* =========================
      GET BY USER ID
  ========================= */

  static async getPartnerByUserId(
    userId: string
  ) {

    return prisma.partnerProfile.findUnique({

      where: {
        userId
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      GET BY CODE
  ========================= */

  static async getPartnerByCode(
    partnerCode: string
  ) {

    return prisma.partnerProfile.findUnique({

      where: {
        partnerCode
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      UPDATE PARTNER
  ========================= */

  static async updatePartner(
    id: string,
    data: Partial<{
      companyName: string;
      partnerType: string;
      status: string;
    }>
  ) {

    return prisma.partnerProfile.update({

      where: {
        id
      },

      data
    });
  }

  /* =========================
      ACTIVATE PARTNER
  ========================= */

  static async activatePartner(
    id: string
  ) {

    return prisma.partnerProfile.update({

      where: {
        id
      },

      data: {
        status: "ACTIVE"
      }
    });
  }

  /* =========================
      BLOCK PARTNER
  ========================= */

  static async blockPartner(
    id: string
  ) {

    return prisma.partnerProfile.update({

      where: {
        id
      },

      data: {
        status: "BLOCKED"
      }
    });
  }

  /* =========================
      ADD LEAD
  ========================= */

  static async addLead(
    userId: string
  ) {

    return prisma.partnerProfile.update({

      where: {
        userId
      },

      data: {
        totalLeads: {
          increment: 1
        }
      }
    });
  }

  /* =========================
      ADD CUSTOMER
  ========================= */

  static async addCustomer(
    userId: string
  ) {

    return prisma.partnerProfile.update({

      where: {
        userId
      },

      data: {
        totalCustomers: {
          increment: 1
        }
      }
    });
  }

  /* =========================
      ADD LOAN
  ========================= */

  static async addLoan(
    userId: string
  ) {

    return prisma.partnerProfile.update({

      where: {
        userId
      },

      data: {
        totalLoans: {
          increment: 1
        }
      }
    });
  }

  /* =========================
      ADD BUSINESS
  ========================= */

  static async addBusinessVolume(
    userId: string,
    amount: number
  ) {

    return prisma.partnerProfile.update({

      where: {
        userId
      },

      data: {
        totalBusiness: {
          increment: amount
        }
      }
    });
  }

  /* =========================
      ADD COMMISSION
  ========================= */

  static async addCommission(
    userId: string,
    amount: number
  ) {

    return prisma.partnerProfile.update({

      where: {
        userId
      },

      data: {
        totalCommission: {
          increment: amount
        }
      }
    });
  }

  /* =========================
      TOP PARTNERS
  ========================= */

  static async getTopPartners(
    limit = 10
  ) {

    return prisma.partnerProfile.findMany({

      take: limit,

      include: {
        user: true
      },

      orderBy: {
        totalBusiness: "desc"
      }
    });
  }

  /* =========================
      SEARCH PARTNERS
  ========================= */

  static async searchPartners(
    keyword: string
  ) {

    return prisma.partnerProfile.findMany({

      where: {

        OR: [

          {
            partnerCode: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            companyName: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      ALL PARTNERS
  ========================= */

  static async getAllPartners(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [partners, total] =
      await Promise.all([

        prisma.partnerProfile.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.partnerProfile.count()
      ]);

    return {
      partners,
      total,
      page,
      limit
    };
  }

  /* =========================
      DELETE PARTNER
  ========================= */

  static async deletePartner(
    id: string
  ) {

    return prisma.partnerProfile.delete({
      where: { id }
    });
  }

  /* =========================
      PARTNER ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalPartners,
      activePartners,
      totalBusiness,
      totalCommission
    ] = await Promise.all([

      prisma.partnerProfile.count(),

      prisma.partnerProfile.count({
        where: {
          status: "ACTIVE"
        }
      }),

      prisma.partnerProfile.aggregate({
        _sum: {
          totalBusiness: true
        }
      }),

      prisma.partnerProfile.aggregate({
        _sum: {
          totalCommission: true
        }
      })
    ]);

    return {

      totalPartners,

      activePartners,

      totalBusiness:
        totalBusiness._sum.totalBusiness || 0,

      totalCommission:
        totalCommission._sum.totalCommission || 0
    };
  }

  /* =========================
      DASHBOARD
  ========================= */

  static async getPartnerDashboard(
    userId: string
  ) {

    const partner =
      await prisma.partnerProfile.findUnique({
        where: {
          userId
        }
      });

    if (!partner) {
      return null;
    }

    return {
      totalLeads: partner.totalLeads,
      totalCustomers: partner.totalCustomers,
      totalLoans: partner.totalLoans,
      totalBusiness: partner.totalBusiness,
      totalCommission: partner.totalCommission
    };
  }
}