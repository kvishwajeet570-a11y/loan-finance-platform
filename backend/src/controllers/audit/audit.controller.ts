import { Request, Response } from "express";
import auditService from "../../services/audit/audit.service";

export const getAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = String(req.query.search || "");

    const result = await auditService.getLogs(
      page,
      limit,
      search
    );

    res.status(200).json({
      success: true,
      ...result,
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
    const userId = req.params.userId as string;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const logs =
      await auditService.getUserLogs(userId);

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
      message:
        "Failed to fetch user audit logs",
    });
  }
};

export const getAdminAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId =
      req.params.adminId as string;

    if (!adminId) {
      res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
      return;
    }

    const logs =
      await auditService.getAdminLogs(
        adminId
      );

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error(
      "[ADMIN_AUDIT_LOGS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin audit logs",
    });
  }
};

export const getAuditStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats =
      await auditService.getAuditStats();

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
      message:
        "Failed to fetch audit stats",
    });
  }
};

export const deleteOldLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const days =
      Number(req.query.days) || 90;

    const result =
      await auditService.deleteOldLogs(
        days
      );

    res.status(200).json({
      success: true,
      deletedCount: result.count,
      message:
        "Old audit logs deleted successfully",
    });
  } catch (error) {
    console.error(
      "[DELETE_AUDIT_LOGS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete old audit logs",
    });
  }
};

export const createAuditLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const log = await auditService.createLog(req.body);

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error("[CREATE_AUDIT_LOG_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to create audit log",
    });
  }
};

export const getModuleLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const module = String(req.params.module);

    const logs = await auditService.getByModule(module);

    

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("[GET_MODULE_LOGS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch module logs",
    });
  }
};

export const getActionLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const action = String(req.params.action);

    const logs = await auditService.getByAction(action);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("[GET_ACTION_LOGS_ERROR]", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch action logs",
    });
  }
};

export const searchAuditLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const keyword = String(req.params.keyword);

    const result = await auditService.getLogs(
      1,
      100,
      keyword
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "[SEARCH_AUDIT_LOGS_ERROR]",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to search audit logs",
    });
  }
};

