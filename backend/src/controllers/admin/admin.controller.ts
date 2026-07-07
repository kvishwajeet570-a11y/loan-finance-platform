import { Request, Response } from "express";
import adminService from "./admin.service";

export const getAdminDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboard =
      await adminService.getDashboardStats();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_ERROR]", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users =
      await adminService.getAllUsers();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getAllLoans = async (
  req: Request,
  res: Response
) => {
  try {
    const loans =
      await adminService.getAllLoans();

    return res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
};