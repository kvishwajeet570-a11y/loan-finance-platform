import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

const getAdminId = (req: Request): string | null => {
  const user = (req as any).user || {};
  return user.id || user.userId || user.sub || null;
};

const pendingStatuses = ["PENDING", "pending", "PROCESSING", "REQUESTED"];
const payoutTypes = ["PAYOUT", "COMMISSION_PAYOUT"];

export const listPayoutRequests = async (req: Request, res: Response) => {
  try {
    const status = String(req.query.status || "").toUpperCase();

    const where: any = {
      OR: [
        { category: { in: payoutTypes } },
        { type: { in: payoutTypes } },
      ],
      ...(status === "PENDING"
        ? { status: { in: pendingStatuses } }
        : status === "APPROVED"
          ? { status: "APPROVED", isApproved: true }
          : status === "REJECTED"
            ? { status: "REJECTED" }
            : {}),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phoneNo: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const userIds = [...new Set(
      transactions.map((item: any) => item.userId).filter(Boolean)
    )] as string[];

    const bankAccounts = userIds.length
      ? await prisma.bankAccount.findMany({
          where: { userId: { in: userIds } },
          orderBy: [
            { verificationStatus: "desc" },
            { createdAt: "desc" },
          ],
        })
      : [];

    const bankMap = new Map<string, any>();
    for (const bank of bankAccounts) {
      if (!bankMap.has(bank.userId)) bankMap.set(bank.userId, bank);
    }

    const payouts = transactions.map((item: any) => {
      const bank = bankMap.get(item.userId);
      const account = String(bank?.accountNumber || "");

      return {
        id: item.id,
        transactionId: item.transactionId,
        referenceId: item.referenceId,
        userId: item.userId,
        dsaId: item.dsaId,
        user: item.user,
        amount: Number(item.amount || 0),
        tax: Number(item.tax || 0),
        netAmount: Number(item.netAmount ?? item.amount ?? 0),
        status: item.status,
        isApproved: item.isApproved,
        approvedBy: item.approvedBy,
        approvedAt: item.approvedAt,
        rejectedBy: item.rejectedBy,
        rejectedAt: item.rejectedAt,
        rejectReason: item.rejectReason,
        remark: item.remark,
        isTestData: String(item.remark || "").startsWith("TEST_PAYOUT_"),
        createdAt: item.createdAt,
        bankAccount: bank ? {
          accountHolderName: bank.accountHolderName,
          bankName: bank.bankName,
          accountNumber: account.length > 4
            ? `XXXX XXXX ${account.slice(-4)}`
            : account,
          ifscCode: bank.ifscCode,
          isVerified: String(bank.verificationStatus || "").toUpperCase() === "VERIFIED",
          verificationStatus: bank.verificationStatus || "PENDING",
        } : null,
      };
    });

    const pending = payouts.filter((p: any) =>
      pendingStatuses.includes(String(p.status))
    );
    const approved = payouts.filter((p: any) =>
      String(p.status).toUpperCase() === "APPROVED" && p.isApproved
    );
    const paid = payouts.filter((p: any) =>
      ["SUCCESS", "PAID", "COMPLETED", "SETTLED"].includes(
        String(p.status).toUpperCase()
      )
    );
    const rejected = payouts.filter((p: any) =>
      String(p.status).toUpperCase() === "REJECTED"
    );

    return res.json({
      success: true,
      data: {
        payouts,
        summary: {
          totalRequests: payouts.length,
          pendingRequests: pending.length,
          approvedRequests: approved.length,
          paidRequests: paid.length,
          rejectedRequests: rejected.length,
          pendingAmount: pending.reduce((sum: number, p: any) => sum + p.amount, 0),
          approvedAmount: approved.reduce((sum: number, p: any) => sum + p.netAmount, 0),
          paidAmount: paid.reduce((sum: number, p: any) => sum + p.netAmount, 0),
        },
      },
    });
  } catch (error: any) {
    console.error("SUPER ADMIN PAYOUT LIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Unable to load payout requests",
    });
  }
};

