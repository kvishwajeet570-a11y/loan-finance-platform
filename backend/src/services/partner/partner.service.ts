import prisma from "../../prisma/prisma";

interface CreatePartnerDTO {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  state?: string;
  city?: string;
  referralCode?: string;
}

class PartnerService {
  /**
   * Create Partner
   */
  async createPartner(
    data: CreatePartnerDTO
  ) {
    const existingPartner =
      await prisma.partner.findFirst({
        where: {
          OR: [
            { email: data.email },
            { phone: data.phone },
          ],
        },
      });

    if (existingPartner) {
      throw new Error(
        "Partner already exists"
      );
    }

    return prisma.partner.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }

  /**
   * Get Partner By Id
   */
  async getPartnerById(
    partnerId: string
  ) {
    return prisma.partner.findUnique({
      where: {
        id: partnerId,
      },

      include: {
        leads: true,
        commissions: true,
      },
    });
  }

  /**
   * Get All Partners
   */
  async getAllPartners(
    page = 1,
    limit = 20,
    search = ""
  ) {
    const skip =
      (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode:
                  "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode:
                  "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const [partners, total] =
      await Promise.all([
        prisma.partner.findMany({
          where,
          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.partner.count({
          where,
        }),
      ]);

    return {
      partners,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Approve Partner
   */
  async approvePartner(
    partnerId: string
  ) {
    return prisma.partner.update({
      where: {
        id: partnerId,
      },

      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });
  }

  /**
   * Reject Partner
   */
  async rejectPartner(
    partnerId: string,
    reason: string
  ) {
    return prisma.partner.update({
      where: {
        id: partnerId,
      },

      data: {
        status: "REJECTED",
        rejectionReason:
          reason,
      },
    });
  }

  /**
   * Assign Lead
   */
  async assignLead(
    partnerId: string,
    leadId: string
  ) {
    return prisma.loanApplication.update({
      where: {
        id: leadId,
      },

      data: {
        partnerId,
      },
    });
  }

  /**
   * Partner Leads
   */
  async getPartnerLeads(
    partnerId: string
  ) {
    return prisma.loanApplication.findMany({
      where: {
        partnerId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Partner Earnings
   */
  async getPartnerEarnings(
    partnerId: string
  ) {
    const earnings =
      await prisma.commission.aggregate({
        where: {
          partnerId,
          status: "APPROVED",
        },

        _sum: {
          commissionAmount: true,
        },
      });

    return {
      totalEarnings:
        earnings._sum
          .commissionAmount || 0,
    };
  }

  /**
   * Partner Dashboard
   */
  async getPartnerDashboard(
    partnerId: string
  ) {
    const [
      totalLeads,
      approvedLoans,
      earnings,
    ] = await Promise.all([
      prisma.loanApplication.count({
        where: {
          partnerId,
        },
      }),

      prisma.loanApplication.count({
        where: {
          partnerId,
          status:
            "APPROVED",
        },
      }),

      prisma.commission.aggregate({
        where: {
          partnerId,
        },

        _sum: {
          commissionAmount: true,
        },
      }),
    ]);

    return {
      totalLeads,

      approvedLoans,

      earnings:
        earnings._sum
          .commissionAmount || 0,
    };
  }

  /**
   * Top Partners
   */
  async getTopPartners() {
    return prisma.commission.groupBy({
      by: ["partnerId"],

      _sum: {
        commissionAmount: true,
      },

      orderBy: {
        _sum: {
          commissionAmount:
            "desc",
        },
      },

      take: 10,
    });
  }

  /**
   * Block Partner
   */
  async blockPartner(
    partnerId: string
  ) {
    return prisma.partner.update({
      where: {
        id: partnerId,
      },

      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Unblock Partner
   */
  async unblockPartner(
    partnerId: string
  ) {
    return prisma.partner.update({
      where: {
        id: partnerId,
      },

      data: {
        isBlocked: false,
      },
    });
  }

  /**
   * Delete Partner
   */
  async deletePartner(
    partnerId: string
  ) {
    return prisma.partner.delete({
      where: {
        id: partnerId,
      },
    });
  }

  /**
   * Partner Analytics
   */
  async getPartnerStats() {
    const [
      totalPartners,
      activePartners,
      blockedPartners,
      totalLeads,
    ] = await Promise.all([
      prisma.partner.count(),

      prisma.partner.count({
        where: {
          status:
            "APPROVED",
        },
      }),

      prisma.partner.count({
        where: {
          isBlocked: true,
        },
      }),

      prisma.loanApplication.count(),
    ]);

    return {
      totalPartners,
      activePartners,
      blockedPartners,
      totalLeads,
    };
  }
}

export default new PartnerService();