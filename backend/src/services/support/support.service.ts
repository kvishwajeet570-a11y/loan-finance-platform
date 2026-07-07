import prisma from "../../prisma/prisma";

interface CreateTicketDTO {
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority?: string;
}

class SupportService {
  /**
   * Create Ticket
   */
  async createTicket(
    data: CreateTicketDTO
  ) {
    return prisma.supportTicket.create({
      data: {
        userId: data.userId,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority:
          data.priority || "MEDIUM",
        status: "OPEN",
      },
    });
  }

  /**
   * Get Ticket By ID
   */
  async getTicketById(
    ticketId: string
  ) {
    return prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },

      include: {
        user: true,
        assignedAdmin: true,
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  /**
   * Get All Tickets
   */
  async getAllTickets(
    page = 1,
    limit = 20,
    status?: string
  ) {
    const skip =
      (page - 1) * limit;

    const where = status
      ? { status }
      : {};

    const [tickets, total] =
      await Promise.all([
        prisma.supportTicket.findMany({
          where,

          skip,
          take: limit,

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
        }),

        prisma.supportTicket.count({
          where,
        }),
      ]);

    return {
      tickets,
      total,
      page,
      pages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * Assign Ticket
   */
  async assignTicket(
    ticketId: string,
    adminId: string
  ) {
    return prisma.supportTicket.update({
      where: {
        id: ticketId,
      },

      data: {
        assignedTo:
          adminId,
        status:
          "ASSIGNED",
      },
    });
  }

  /**
   * Add Reply
   */
  async addReply(
    ticketId: string,
    userId: string,
    message: string
  ) {
    return prisma.supportReply.create({
      data: {
        ticketId,
        userId,
        message,
      },
    });
  }

  /**
   * Resolve Ticket
   */
  async resolveTicket(
    ticketId: string
  ) {
    return prisma.supportTicket.update({
      where: {
        id: ticketId,
      },

      data: {
        status:
          "RESOLVED",
        resolvedAt:
          new Date(),
      },
    });
  }

  /**
   * Close Ticket
   */
  async closeTicket(
    ticketId: string
  ) {
    return prisma.supportTicket.update({
      where: {
        id: ticketId,
      },

      data: {
        status:
          "CLOSED",
      },
    });
  }

  /**
   * Escalate Ticket
   */
  async escalateTicket(
    ticketId: string
  ) {
    return prisma.supportTicket.update({
      where: {
        id: ticketId,
      },

      data: {
        priority: "HIGH",
        status:
          "ESCALATED",
      },
    });
  }

  /**
   * User Tickets
   */
  async getUserTickets(
    userId: string
  ) {
    return prisma.supportTicket.findMany({
      where: {
        userId,
      },

      include: {
        replies: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Admin Tickets
   */
  async getAssignedTickets(
    adminId: string
  ) {
    return prisma.supportTicket.findMany({
      where: {
        assignedTo:
          adminId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Support Analytics
   */
  async getSupportStats() {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      escalatedTickets,
    ] = await Promise.all([
      prisma.supportTicket.count(),

      prisma.supportTicket.count({
        where: {
          status: "OPEN",
        },
      }),

      prisma.supportTicket.count({
        where: {
          status:
            "RESOLVED",
        },
      }),

      prisma.supportTicket.count({
        where: {
          status:
            "CLOSED",
        },
      }),

      prisma.supportTicket.count({
        where: {
          status:
            "ESCALATED",
        },
      }),
    ]);

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      escalatedTickets,
    };
  }

  /**
   * SLA Report
   */
  async slaReport() {
    return prisma.supportTicket.findMany({
      where: {
        status: {
          not: "CLOSED",
        },
      },

      select: {
        id: true,
        subject: true,
        priority: true,
        createdAt: true,
      },
    });
  }

  /**
   * Recent Support Activity
   */
  async recentActivities() {
    return prisma.supportReply.findMany({
      take: 50,

      include: {
        ticket: true,
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new SupportService();