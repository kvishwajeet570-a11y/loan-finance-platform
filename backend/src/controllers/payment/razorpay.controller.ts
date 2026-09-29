import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import prisma from "../../prisma/prisma";

/* ========================================
   RAZORPAY CLIENT
======================================== */

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn(
    "⚠️ Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env"
  );
}

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

/* ========================================
   HELPERS
======================================== */

function getAuthenticatedUserId(req: Request): string | null {
  const user = (req as any).user;

  if (!user?.id) {
    return null;
  }

  return String(user.id);
}

function generatePaymentId(): string {
  return `PAY-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

function generateTransactionId(): string {
  return `WALLET-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

/* ========================================
   CREATE RAZORPAY WALLET ORDER
======================================== */

export const createRazorpayWalletOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!razorpay) {
      res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the server.",
      });
      return;
    }

    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const amount = Number(req.body.amount);

    const paymentMethod = String(
      req.body.paymentMethod || "UPI"
    ).toUpperCase();

    if (!Number.isFinite(amount) || amount < 10) {
      res.status(400).json({
        success: false,
        message: "Minimum wallet add-money amount is ₹100.",
      });
      return;
    }

    if (amount > 100000) {
      res.status(400).json({
        success: false,
        message:
          "Maximum wallet add-money amount is ₹1,00,000 per transaction.",
      });
      return;
    }

    /* ----------------------------------------
       USER CHECK
    ---------------------------------------- */

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    /* ----------------------------------------
       CREATE RAZORPAY ORDER
       Razorpay amount is in paise
    ---------------------------------------- */

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `WALLET-${Date.now()}`,
      notes: {
        userId,
        purpose: "WALLET_ADD_MONEY",
        paymentMethod,
      },
    });

    /* ----------------------------------------
       CREATE INTERNAL PAYMENT RECORD
    ---------------------------------------- */

    const payment = await prisma.payment.create({
      data: {
        paymentId: generatePaymentId(),
        userId,
        amount,
        paymentMethod,
        purpose: "WALLET_ADD_MONEY",
        status: "PENDING",
        gateway: "RAZORPAY",
        referenceId: order.id,
        remarks: "Razorpay wallet add-money payment",
        gatewayResponse: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully.",
      data: {
        paymentId: payment.id,
        paymentReference: payment.paymentId,
        orderId: order.id,
        amount,
        amountInPaise: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
        name: user.name || "Customer",
        email: user.email || undefined,
        contact: user.phoneNo || undefined,
      },
    });
  } catch (error: any) {
    console.error(
      "Razorpay order creation error:",
      error?.error || error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create Razorpay payment order.",
      error:
        process.env.NODE_ENV === "development"
          ? error?.message || String(error)
          : undefined,
    });
  }
};

/* ========================================
   VERIFY RAZORPAY PAYMENT
======================================== */

