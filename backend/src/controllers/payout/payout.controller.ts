import { Request, Response } from "express";
import payoutService from "../../services/payout/payout.service";

const getUserId = (req: any): string | null => {
  const u = req.user || {};
  return u.id || u.userId || u.sub || null;
};

export const getMyPayout = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    const data = await payoutService.getMyPayout(userId);

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("GET MY PAYOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to load payout data",
    });
  }
};

export const requestPayout = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    const amount =
      req.body?.amount === undefined
        ? undefined
        : Number(req.body.amount);

    const result = await payoutService.requestPayout(userId, amount);

    return res.status(201).json({
      success: true,
      message: "Payout request submitted successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("REQUEST PAYOUT ERROR:", error);

    const message = error?.message || "Unable to request payout";

    const status =
      message.includes("not found") ||
      message.includes("not eligible")
        ? 400
        : message.includes("already") ||
            message.includes("balance") ||
            message.includes("amount")
          ? 400
          : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export default {
  getMyPayout,
  requestPayout,
};
