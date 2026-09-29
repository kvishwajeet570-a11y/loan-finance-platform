import prisma from "../../prisma/prisma";
import subAgentService from "../sub-agent/sub-agent.service";

interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

class LeadService {
  async createLead(data: any) {
    return prisma.lead.create({
      data,
    });
  }

  async getLeads(filters: LeadFilters = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
    } = filters;

    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          mobileNumber: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.lead.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLeadById(id: string) {
    return prisma.lead.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async assignLead(data: {
    leadId: string;
    assignedTo: string;
  }) {
    return prisma.lead.update({
      where: {
        id: data.leadId,
      },
      data: {
        assignedTo: data.assignedTo,
      },
    });
  }

  async updateStatus(data: {
    leadId: string;
    status: string;
  }) {
    return prisma.lead.update({
      where: {
        id: data.leadId,
      },
      data: {
        status: data.status,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.lead.update({
      where: {
        id: String(id),
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async getAnalytics() {
    const totalLeads = await prisma.lead.count({
      where: {
        isDeleted: false,
      },
    });

    const newLeads = await prisma.lead.count({
      where: {
        status: "NEW",
        isDeleted: false,
      },
    });

    const assignedLeads = await prisma.lead.count({
      where: {
        assignedTo: {
          not: null,
        },
        isDeleted: false,
      },
    });

    return {
      totalLeads,
      newLeads,
      assignedLeads,
    };
  }
  async getSubAgentLeads(dsaId: string, filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    subAgentId?: string;
  } = {}) {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
      subAgentId = "",
    } = filters;

    // Use the existing working Sub Agent service.
    const allSubAgents = await prisma.user.findMany({
      where: {
        parentDsaId: dsaId,
        role: "SUB_AGENT",
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        city: true,
        state: true,
        pincode: true,
        isVerified: true,
        isActive: true,
        isBlocked: true,
        parentDsaId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const subAgents = subAgentId
      ? allSubAgents.filter((agent) => agent.id === subAgentId)
      : allSubAgents;

    const subAgentIds = subAgents.map((agent) => agent.id);

    console.log("[SUB-AGENT-LEADS DEBUG] dsaId =", dsaId);
    console.log("[SUB-AGENT-LEADS DEBUG] allSubAgents =", allSubAgents.map((a) => ({ id: a.id, name: a.name, parentDsaId: a.parentDsaId, role: a.role })));
    console.log("[SUB-AGENT-LEADS DEBUG] subAgentIds =", subAgentIds);

    if (subAgentIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        stats: {
          totalLeads: 0,
          newLeads: 0,
          contactedLeads: 0,
          convertedLeads: 0,
          highPriorityLeads: 0,
          totalLoanAmount: 0,
        },
        subAgents,
      };
    }

    console.log("[SUB-AGENT-LEADS DEBUG] subAgentIds.length =", subAgentIds.length);

    const where: any = {
      isDeleted: false,
      assignedTo: {
        in: subAgentIds,
      },
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          mobileNumber: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          productType: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    console.log("[SUB-AGENT-LEADS DEBUG] where =", JSON.stringify(where));

    const [
      data,
      totalLeads,
      newLeads,
      contactedLeads,
      convertedLeads,
      highPriorityLeads,
      loanAggregate,
    ] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.lead.count({
        where,
      }),

      prisma.lead.count({
        where: {
          ...where,
          status: "NEW",
        },
      }),

      prisma.lead.count({
        where: {
          ...where,
          status: "CONTACTED",
        },
      }),

      prisma.lead.count({
        where: {
          ...where,
          status: {
            in: ["CONVERTED", "APPROVED", "DISBURSED"],
          },
        },
      }),

      prisma.lead.count({
        where: {
          ...where,
          priority: "HIGH",
        },
      }),

      prisma.lead.aggregate({
        where,
        _sum: {
          loanAmount: true,
        },
      }),
    ]);

    const agentMap = new Map(
      allSubAgents.map((agent) => [agent.id, agent])
    );

    const enrichedData = data.map((lead) => ({
      ...lead,
      assignedAgent: lead.assignedTo
        ? agentMap.get(lead.assignedTo) || null
        : null,
    }));

    return {
      data: enrichedData,
      total: totalLeads,
      page,
      limit,
      totalPages: Math.ceil(totalLeads / limit),
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        highPriorityLeads,
        totalLoanAmount: loanAggregate._sum.loanAmount || 0,
      },
      subAgents,
    };
  }
}

export default new LeadService();

