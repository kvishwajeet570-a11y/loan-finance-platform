import prisma from "../../prisma/prisma";

const round2 = (value: number) =>
  Math.round((Number(value) || 0) * 100) / 100;

const money = (value: number) => round2(value);

class PayoutService {
  async getMyPayout(userId: string) {
    const [user, wallet, commissions, transactions, bankAccount] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true,
          },
        }),

        prisma.wallet.findUnique({
          where: { userId },
          select: {
            id: true,
            balance: true,
            totalEarnings: true,
            isFrozen: true,
            isBlocked: true,
          },
        }),

        prisma.commission.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 200,
          include: {
            loan: {
              select: {
                id: true,
                loanType: true,
                amount: true,
                status: true,
                approvedAt: true,
              },
            },
          },
        }),

        prisma.transaction.findMany({
          where: {
            OR: [
              { userId },
              { dsaId: userId },
            ],
            category: {
              in: [
                "PAYOUT",
                "COMMISSION",
                "COMMISSION_PAYOUT",
              ],
            },
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),

        prisma.bankAccount.findFirst({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        }).catch(() => null),
      ]);

    if (!user) {
      throw new Error("User not found");
    }

    const approvedCommissions = commissions.filter(
      (c: any) =>
        String(c.status || "").toUpperCase() === "APPROVED"
    );

    const pendingCommissions = commissions.filter(
      (c: any) =>
        String(c.status || "").toUpperCase() === "PENDING"
    );

    const totalCommission = money(
      commissions.reduce(
        (sum: number, c: any) =>
          sum + Number(c.commissionAmount ?? c.amount ?? 0),
        0
      )
    );

    const approvedCommission = money(
      approvedCommissions.reduce(
        (sum: number, c: any) =>
          sum + Number(c.commissionAmount ?? c.amount ?? 0),
        0
      )
    );

    const pendingCommission = money(
      pendingCommissions.reduce(
        (sum: number, c: any) =>
          sum + Number(c.commissionAmount ?? c.amount ?? 0),
        0
      )
    );

    const payoutTransactions = transactions.filter((t: any) => {
      const category = String(t.category || "").toUpperCase();
      const type = String(t.type || "").toUpperCase();

      return (
        category.includes("PAYOUT") ||
        type.includes("PAYOUT")
      );
    });

    const paidPayout = money(
      payoutTransactions
        .filter((t: any) =>
          ["SUCCESS", "PAID", "COMPLETED", "SETTLED"].includes(
            String(t.status || "").toUpperCase()
          )
        )
        .reduce(
          (sum: number, t: any) =>
            sum + Number(t.netAmount ?? t.amount ?? 0),
          0
        )
    );

    const pendingPayout = money(
      payoutTransactions
        .filter((t: any) =>
          ["PENDING", "PROCESSING", "REQUESTED"].includes(
            String(t.status || "").toUpperCase()
          )
        )
        .reduce(
          (sum: number, t: any) =>
            sum + Number(t.netAmount ?? t.amount ?? 0),
          0
        )
    );

    const tdsDeducted = money(
      payoutTransactions.reduce(
        (sum: number, t: any) =>
          sum + Number(t.tax ?? 0),
        0
      )
    );

    const walletBalance = money(wallet?.balance ?? 0);

    const availablePayout = money(
      Math.max(
        0,
        walletBalance - pendingPayout
      )
    );

    const normalizedBankAccount = bankAccount
      ? {
          accountHolderName:
            (bankAccount as any).accountHolderName || "",
          bankName:
            (bankAccount as any).bankName || "",
          accountNumber:
            (bankAccount as any).accountNumber || "",
          ifscCode:
            (bankAccount as any).ifscCode || "",
          isVerified:
            Boolean((bankAccount as any).isVerified),
        }
      : null;

    const payouts = payoutTransactions.map((t: any) => ({
      id: t.transactionId,
      referenceId: t.referenceId,
      date: t.createdAt,
      loanType:
        t.remark ||
        t.description ||
        "Payout",
      loanAmount: Number(t.amount || 0),
      commission: Number(t.commission || 0),
      tds: Number(t.tax || 0),
      netAmount: Number(t.netAmount ?? t.amount ?? 0),
      status: String(t.status || "PENDING"),
      transactionId: t.transactionId,
    }));

    const monthlyCommission = money(
      commissions
        .filter((c: any) => {
          const d = new Date(c.createdAt);
          const now = new Date();

          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce(
          (sum: number, c: any) =>
            sum + Number(c.commissionAmount ?? c.amount ?? 0),
          0
        )
    );

    const monthlyLoanAmount = money(
      commissions
        .filter((c: any) => {
          const d = new Date(c.createdAt);
          const now = new Date();

          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce(
          (sum: number, c: any) =>
            sum + Number(c.loanAmount || 0),
          0
        )
    );

    const bankVerified =
      normalizedBankAccount?.isVerified === true;

    const eligible =
      !wallet?.isFrozen &&
      !wallet?.isBlocked &&
      bankVerified &&
      availablePayout > 0;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
      },

      summary: {
        availablePayout,
        totalCommission,
        pendingPayout,
        paidPayout,
        tdsDeducted,
        approvedCommission,
        pendingCommission,
        walletBalance,
      },

      eligibility: {
        eligible,
        bankVerified,
        walletActive:
          !wallet?.isFrozen && !wallet?.isBlocked,
        availableAmount: availablePayout,
        minimumPayout: 500,
      },

      monthlySlab: {
        commission: monthlyCommission,
        loanAmount: monthlyLoanAmount,
      },

      bankAccount: normalizedBankAccount,

      payouts,

      commissions: commissions.map((c: any) => ({
        id: c.id,
        amount: Number(c.amount || 0),
        commissionAmount: Number(
          c.commissionAmount ?? c.amount ?? 0
        ),
        loanAmount: Number(c.loanAmount || 0),
        status: c.status,
        createdAt: c.createdAt,
        loanType: c.loan?.loanType || "Loan",
        loanId: c.loanId,
      })),
    };
  }

  async requestPayout(
    userId: string,
    requestedAmount?: number
  ) {
    const [wallet, bankAccount, existingPending] =
      await Promise.all([
        prisma.wallet.findUnique({
          where: { userId },
        }),

        prisma.bankAccount.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        }).catch(() => null),

        prisma.transaction.findFirst({
          where: {
            OR: [
              { userId },
              { dsaId: userId },
            ],
            category: "PAYOUT",
            status: {
              in: [
                "PENDING",
                "PROCESSING",
                "REQUESTED",
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.isFrozen || wallet.isBlocked) {
      throw new Error("Payout is not eligible for this wallet");
    }

    if (!bankAccount || !(bankAccount as any).isVerified) {
      throw new Error(
        "Verified bank account is required before requesting payout"
      );
    }

    if (existingPending) {
      throw new Error(
        "A payout request is already pending"
      );
    }

    const available = Number(wallet.balance || 0);

    if (available < 500) {
      throw new Error(
        "Minimum payout amount is ₹500"
      );
    }

    const amount =
      requestedAmount === undefined
        ? available
        : Number(requestedAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Invalid payout amount");
    }

    if (amount < 500) {
      throw new Error(
        "Minimum payout amount is ₹500"
      );
    }

    if (amount > available) {
      throw new Error(
        "Requested payout amount exceeds available balance"
      );
    }

    const tax = round2(amount * 0.05);
    const netAmount = round2(amount - tax);

    const transactionId =
      `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const referenceId =
      `PAYOUT-${Date.now()}`;

    const transaction =
      await prisma.transaction.create({
        data: {
          transactionId,
          referenceId,
          userId,
          dsaId: userId,
          walletId: wallet.id,
          type: "PAYOUT",
          category: "PAYOUT",
          paymentMethod: "BANK_TRANSFER",
          amount,
          tax,
          netAmount,
          currency: "INR",
          status: "PENDING",
          isVerified: false,
          isApproved: false,
          remark: "DSA Payout Request",
          description:
            "DSA requested payout from available wallet balance",
        },
      });

    return {
      transactionId: transaction.transactionId,
      referenceId: transaction.referenceId,
      amount: transaction.amount,
      tax: transaction.tax,
      netAmount: transaction.netAmount,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
}

export default new PayoutService();
