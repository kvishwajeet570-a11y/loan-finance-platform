import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

export default class CommissionController {
  static async createCommission(req: Request, res: Response) {
    try {
      const {
  userId,
  loanId,
  partnerId,
  amount,
  loanAmount,
  commissionAmount,
  source,
} = req.body;

      const commission = await prisma.commission.create({
        data: {
  userId,
  loanId,
  partnerId,
  amount,
  loanAmount,
  commissionAmount,
  source,
  status: "PENDING",
},
      });

      return res.status(201).json({
        success: true,
        commission,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create commission",
      });
    }
  }

  static async getAllCommissions(
    req: Request,
    res: Response
  ) {
    try {
      const commissions =
        await prisma.commission.findMany({
          include: {
            user: true,
            loan: true,
            partner: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        commissions,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getPendingCommissions(
    req: Request,
    res: Response
  ) {
    try {
      const commissions =
        await prisma.commission.findMany({
          where: {
            status: "PENDING",
          },
        });

      return res.json({
        success: true,
        commissions,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getUserCommissions(
    req: Request,
    res: Response
  ) {
    try {
      const userId = String(
        req.params.userId
      );

      const commissions =
        await prisma.commission.findMany({
          where: {
            userId,
          },
          include: {
            loan: true,
            partner: true,
          },
        });

      return res.json({
        success: true,
        commissions,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getCommissionById(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const commission =
        await prisma.commission.findUnique({
          where: {
            id,
          },
          include: {
            user: true,
            loan: true,
            partner: true,
          },
        });

      if (!commission) {
        return res.status(404).json({
          success: false,
          message: "Commission not found",
        });
      }

      return res.json({
        success: true,
        commission,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async approveCommission(
  req: Request,
  res: Response
) {
  try {
    const id = String(req.params.id);

    const commission =
      await prisma.commission.update({
        where: {
          id,
        },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });

    return res.json({
      success: true,
      commission,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
}

  static async rejectCommission(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const { rejectionReason } =
        req.body;

      const commission =
        await prisma.commission.update({
          where: {
            id,
          },
          data: {
            status: "REJECTED",
            rejectionReason,
          },
        });

      return res.json({
        success: true,
        commission,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async markCommissionPaid(
    req: Request,
    res: Response
  ) {
    try {
      const id = String(req.params.id);

      const commission =
        await prisma.commission.update({
          where: {
            id,
          },
          data: {
  status: "PAID",
}
        });

      return res.json({
        success: true,
        commission,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async searchCommissions(
    req: Request,
    res: Response
  ) {
    try {
      const search =
        typeof req.query.search ===
        "string"
          ? req.query.search
          : "";

      const commissions =
        await prisma.commission.findMany({
          where: {
            OR: [
              {
                source: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            user: true,
            loan: true,
            partner: true,
          },
        });

      return res.json({
        success: true,
        commissions,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getCommissionAnalytics(
    req: Request,
    res: Response
  ) {
    try {
      const [
        total,
        approved,
        pending,
        rejected,
      ] = await Promise.all([
        prisma.commission.count(),

        prisma.commission.count({
          where: {
            status: "APPROVED",
          },
        }),

        prisma.commission.count({
          where: {
            status: "PENDING",
          },
        }),

        prisma.commission.count({
          where: {
            status: "REJECTED",
          },
        }),
      ]);

      return res.json({
        success: true,
        analytics: {
          total,
          approved,
          pending,
          rejected,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getTopEarners(
    req: Request,
    res: Response
  ) {
    try {
      const data =
        await prisma.commission.groupBy({
          by: ["userId"],
          _sum: {
            commissionAmount: true,
          },
          orderBy: {
            _sum: {
              commissionAmount: "desc",
            },
          },
          take: 10,
        });

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  static async getMonthlyCommission(
    req: Request,
    res: Response
  ) {
    try {
      const now = new Date();

      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const data =
        await prisma.commission.aggregate({
          where: {
            createdAt: {
              gte: start,
            },
          },
          _sum: {
            commissionAmount: true,
          },
        });

      return res.json({
        success: true,
        monthlyCommission:
          data._sum
            .commissionAmount || 0,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
      });
    }
  }
}