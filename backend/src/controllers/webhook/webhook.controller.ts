import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
/**
 * RAZORPAY WEBHOOK
 */
export const razorpayWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const payload = req.body;

    const event =
      payload.event;

    await prisma.webhookLog.create({
      data: {
        provider: "RAZORPAY",
        eventType: event,
        payload,
        status: "RECEIVED",
      },
    });

    switch (event) {

      case "payment.captured":

        await prisma.payment.updateMany({
          where: {
            transactionId:
              payload.payload.payment.entity.id,
          },
          data: {
            status: "SUCCESS",
          },
        });

        break;

      case "payment.failed":

        await prisma.payment.updateMany({
          where: {
            transactionId:
              payload.payload.payment.entity.id,
          },
          data: {
            status: "FAILED",
          },
        });

        break;
    }

    res.status(200).json({
      success: true,
    });

  } catch (error) {

    await prisma.webhookLog.create({
      data: {
        provider: "RAZORPAY",
        eventType: "UNKNOWN",
        payload: req.body,
        status: "FAILED",
        error: String(error),
      },
    });

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * CASHFREE WEBHOOK
 */
export const cashfreeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const payload = req.body;

    await prisma.webhookLog.create({
      data: {
        provider: "CASHFREE",
        eventType:
          payload.type,
        payload,
        status: "RECEIVED",
      },
    });

    if (
      payload.data.payment_status ===
      "SUCCESS"
    ) {

      await prisma.payment.updateMany({
        where: {
          transactionId:
            payload.data.order_id,
        },
        data: {
          status: "SUCCESS",
        },
      });
    }

    res.status(200).json({
      success: true,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * WHATSAPP WEBHOOK
 */
export const whatsappWebhook =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const payload =
      req.body;

    await prisma.webhookLog.create({
      data: {
        provider: "WHATSAPP",
        eventType: "MESSAGE",
        payload,
        status: "RECEIVED",
      },
    });

    res.status(200).send("OK");

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * GENERIC WEBHOOK LOGS
 */
export const getWebhookLogs =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const logs =
      await prisma.webhookLog.findMany({
        orderBy: {
          receivedAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * WEBHOOK ANALYTICS
 */
export const webhookAnalytics =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      total,
      success,
      failed,
    ] = await Promise.all([

      prisma.webhookLog.count(),

      prisma.webhookLog.count({
        where: {
          status: "RECEIVED",
        },
      }),

      prisma.webhookLog.count({
        where: {
          status: "FAILED",
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        success,
        failed,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};