export const verifyRazorpayPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!razorpay) {
      res.status(500).json({
        success: false,
        message: "Razorpay is not configured on the server.",
      });
      return;
    }

    if (!razorpayKeySecret) {
      res.status(500).json({
        success: false,
        message: "Razorpay secret key is not configured.",
      });
      return;
    }

    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      res.status(400).json({
        success: false,
        message:
          "Razorpay payment verification details are incomplete.",
      });
      return;
    }

    /* ----------------------------------------
       FIND INTERNAL PAYMENT
    ---------------------------------------- */

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId
          ? String(paymentId)
          : undefined,
        userId,
        gateway: "RAZORPAY",
        referenceId: String(razorpay_order_id),
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: "Payment order not found.",
      });
      return;
    }

    /* ----------------------------------------
       DUPLICATE PROTECTION
    ---------------------------------------- */

    if (
      payment.status === "SUCCESS" &&
      payment.gatewayPaymentId ===
        String(razorpay_payment_id)
    ) {
      res.status(200).json({
        success: true,
        alreadyProcessed: true,
        message: "Payment was already processed.",
        data: {
          paymentId: payment.id,
          amount: payment.amount,
          status: payment.status,
        },
      });
      return;
    }

    /* ----------------------------------------
       VERIFY RAZORPAY SIGNATURE
    ---------------------------------------- */

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const expectedBuffer = Buffer.from(
      generatedSignature,
      "utf8"
    );

    const receivedBuffer = Buffer.from(
      String(razorpay_signature),
      "utf8"
    );

    if (
      expectedBuffer.length !==
      receivedBuffer.length
    ) {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "FAILED",
          failureReason:
            "Invalid Razorpay signature",
          gatewayPaymentId:
            String(razorpay_payment_id),
        },
      });

      res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature.",
      });
      return;
    }

    const signaturesMatch =
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!signaturesMatch) {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "FAILED",
          failureReason:
            "Invalid Razorpay signature",
          gatewayPaymentId:
            String(razorpay_payment_id),
        },
      });

      res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature.",
      });
      return;
    }

    /* ----------------------------------------
       FETCH PAYMENT FROM RAZORPAY
    ---------------------------------------- */

    const razorpayPayment =
      await razorpay.payments.fetch(
        String(razorpay_payment_id)
      );

    if (
      String(razorpayPayment.order_id) !==
      String(razorpay_order_id)
    ) {
      res.status(400).json({
        success: false,
        message: "Payment order mismatch.",
      });
      return;
    }

    const gatewayStatus = String(
      razorpayPayment.status || ""
    ).toLowerCase();

    if (
      gatewayStatus !== "captured" &&
      gatewayStatus !== "authorized"
    ) {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "FAILED",
          failureReason:
            `Razorpay payment status: ${gatewayStatus}`,
          gatewayPaymentId:
            String(razorpay_payment_id),
          gatewayResponse:
            razorpayPayment as any,
        },
      });

      res.status(400).json({
        success: false,
        message:
          "Payment has not been successfully captured by Razorpay.",
        status: gatewayStatus,
      });
      return;
    }

    /* ----------------------------------------
       ATOMIC WALLET CREDIT
    ---------------------------------------- */

    const result = await prisma.$transaction(
      async (tx) => {
        const currentPayment =
          await tx.payment.findUnique({
            where: {
              id: payment.id,
            },
          });

        if (!currentPayment) {
          throw new Error(
            "Payment record not found."
          );
        }

        /* ------------------------------------
           RE-CHECK SUCCESS
        ------------------------------------ */

        if (
          currentPayment.status === "SUCCESS" &&
          currentPayment.gatewayPaymentId ===
            String(razorpay_payment_id)
        ) {
          return {
            alreadyProcessed: true,
            wallet: null,
            transaction: null,
            payment: currentPayment,
          };
        }

        /* ------------------------------------
           EXTRA DUPLICATE CHECK
        ------------------------------------ */

        const existingPayment =
          await tx.payment.findFirst({
            where: {
              gatewayPaymentId:
                String(razorpay_payment_id),
              status: "SUCCESS",
            },
          });

        if (existingPayment) {
          return {
            alreadyProcessed: true,
            wallet: null,
            transaction: null,
            payment: existingPayment,
          };
        }

        /* ------------------------------------
           FIND / CREATE WALLET
        ------------------------------------ */

        const wallet = await tx.wallet.upsert({
          where: {
            userId,
          },
          create: {
            userId,
            balance: 0,
          },
          update: {},
        });

        if (wallet.isBlocked) {
          throw new Error(
            "Wallet is blocked. Payment cannot be credited."
          );
        }

        if (wallet.isFrozen) {
          throw new Error(
            "Wallet is frozen. Payment cannot be credited."
          );
        }

        /* ------------------------------------
           CREDIT WALLET
        ------------------------------------ */

        const updatedWallet =
          await tx.wallet.update({
            where: {
              userId,
            },
            data: {
              balance: {
                increment:
                  Number(payment.amount),
              },
            },
          });

        /* ------------------------------------
           CREATE TRANSACTION
        ------------------------------------ */

        const walletTransaction =
          await tx.transaction.create({
            data: {
              transactionId:
                generateTransactionId(),

              referenceId:
                String(razorpay_payment_id),

              gatewayTxnId:
                String(razorpay_payment_id),

              orderId:
                String(razorpay_order_id),

              userId,

              walletId: wallet.id,

              type: "CREDIT",

              category: "WALLET",

              paymentMethod:
                payment.paymentMethod ||
                "UPI",

              paymentGateway: "RAZORPAY",

              amount:
                Number(payment.amount),

              netAmount:
                Number(payment.amount),

              currency: "INR",

              status: "success",

              isVerified: true,

              isApproved: true,

              verifiedAt: new Date(),

              description:
                "Money Added to Wallet",

              remark:
                "Razorpay payment successfully verified",
            },
          });

        /* ------------------------------------
           UPDATE PAYMENT
        ------------------------------------ */

        const updatedPayment =
          await tx.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: "SUCCESS",

              paidAt: new Date(),

              verifiedAt: new Date(),

              gatewayPaymentId:
                String(razorpay_payment_id),

              transactionId:
                walletTransaction.transactionId,

              gatewayResponse:
                razorpayPayment as any,
            },
          });

        /* ------------------------------------
           WALLET HISTORY
        ------------------------------------ */

        await tx.walletHistory.create({
          data: {
            walletId: wallet.id,
            balance: updatedWallet.balance,
          },
        });

        return {
          alreadyProcessed: false,
          wallet: updatedWallet,
          transaction:
            walletTransaction,
          payment: updatedPayment,
        };
      }
    );

    if (result.alreadyProcessed) {
      res.status(200).json({
        success: true,
        alreadyProcessed: true,
        message:
          "Payment was already processed.",
        data: result.payment,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Payment verified and wallet credited successfully.",
      data: {
        payment: result.payment,
        wallet: result.wallet,
        transaction:
          result.transaction,
      },
    });
  } catch (error: any) {
    console.error(
      "Razorpay payment verification error:",
      error?.error || error
    );

    res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Payment verification failed.",
      error:
        process.env.NODE_ENV === "development"
          ? error?.message || String(error)
          : undefined,
    });
  }
};
