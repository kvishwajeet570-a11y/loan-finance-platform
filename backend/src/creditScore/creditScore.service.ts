import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE CREDIT SCORE
 */
export const createCreditScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      userId,
      score,
      bureau,
      remarks,
    } = req.body;

    const user =
      await prisma.user.findUnique({
        where: { id: userId },
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    let riskCategory = "HIGH";
    let eligibleAmount = 50000;

    if (score >= 750) {
      riskCategory = "LOW";
      eligibleAmount = 1000000;
    } else if (score >= 650) {
      riskCategory = "MEDIUM";
      eligibleAmount = 500000;
    }

    const credit =
      await prisma.creditScore.create({
        data: {
          userId,
          score,
          bureau,
          remarks,
          riskCategory,
          eligibleAmount,
        },
      });

    res.status(201).json({
      success: true,
      data: credit,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Credit score creation failed",
      error,
    });

  }
};

/**
 * GET ALL CREDIT SCORES
 */
export const getCreditScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const search =
      String(req.query.search || "");

    const data =
      await prisma.creditScore.findMany({
        where: {
          OR: [
            {
              bureau: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              user: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
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
        skip,
        take: limit,
        orderBy: {
          checkedAt: "desc",
        },
      });

    const total =
      await prisma.creditScore.count();

    res.status(200).json({
      success: true,
      total,
      page,
      data,
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed",
    });

  }
};

/**
 * GET SINGLE CREDIT SCORE
 */
export const getCreditScoreById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const credit =
      await prisma.creditScore.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          user: true,
        },
      });

    if (!credit) {
      res.status(404).json({
        success: false,
        message: "Record not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: credit,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * USER CREDIT HISTORY
 */
export const getUserCreditHistory =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const records =
        await prisma.creditScore.findMany({
          where: {
            userId: req.params.userId,
          },
          orderBy: {
            checkedAt: "desc",
          },
        });

      res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };

/**
 * UPDATE CREDIT SCORE
 */
export const updateCreditScore =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const credit =
        await prisma.creditScore.update({
          where: {
            id: req.params.id,
          },
          data: req.body,
        });

      res.status(200).json({
        success: true,
        data: credit,
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };

/**
 * SOFT DELETE
 */
export const deleteCreditScore =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      await prisma.creditScore.update({
        where: {
          id: req.params.id,
        },
        data: {
          status: "DELETED",
        },
      });

      res.status(200).json({
        success: true,
        message: "Deleted successfully",
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };

/**
 * CREDIT ANALYTICS
 */
export const creditAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const [
        totalChecks,
        lowRisk,
        mediumRisk,
        highRisk,
      ] = await Promise.all([

        prisma.creditScore.count(),

        prisma.creditScore.count({
          where: {
            riskCategory: "LOW",
          },
        }),

        prisma.creditScore.count({
          where: {
            riskCategory: "MEDIUM",
          },
        }),

        prisma.creditScore.count({
          where: {
            riskCategory: "HIGH",
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalChecks,
          lowRisk,
          mediumRisk,
          highRisk,
        },
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };