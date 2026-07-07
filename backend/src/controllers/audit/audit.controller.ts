import { Request, Response } from "express";
import auditService from "../../services/audit/audit.service";

export const getAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const logs = await auditService.getAll();

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("[AUDIT_LOGS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

export const getUserAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const logs = await auditService.getByUserId(
      userId
    );

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error(
      "[USER_AUDIT_LOGS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user audit logs",
    });
  }
};

export const getAuditStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats =
      await auditService.getStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "[AUDIT_STATS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit stats",
    });
  }
};