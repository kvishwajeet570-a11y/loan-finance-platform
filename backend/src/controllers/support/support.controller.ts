import {

  Request,
  Response,

} from "express";

import prisma from "../../prisma/prisma";
import { id } from "zod/v4/locales";


/* ========================================
   CREATE SUPPORT TICKET
======================================== */

export const createTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      subject,
      message,
      priority,
    } = req.body;

    /* ========================================
       VALIDATION
    ======================================== */

    if (!userId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* ========================================
       CHECK USER
    ======================================== */

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ========================================
       CREATE TICKET
    ======================================== */

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}`,
        userId,
        subject,
        message,
        priority: priority || "medium",
        status: "open",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
    });
  }
};
    

/* ========================================
   GET USER TICKETS
======================================== */

export const getUserTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user tickets",
    });
  }
};

/* ========================================
   GET ALL SUPPORT TICKETS
======================================== */

export const getAllTickets =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const tickets =
        await prisma.supportTicket.findMany({

          include: {

            user: {

              select: {

                id: true,

                name: true,

                email: true,

              },

            },

          },

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        count:
          tickets.length,

        tickets,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch support tickets",

      });

    }

  };


/* ========================================
   UPDATE TICKET STATUS
======================================== */

export const updateTicketStatus =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const {

        status,
        adminReply,

      } = req.body;


      /* ========================================
         FIND TICKET
      ======================================== */

      const existingTicket =
        await prisma.supportTicket.findUnique({

          where: {

            id,

          },

        });


      if (!existingTicket) {

        return res.status(404).json({

          success: false,

          message:
            "Ticket not found",

        });

      }


      /* ========================================
         UPDATE TICKET
      ======================================== */

      const updatedTicket =
        await prisma.supportTicket.update({

          where: {

            id,

          },

          data: {

            status,

            adminReply,

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      await prisma.notification.create({

        data: {

          userId:
            existingTicket.userId,

          title:
            "Support Ticket Updated",

          message:
            `Your ticket "${existingTicket.subject}" status changed to ${status}.`,

          type:
            "support",

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Ticket updated successfully",

        ticket:
          updatedTicket,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to update ticket",

      });

    }

  };


/* ========================================
   DELETE SUPPORT TICKET
======================================== */

export const deleteTicket =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const ticket =
        await prisma.supportTicket.findUnique({

          where: {

            id,

          },

        });


      if (!ticket) {

        return res.status(404).json({

          success: false,

          message:
            "Ticket not found",

        });

      }


      await prisma.supportTicket.delete({

        where: {

          id,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Support ticket deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete support ticket",

      });

    }

  };
  /* ========================================
   GET TICKET BY ID
======================================== */

export const getTicketById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: true,
        replies: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
    });
  }
};

/* ========================================
   UPDATE TICKET
======================================== */

export const updateTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      ticket: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update ticket",
    });
  }
};

/* ========================================
   ASSIGN TICKET
======================================== */

export const assignTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id: String(req.params.id) },
      data: {
        assignedTo,
        status: "assigned",
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign ticket",
    });
  }
};

/* ========================================
   TRANSFER TICKET
======================================== */

export const transferTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id: String(req.params.id) },
      data: {
        assignedTo,
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to transfer ticket",
    });
  }
};

/* ========================================
   CLOSE TICKET
======================================== */

export const closeTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: "closed",
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to close ticket",
    });
  }
};

/* ========================================
   REOPEN TICKET
======================================== */

export const reopenTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: "open",
        resolvedAt: null,
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reopen ticket",
    });
  }
};

/* ========================================
   RESOLVE TICKET
======================================== */

export const resolveTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { adminReply } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id: String(req.params.id) },
      data: {
        status: "resolved",
        adminReply,
        resolvedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to resolve ticket",
    });
  }
};

/* ========================================
   ADD REPLY
======================================== */

export const addReply = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: "userId and message are required",
      });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const reply = await prisma.supportReply.create({
      data: {
        ticketId: id,
        userId,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      reply,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
};


/* ========================================
   GET TICKET REPLIES
======================================== */

export const getTicketReplies = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const replies = await prisma.supportReply.findMany({
      where: {
        ticketId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: replies.length,
      replies,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch replies",
    });
  }
};


/* ========================================
   GET MY TICKETS
======================================== */

export const getMyTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};


/* ========================================
   GET PENDING TICKETS
======================================== */

export const getPendingTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending tickets",
    });
  }
};


/* ========================================
   GET OPEN TICKETS
======================================== */

export const getOpenTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: "open",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch open tickets",
    });
  }
};


/* ========================================
   GET RESOLVED TICKETS
======================================== */

export const getResolvedTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: "resolved",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resolved tickets",
    });
  }
};


/* ========================================
   GET CLOSED TICKETS
======================================== */

export const getClosedTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: "closed",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch closed tickets",
    });
  }
};


/* ========================================
   GET ESCALATED TICKETS
======================================== */

export const getEscalatedTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: {
        status: "escalated",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch escalated tickets",
    });
  }
};

/* ========================================
   ESCALATE TICKET
======================================== */

export const escalateTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updated = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: "escalated",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Ticket escalated successfully",
      ticket: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to escalate ticket",
    });
  }
};


/* ========================================
   SUPPORT DASHBOARD
======================================== */

export const getSupportDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      total,
      open,
      pending,
      resolved,
      closed,
      escalated,
    ] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({
        where: { status: "open" },
      }),
      prisma.supportTicket.count({
        where: { status: "pending" },
      }),
      prisma.supportTicket.count({
        where: { status: "resolved" },
      }),
      prisma.supportTicket.count({
        where: { status: "closed" },
      }),
      prisma.supportTicket.count({
        where: { status: "escalated" },
      }),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        total,
        open,
        pending,
        resolved,
        closed,
        escalated,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};


/* ========================================
   SUPPORT ANALYTICS
======================================== */

export const getSupportAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const analytics = await prisma.supportTicket.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};


/* ========================================
   RECENT TICKETS
======================================== */

export const getRecentTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent tickets",
    });
  }
};


/* ========================================
   TOP AGENTS
======================================== */

export const getTopAgents = async (
  req: Request,
  res: Response
) => {
  try {
    const agents = await prisma.supportTicket.groupBy({
      by: ["assignedTo"],
      _count: {
        assignedTo: true,
      },
      orderBy: {
        _count: {
          assignedTo: "desc",
        },
      },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      agents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch top agents",
    });
  }
};


/* ========================================
   AGENT PERFORMANCE
======================================== */

export const getAgentPerformance = async (
  req: Request,
  res: Response
) => {
  try {
    const performance = await prisma.supportTicket.groupBy({
      by: ["assignedTo", "status"],
      _count: true,
    });

    return res.status(200).json({
      success: true,
      performance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch agent performance",
    });
  }
};


/* ========================================
   DEPARTMENT PERFORMANCE
======================================== */

export const getDepartmentPerformance = async (
  req: Request,
  res: Response
) => {
  try {
    const performance = await prisma.supportTicket.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    return res.status(200).json({
      success: true,
      performance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch department performance",
    });
  }
};

/* ========================================
   GET CUSTOMER SUPPORT HISTORY
======================================== */

export const getCustomerSupportHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const customerId = String(req.params.customerId);

    const history = await prisma.supportTicket.findMany({
      where: {
        userId: customerId,
      },
      include: {
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer support history",
    });
  }
};
/* ========================================
   SEARCH TICKETS
======================================== */

export const searchTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const keyword = String(req.query.keyword || "");

    const tickets = await prisma.supportTicket.findMany({
      where: {
        OR: [
          {
            subject: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            message: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};


/* ========================================
   EXPORT TICKETS EXCEL
======================================== */

export const exportTicketsExcel = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Excel export data generated successfully",
      total: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to export Excel",
    });
  }
};


/* ========================================
   EXPORT TICKETS PDF
======================================== */

export const exportTicketsPdf = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "PDF export data generated successfully",
      total: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to export PDF",
    });
  }
};

/* ========================================
   TICKET AUDIT LOGS
======================================== */

export const getTicketAuditLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.query;

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: String(id),
      },
      include: {
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      auditLog: ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};


/* ========================================
   BULK ASSIGN TICKETS
======================================== */

export const bulkAssignTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketIds, assignedTo } = req.body;

    if (
      !Array.isArray(ticketIds) ||
      ticketIds.length === 0 ||
      !assignedTo
    ) {
      return res.status(400).json({
        success: false,
        message: "ticketIds and assignedTo are required",
      });
    }

    const result = await prisma.supportTicket.updateMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      data: {
        assignedTo,
        status: "assigned",
      },
    });

    return res.status(200).json({
      success: true,
      updated: result.count,
      message: "Tickets assigned successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bulk assignment failed",
    });
  }
};


/* ========================================
   BULK CLOSE TICKETS
======================================== */

export const bulkCloseTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketIds } = req.body;

    if (
      !Array.isArray(ticketIds) ||
      ticketIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "ticketIds are required",
      });
    }

    const result = await prisma.supportTicket.updateMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      data: {
        status: "closed",
      },
    });

    return res.status(200).json({
      success: true,
      updated: result.count,
      message: "Tickets closed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bulk close failed",
    });
  }
};


/* ========================================
   BULK DELETE TICKETS
======================================== */

export const bulkDeleteTickets = async (
  req: Request,
  res: Response
) => {
  try {
    const { ticketIds } = req.body;

    if (
      !Array.isArray(ticketIds) ||
      ticketIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "ticketIds are required",
      });
    }

    const result = await prisma.supportTicket.deleteMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
    });

    return res.status(200).json({
      success: true,
      deleted: result.count,
      message: "Tickets deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Bulk delete failed",
    });
  }
};

/* ========================================
   LIVE SUPPORT CHATS
======================================== */

export const getLiveSupportChats = async (
  req: Request,
  res: Response
) => {
  try {
    const chats = await prisma.supportTicket.findMany({
      where: {
        status: {
          in: ["open", "assigned", "escalated"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
  createdAt: "desc",
},
    });

    return res.status(200).json({
      success: true,
      total: chats.length,
      chats,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch live chats",
    });
  }
};


/* ========================================
   CHAT HISTORY
======================================== */

export const getChatHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const chatId = String(req.params.chatId);

    const chat = await prisma.supportTicket.findUnique({
      where: {
        id: chatId,
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};
/* ========================================
   SEND SUPPORT MESSAGE
======================================== */

export const sendSupportMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      ticketId,
      userId,
      message,
    } = req.body;

    if (!ticketId || !userId || !message) {
      return res.status(400).json({
        success: false,
        message: "ticketId, userId and message are required",
      });
    }

    const reply = await prisma.supportReply.create({
      data: {
        ticketId,
        userId,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      reply,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};


/* ========================================
   CREATE FAQ TICKET
======================================== */
export const createFaqTicket = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, subject, message, category } = req.body;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: `FAQ-${Date.now()}`,
        userId,
        subject,
        message,
        category,
        priority: "medium",
        status: "faq",
      },
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create FAQ ticket",
    });
  }
};

/* ========================================
   CONVERT TICKET TO FAQ
======================================== */

export const convertTicketToFaq = async (
  req: Request,
  res: Response
) => {
  try {
    const ticketId = String(req.params.ticketId);

    const ticket = await prisma.supportTicket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: "faq",
      },
    });

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to convert ticket",
    });
  }
};

/* ========================================
   SLA REPORT
======================================== */

export const getSlaReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await prisma.supportTicket.groupBy({
      by: ["priority"],
      _count: true,
    });

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate SLA report",
    });
  }
};


/* ========================================
   RESPONSE TIME REPORT
======================================== */

export const getResponseTimeReport = async (
  req: Request,
  res: Response
) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      select: {
        id: true,
        subject: true,
        createdAt: true,
        resolvedAt: true,
        status: true,
      },
    });

    return res.status(200).json({
      success: true,
      report: tickets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate response time report",
    });
  }
};


/* ========================================
   SUPPORT STATISTICS
======================================== */

export const getTicketStatistics = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      total,
      open,
      pending,
      resolved,
      closed,
      escalated,
    ] = await Promise.all([
      prisma.supportTicket.count(),
      prisma.supportTicket.count({ where: { status: "open" } }),
      prisma.supportTicket.count({ where: { status: "pending" } }),
      prisma.supportTicket.count({ where: { status: "resolved" } }),
      prisma.supportTicket.count({ where: { status: "closed" } }),
      prisma.supportTicket.count({ where: { status: "escalated" } }),
    ]);

    return res.status(200).json({
      success: true,
      statistics: {
        total,
        open,
        pending,
        resolved,
        closed,
        escalated,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
};
