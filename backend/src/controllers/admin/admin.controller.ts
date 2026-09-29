import { Request, Response } from "express";
import adminService from "../../services/admin/admin.service";

/* ==========================================
   DASHBOARD
========================================== */

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
    console.error(
      "[ADMIN_DASHBOARD_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

export const getDashboardStats =
  getAdminDashboard;

/* ==========================================
   USER MANAGEMENT
========================================== */

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
    console.error(
      "[ADMIN_GET_USERS_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const user =
      await adminService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "[ADMIN_GET_USER_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

export const blockUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const user =
      await adminService.blockUser(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "[ADMIN_BLOCK_USER_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to block user",
    });
  }
};

export const unblockUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const user =
      await adminService.unblockUser(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "[ADMIN_UNBLOCK_USER_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to unblock user",
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const user =
      await adminService.verifyUser(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "[ADMIN_VERIFY_USER_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify user",
    });
  }
};

/* ==========================================
   LOAN MANAGEMENT
========================================== */

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
    console.error(
      "[ADMIN_GET_LOANS_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
};

export const getRecentLoans =
  getAllLoans;

export const getLoanById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const loan =
      await adminService.getLoanById(id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    console.error(
      "[ADMIN_GET_LOAN_ERROR]",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch loan",
    });
  }
};

/* ==========================================
   UPDATE LOAN AMOUNT
========================================== */

export const updateLoanAmount = async (
  req: Request,
  res: Response
) => {
  try {
    const loanId = String(req.params.id);

    const rawAmount = req.body?.amount;

    const amount = Number(rawAmount);

    if (
      rawAmount === undefined ||
      rawAmount === null ||
      rawAmount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid loan amount greater than zero is required.",
      });
    }

    const loan =
      await adminService.updateLoanAmount(
        loanId,
        amount
      );

    return res.status(200).json({
      success: true,
      message:
        "Loan amount updated successfully.",
      data: loan,
    });
  } catch (error: any) {
    console.error(
      "[ADMIN_UPDATE_LOAN_AMOUNT_ERROR]",
      error
    );

    if (
      error?.message ===
      "Loan application not found."
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to update loan amount",
    });
  }
};

/* ==========================================
   APPROVE LOAN
========================================== */

export const approveLoan = async (
  req: Request,
  res: Response
) => {
  try {
    const loanId = String(req.params.id);

    const adminId =
      (req as any).admin?.id ||
      (req as any).user?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin identity not found",
      });
    }

    let amount: number | undefined;

    if (
      req.body?.amount !== undefined &&
      req.body?.amount !== null &&
      req.body?.amount !== ""
    ) {
      amount = Number(req.body.amount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Loan amount must be greater than zero.",
        });
      }
    }

    const loan =
      await adminService.approveLoan(
        loanId,
        adminId,
        amount
      );

    return res.status(200).json({
      success: true,
      message:
        "Loan application approved successfully.",
      data: loan,
    });
  } catch (error: any) {
    console.error(
      "[ADMIN_APPROVE_LOAN_ERROR]",
      error
    );

    const message =
      error?.message ||
      "Failed to approve loan";

    if (
      message ===
        "Loan application not found." ||
      message.includes(
        "valid loan amount"
      ) ||
      message.includes(
        "greater than zero"
      )
    ) {
      return res.status(
        message ===
          "Loan application not found."
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve loan",
    });
  }
};

/* ==========================================
   REJECT LOAN
========================================== */

export const rejectLoan = async (
  req: Request,
  res: Response
) => {
  try {
    const loanId = String(req.params.id);

    const rejectionReason =
      typeof req.body?.rejectionReason ===
      "string"
        ? req.body.rejectionReason.trim()
        : undefined;

    const loan =
      await adminService.rejectLoan(
        loanId,
        rejectionReason
      );

    return res.status(200).json({
      success: true,
      message:
        "Loan application rejected successfully.",
      data: loan,
    });
  } catch (error: any) {
    console.error(
      "[ADMIN_REJECT_LOAN_ERROR]",
      error
    );

    if (
      error?.message ===
      "Loan application not found."
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject loan",
    });
  }
};
