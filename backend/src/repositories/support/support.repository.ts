import { prisma } from "../../prisma";

export class SupportRepository {

  /* =========================
      CREATE TICKET
  ========================= */

  static async createTicket(data: {
    ticketNumber: string;
    userId: string;
    subject: string;
    description: string;
    category: string;
    priority?: string;
    attachments?: any;
  }) {

    return prisma.supportTicket.create({
      data
    });
  }

  /* =========================
      GET TICKET
  ========================= */

  static async getTicketById(
    id: string
  ) {

    return prisma.supportTicket.findUnique({

      where: { id },

      include: {
        user: true
      }
    });
  }

  /* =========================
      GET BY TICKET NUMBER
  ========================= */

  static async getByTicketNumber(
    ticketNumber: string
  ) {

    return prisma.supportTicket.findUnique({

      where: {
        ticketNumber
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      USER TICKETS
  ========================= */

  static async getUserTickets(
    userId: string
  ) {

    return prisma.supportTicket.findMany({

      where: {
        userId
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      ASSIGN TICKET
  ========================= */

  static async assignTicket(
    ticketId: string,
    assignedTo: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        assignedTo,
        status: "ASSIGNED"
      }
    });
  }

  /* =========================
      IN PROGRESS
  ========================= */

  static async markInProgress(
    ticketId: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        status: "IN_PROGRESS"
      }
    });
  }

  /* =========================
      RESOLVE TICKET
  ========================= */

  static async resolveTicket(
    ticketId: string,
    resolution: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        status: "RESOLVED",
        resolution,
        resolvedAt: new Date()
      }
    });
  }

  /* =========================
      CLOSE TICKET
  ========================= */

  static async closeTicket(
    ticketId: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        status: "CLOSED",
        closedAt: new Date()
      }
    });
  }

  /* =========================
      REOPEN TICKET
  ========================= */

  static async reopenTicket(
    ticketId: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        status: "OPEN",
        resolvedAt: null,
        closedAt: null
      }
    });
  }

  /* =========================
      UPDATE PRIORITY
  ========================= */

  static async updatePriority(
    ticketId: string,
    priority: string
  ) {

    return prisma.supportTicket.update({

      where: {
        id: ticketId
      },

      data: {
        priority
      }
    });
  }

  /* =========================
      SEARCH TICKETS
  ========================= */

  static async searchTickets(
    keyword: string
  ) {

    return prisma.supportTicket.findMany({

      where: {

        OR: [

          {
            ticketNumber: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            subject: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            description: {
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
      GET BY STATUS
  ========================= */

  static async getByStatus(
    status: string
  ) {

    return prisma.supportTicket.findMany({

      where: {
        status
      },

      include: {
        user: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =========================
      GET BY PRIORITY
  ========================= */

  static async getByPriority(
    priority: string
  ) {

    return prisma.supportTicket.findMany({

      where: {
        priority
      },

      include: {
        user: true
      }
    });
  }

  /* =========================
      ALL TICKETS
  ========================= */

  static async getAllTickets(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [tickets, total] =
      await Promise.all([

        prisma.supportTicket.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.supportTicket.count()
      ]);

    return {
      tickets,
      total,
      page,
      limit
    };
  }

  /* =========================
      SUPPORT ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      highPriority
    ] = await Promise.all([

      prisma.supportTicket.count(),

      prisma.supportTicket.count({
        where: {
          status: "OPEN"
        }
      }),

      prisma.supportTicket.count({
        where: {
          status: "RESOLVED"
        }
      }),

      prisma.supportTicket.count({
        where: {
          status: "CLOSED"
        }
      }),

      prisma.supportTicket.count({
        where: {
          priority: "HIGH"
        }
      })
    ]);

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      highPriority
    };
  }

  /* =========================
      SUPPORT DASHBOARD
  ========================= */

  static async getDashboard() {

    const [
      analytics,
      recentTickets
    ] = await Promise.all([

      this.getAnalytics(),

      prisma.supportTicket.findMany({

        take: 10,

        include: {
          user: true
        },

        orderBy: {
          createdAt: "desc"
        }
      })
    ]);

    return {
      analytics,
      recentTickets
    };
  }
}