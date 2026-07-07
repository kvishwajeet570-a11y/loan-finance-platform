import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE PAYMENT
 */
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment = await prisma.payment.create({
      data: {
        paymentId: `PAY-${Date.now()}`,
        userId: req.body.userId,
        loanApplicationId: req.body.loanApplicationId,
        amount: Number(req.body.amount),
        paymentType: req.body.paymentType,
        paymentMethod: req.body.paymentMethod,
        gateway: req.body.gateway,
        remarks: req.body.remarks,
      },
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment creation failed",
    });
  }
};

/**
 * GET ALL PAYMENTS
 */
export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          loanApplication: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.payment.count(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: payments,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

/**
 * GET PAYMENT BY ID
 */
export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: true,
        loanApplication: true,
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

/**
 * MARK SUCCESS
 */
export const markPaymentSuccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment = await prisma.payment.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "SUCCESS",
        transactionId: req.body.transactionId,
        gatewayResponse: req.body.gatewayResponse,
        paidAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: payment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/**
 * REFUND PAYMENT
 */
export const refundPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payment = await prisma.payment.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: "REFUNDED",
      },
    });

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Refund failed",
    });
  }
};

/**
 * PAYMENT ANALYTICS
 */
export const paymentAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalPayments,
      successPayments,
      failedPayments,
      revenue,
    ] = await Promise.all([
      prisma.payment.count(),

      prisma.payment.count({
        where: {
          status: "SUCCESS",
        },
      }),

      prisma.payment.count({
        where: {
          status: "FAILED",
        },
      }),

      prisma.payment.aggregate({
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
        totalPayments,
        successPayments,
        failedPayments,
        revenue: revenue._sum.amount || 0,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};