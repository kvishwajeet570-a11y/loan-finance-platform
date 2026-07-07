import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE RECHARGE
 */
export const createRecharge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recharge = await prisma.recharge.create({
      data: {
        rechargeId: `RCG-${Date.now()}`,
        userId: req.body.userId,
        mobileNumber: req.body.mobileNumber,
        operator: req.body.operator,
        circle: req.body.circle,
        rechargeType: req.body.rechargeType,
        amount: Number(req.body.amount),
      },
    });

    res.status(201).json({
      success: true,
      data: recharge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Recharge creation failed",
    });
  }
};

/**
 * GET ALL RECHARGES
 */
export const getAllRecharges = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const skip = (page - 1) * limit;

    const [recharges, total] = await Promise.all([
      prisma.recharge.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phoneNo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.recharge.count(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: recharges,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharges",
    });
  }
};

/**
 * GET RECHARGE BY ID
 */
export const getRechargeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recharge = await prisma.recharge.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: true,
      },
    });

    if (!recharge) {
      res.status(404).json({
        success: false,
        message: "Recharge not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: recharge,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharge",
    });
  }
};

/**
 * MARK SUCCESS
 */
export const markRechargeSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recharge = await prisma.recharge.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "SUCCESS",
        transactionId: req.body.transactionId,
        apiResponse: req.body.apiResponse,
        processedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Recharge successful",
      data: recharge,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

/**
 * MARK FAILED
 */
export const markRechargeFailed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recharge = await prisma.recharge.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "FAILED",
        remarks: req.body.remarks,
      },
    });

    res.status(200).json({
      success: true,
      message: "Recharge marked failed",
      data: recharge,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/**
 * ANALYTICS
 */
export const rechargeAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalRecharges,
      successRecharges,
      failedRecharges,
      volume,
    ] = await Promise.all([
      prisma.recharge.count(),

      prisma.recharge.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.recharge.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.recharge.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: "SUCCESS",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecharges,
        successRecharges,
        failedRecharges,
        totalVolume:
          volume._sum.amount || 0,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};