export const approvePayoutRequest = async (req: Request, res: Response) => {
  const adminId = getAdminId(req);
  if (!adminId) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required",
    });
  }

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const payout = await tx.transaction.findUnique({
        where: { id: String(req.params.id) },
      });

      if (
        !payout ||
        (
          !payoutTypes.includes(String(payout.category || "").toUpperCase()) &&
          !payoutTypes.includes(String(payout.type || "").toUpperCase())
        )
      ) {
        throw new Error("Payout request not found");
      }

      if (String(payout.remark || "").startsWith("TEST_PAYOUT_")) {
        throw new Error("Test payout records cannot be approved");
      }

      if (!pendingStatuses.includes(String(payout.status))) {
        throw new Error("Payout is already processed");
      }

      if (!payout.walletId || !payout.userId) {
        throw new Error("Payout wallet or user reference is missing");
      }

      const bank = await tx.bankAccount.findFirst({
        where: {
          userId: payout.userId,
          verificationStatus: "VERIFIED",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!bank) {
        throw new Error("Verified bank account is required");
      }

      const amount = Number(payout.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid payout amount");
      }

      const changed = await tx.transaction.updateMany({
        where: {
          id: payout.id,
          status: { in: pendingStatuses },
          isApproved: false,
        },
        data: {
          status: "APPROVED",
          isApproved: true,
          isVerified: false,
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });

      if (changed.count !== 1) {
        throw new Error("Payout was already processed");
      }

      const walletUpdate = await tx.wallet.updateMany({
        where: {
          id: payout.walletId,
          userId: payout.userId,
          balance: { gte: amount },
          isFrozen: false,
          isBlocked: false,
        },
        data: {
          balance: { decrement: amount },
        },
      });

      if (walletUpdate.count !== 1) {
        throw new Error("Insufficient wallet balance or wallet is blocked");
      }

      const updatedWallet = await tx.wallet.findUnique({
        where: { id: payout.walletId },
        select: { balance: true },
      });

      if (!updatedWallet) {
        throw new Error("Updated wallet could not be found");
      }

      await tx.walletHistory.create({
        data: {
          walletId: payout.walletId,
          balance: Number(updatedWallet.balance),
        },
      });

      return tx.transaction.findUnique({
        where: { id: payout.id },
      });
    });

    return res.json({
      success: true,
      message: "Payout approved. Bank settlement is still pending.",
      data: result,
    });
  } catch (error: any) {
    console.error("APPROVE PAYOUT ERROR:", error);
    const message = error?.message || "Unable to approve payout";
    const status = message.includes("not found") ? 404
      : message.includes("already") ||
        message.includes("Insufficient") ||
        message.includes("missing") ||
        message.includes("required") ||
        message.includes("Test payout") ||
        message.includes("Invalid") ? 409 : 500;

    return res.status(status).json({ success: false, message });
  }
};

export const rejectPayoutRequest = async (req: Request, res: Response) => {
  const adminId = getAdminId(req);
  if (!adminId) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required",
    });
  }

  try {
    const reason = String(req.body?.reason || "").trim();

    if (reason.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please provide a rejection reason of at least 3 characters",
      });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const payout = await tx.transaction.findUnique({
        where: { id: String(req.params.id) },
      });

      if (
        !payout ||
        (
          !payoutTypes.includes(String(payout.category || "").toUpperCase()) &&
          !payoutTypes.includes(String(payout.type || "").toUpperCase())
        )
      ) {
        throw new Error("Payout request not found");
      }

      if (String(payout.remark || "").startsWith("TEST_PAYOUT_")) {
        throw new Error("Test payout records cannot be rejected");
      }

      const changed = await tx.transaction.updateMany({
        where: {
          id: payout.id,
          status: { in: pendingStatuses },
          isApproved: false,
        },
        data: {
          status: "REJECTED",
          isApproved: false,
          rejectedBy: adminId,
          rejectedAt: new Date(),
          rejectReason: reason.slice(0, 500),
        },
      });

      if (changed.count !== 1) {
        throw new Error("Payout not found or already processed");
      }

      return tx.transaction.findUnique({
        where: { id: payout.id },
      });
    });

    return res.json({
      success: true,
      message: "Payout request rejected successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("REJECT PAYOUT ERROR:", error);
    const message = error?.message || "Unable to reject payout";
    const status = message.includes("not found") ? 404
      : message.includes("already") ||
        message.includes("Test payout") ? 409 : 500;

    return res.status(status).json({ success: false, message });
  }
};
