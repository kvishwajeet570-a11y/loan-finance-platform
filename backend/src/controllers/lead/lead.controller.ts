import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import leadService from "../../services/lead/lead.service";

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.createLead(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await leadService.getLeads({
      page,
      limit,
      search,
      status,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.getLeadById(
      String(req.params.id)
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};

export const assignLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.assignLead({
      leadId: String(req.params.id),
      assignedTo: req.body.assignedTo,
    });

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Assignment failed",
    });
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lead = await leadService.updateStatus({
  leadId: String(req.params.id),
  status: req.body.status,
});

    res.status(200).json({
      success: true,
      message: "Lead status updated",
      data: lead,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await leadService.softDelete(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const getSubAgentLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsaId = String(req.params.dsaId || "");

    if (!dsaId) {
      res.status(400).json({
        success: false,
        message: "DSA ID is required",
      });
      return;
    }

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const subAgentId = String(req.query.subAgentId || "").trim();

    console.log("[DIRECT-SUB-AGENT-LEADS] DSA:", dsaId);

    // Get real Sub Agents directly from PostgreSQL.
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

    console.log(
      "[DIRECT-SUB-AGENT-LEADS] Sub Agents:",
      subAgentIds
    );

    if (subAgentIds.length === 0) {
      res.status(200).json({
        success: true,
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
        subAgents: [],
      });
      return;
    }

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
          state: {
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

    console.log(
      "[DIRECT-SUB-AGENT-LEADS] WHERE:",
      JSON.stringify(where)
    );

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

    console.log(
      "[DIRECT-SUB-AGENT-LEADS] Leads found:",
      totalLeads
    );

    res.status(200).json({
      success: true,
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
    });
  } catch (error: any) {
    console.error(
      "[DIRECT-SUB-AGENT-LEADS] ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch Sub Agent leads",
    });
  }
};


export const getLeadAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await leadService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};

