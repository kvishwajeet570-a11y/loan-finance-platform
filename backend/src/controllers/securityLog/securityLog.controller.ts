import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * GET ALL SECURITY LOGS
 */
export const getAllSecurityLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const severity = req.query.severity as string;

    const skip = (page - 1) * limit;

    const where = severity
      ? { severity }
      : {};

    const [logs, total] = await Promise.all([
      prisma.securityLog.findMany({
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
      prisma.securityLog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: logs,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch security logs",
    });
  }
};

/**
 * GET USER SECURITY LOGS
 */
export const getUserSecurityLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const logs =
      await prisma.securityLog.findMany({
        where: {
          userId: req.params.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

/**
 * CREATE SECURITY EVENT
 */
export const createSecurityLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const log =
      await prisma.securityLog.create({
        data: {
          userId: req.body.userId,
          action: req.body.action,
          severity: req.body.severity,
          module: req.body.module,
          description:
            req.body.description,
          ipAddress: req.ip,
          userAgent:
            req.headers["user-agent"],
          status: req.body.status,
          metadata: req.body.metadata,
        },
      });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create log",
    });
  }
};

/**
 * DELETE OLD LOGS
 */
export const cleanupSecurityLogs =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const days =
        Number(req.query.days) || 90;

      const date = new Date();
      date.setDate(date.getDate() - days);

      const deleted =
        await prisma.securityLog.deleteMany({
          where: {
            createdAt: {
              lt: date,
            },
          },
        });

      res.status(200).json({
        success: true,
        deleted: deleted.count,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Cleanup failed",
      });
    }
  };

/**
 * SECURITY ANALYTICS
 */
export const securityAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const [
        totalLogs,
        criticalLogs,
        failedEvents,
      ] = await Promise.all([
        prisma.securityLog.count(),

        prisma.securityLog.count({
          where: {
            severity: "CRITICAL",
          },
        }),

        prisma.securityLog.count({
          where: {
            status: "FAILED",
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalLogs,
          criticalLogs,
          failedEvents,
        },
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });
    }
  };