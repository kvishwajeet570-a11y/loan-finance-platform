import { Request, Response } from "express";
import { Prisma, Transaction } from "@prisma/client";

import prisma from "../../prisma/prisma";
import transactionService from "../../services/transaction/transaction.service";

import {
  CreateTransactionDto,
  UpdateTransactionDto,
  SearchTransactionDto,
  ApproveTransactionDto,
  VerifyTransactionDto,
  RejectTransactionDto,
  RefundTransactionDto,
  BulkApproveTransactionDto,
  BulkRejectTransactionDto,
  BulkRefundTransactionDto,
  BulkDeleteTransactionDto,
} from "../../dto/transaction/transaction.dto";

/* ==========================================================
   CONSTANTS
========================================================== */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/* ==========================================================
   RESPONSE HELPERS
========================================================== */

const success = (
  res: Response,
  message: string,
  data: any = null,
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const failure = (
  res: Response,
  message: string,
  error: any = null,
  status = 500
) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};

/* ==========================================================
   PAGINATION
========================================================== */

const getPagination = (req: Request) => {
  const page = Math.max(
    Number(req.query.page) || DEFAULT_PAGE,
    1
  );

  const limit = Math.min(
    Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

/* ==========================================================
   SORT
========================================================== */

const getSort = (
  req: Request
): Prisma.TransactionOrderByWithRelationInput => {
  const sortBy =
    (req.query.sortBy as string) || "createdAt";

  const order =
    req.query.order === "asc" ? "asc" : "desc";

  return {
    [sortBy]: order,
  };
};

/* ==========================================================
   SEARCH FILTER
========================================================== */

const buildWhereClause = (
  req: Request
): Prisma.TransactionWhereInput => {
  const where: Prisma.TransactionWhereInput = {};

  if (req.query.userId)
    where.userId = String(req.query.userId);

  if (req.query.walletId)
    where.walletId = String(req.query.walletId);

  if (req.query.transactionId)
    where.transactionId = String(
      req.query.transactionId
    );

  if (req.query.referenceId)
    where.referenceId = String(
      req.query.referenceId
    );

  if (req.query.status)
    where.status = String(req.query.status);

  if (req.query.type)
    where.type = String(req.query.type);

  if (req.query.category)
    where.category = String(req.query.category);

  if (req.query.paymentMethod)
    where.paymentMethod = String(
      req.query.paymentMethod
    );

  return where;
};

/* ==========================================================
   ERROR HANDLER
========================================================== */

const handleError = (
  res: Response,
  error: any
) => {
  console.error(error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    return failure(
      res,
      error.message,
      error.meta,
      400
    );
  }

  return failure(
    res,
    error?.message || "Internal Server Error"
  );
};

/* ==========================================================
   CREATE TRANSACTION
========================================================== */

const createTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as CreateTransactionDto;

    if (!body.amount || body.amount <= 0) {
      return failure(
        res,
        "Amount must be greater than zero",
        null,
        400
      );
    }

    if (!body.category) {
      return failure(
        res,
        "Category is required",
        null,
        400
      );
    }

    const transaction = await transactionService.create({
      transactionId: `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,

      user: body.userId
        ? {
            connect: {
              id: body.userId,
            },
          }
        : undefined,

      type: body.transactionType,

      category: body.category,

      amount: body.amount,

 paymentMethod: body.paymentMode,

referenceId: body.referenceId,

gatewayTxnId: body.gatewayTransactionId,

      description: body.description,

      status: "pending",
    });

    return success(
      res,
      "Transaction created successfully",
      transaction,
      201
    );
  } catch (error) {
    return handleError(res, error);
  }
};
/* ==========================================================
   GET TRANSACTION BY ID
========================================================== */

const getTransactionById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

const transaction =
  await transactionService.getById(id);

    if (!transaction) {
      return failure(
        res,
        "Transaction not found",
        null,
        404
      );
    }

    return success(
      res,
      "Transaction fetched successfully",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   GET ALL TRANSACTIONS
========================================================== */

const getAllTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } =
      getPagination(req);

    const where =
      buildWhereClause(req);

    const data =
      await transactionService.getAll(
        where,
        page,
        limit
      );

    return success(
      res,
      "Transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   UPDATE TRANSACTION
========================================================== */

const updateTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const body =
      req.body as UpdateTransactionDto;

    const existing =
      await transactionService.getById(id);

    if (!existing) {
      return failure(
        res,
        "Transaction not found",
        null,
        404
      );
    }

    const updated =
      await transactionService.update(
        id,
        body as Prisma.TransactionUpdateInput
      );

    return success(
      res,
      "Transaction updated successfully",
      updated
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   DELETE TRANSACTION
========================================================== */

const deleteTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const existing =
      await transactionService.getById(id);

    if (!existing) {
      return failure(
        res,
        "Transaction not found",
        null,
        404
      );
    }

    await transactionService.delete(id);

    return success(
      res,
      "Transaction deleted successfully"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   USER TRANSACTIONS
========================================================== */

const getUserTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const userId = String(req.params.userId);

    const data = await transactionService.search(
      {
        userId,
      },
      page,
      limit
    );

    return success(
      res,
      "User transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getCustomerTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { customerId } = req.params;
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        customerId,
      } as Prisma.TransactionWhereInput,
      page,
      limit
    );

    return success(
      res,
      "Customer transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getDsaTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { dsaId } = req.params;
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        dsaId,
      } as Prisma.TransactionWhereInput,
      page,
      limit
    );

    return success(
      res,
      "DSA transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getPartnerTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { partnerId } = req.params;
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        partnerId,
      } as Prisma.TransactionWhereInput,
      page,
      limit
    );

    return success(
      res,
      "Partner transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   CREDIT / DEBIT
========================================================== */

const getCreditTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        type: "CREDIT",
      } as Prisma.TransactionWhereInput,
      page,
      limit
    );

    return success(
      res,
      "Credit transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getDebitTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        type: "DEBIT",
      } as Prisma.TransactionWhereInput,
      page,
      limit
    );

    return success(
      res,
      "Debit transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   STATUS TRANSACTIONS
========================================================== */

const getPendingTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const transactions =
      await transactionService.search(
        {
          status: "pending",
        },
        page,
        limit
      );

    return success(
      res,
      "Pending transactions fetched successfully",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getSuccessTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const transactions =
      await transactionService.search(
        {
          status: "success",
        },
        page,
        limit
      );

    return success(
      res,
      "Success transactions fetched successfully",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getFailedTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const transactions =
      await transactionService.search(
        {
          status: "failed",
        },
        page,
        limit
      );

    return success(
      res,
      "Failed transactions fetched successfully",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const getRefundedTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const transactions =
      await transactionService.search(
        {
          isRefunded: true,
        },
        page,
        limit
      );

    return success(
      res,
      "Refunded transactions fetched successfully",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   PROCESS
========================================================== */

const processTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const transaction =
      await transactionService.process(id);

    return success(
      res,
      "Transaction moved to processing",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const verifyTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const body = req.body as VerifyTransactionDto;

    const transaction = await transactionService.verify(
      id,
      body.verifiedBy
    );

    return success(
      res,
      "Transaction verified successfully",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const approveTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const body =
      req.body as ApproveTransactionDto;

    const transaction =
      await transactionService.approve(
        id,
        body.approvedBy
      );

    return success(
      res,
      "Transaction approved successfully",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const rejectTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const body =
      req.body as RejectTransactionDto;

    const transaction =
      await transactionService.reject(
        id,
        body.rejectedBy,
        body.rejectReason
      );

    return success(
      res,
      "Transaction rejected successfully",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const refundTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const body =
      req.body as RefundTransactionDto;

    const transaction = await transactionService.refund(
  id,
  body.refundAmount,
  body.reason,
  body.refundedBy ?? "SYSTEM"
);

    return success(
      res,
      "Transaction refunded successfully",
      transaction
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   DASHBOARD
========================================================== */

const getTransactionDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const dashboard =
      await transactionService.dashboard();

    return success(
      res,
      "Transaction dashboard fetched successfully",
      dashboard
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   ANALYTICS
========================================================== */

const getTransactionAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const analytics =
      await transactionService.analytics();

    return success(
      res,
      "Transaction analytics fetched successfully",
      analytics
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   STATISTICS
========================================================== */

const getTransactionStatistics = async (
  req: Request,
  res: Response
) => {
  try {
    const statistics =
      await transactionService.statistics();

    return success(
      res,
      "Transaction statistics fetched successfully",
      statistics
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   DAILY REPORT
========================================================== */

const getDailyTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const data =
      await transactionService.search(
        {
          createdAt: {
            gte: today,
          },
        },
        1,
        100
      );

    return success(
      res,
      "Daily transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   WEEKLY REPORT
========================================================== */

const getWeeklyTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const date = new Date();

    date.setDate(date.getDate() - 7);

    const data =
      await transactionService.search(
        {
          createdAt: {
            gte: date,
          },
        },
        1,
        500
      );

    return success(
      res,
      "Weekly transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   MONTHLY REPORT
========================================================== */

const getMonthlyTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const date = new Date();

    date.setMonth(date.getMonth() - 1);

    const data =
      await transactionService.search(
        {
          createdAt: {
            gte: date,
          },
        },
        1,
        1000
      );

    return success(
      res,
      "Monthly transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   YEARLY REPORT
========================================================== */

const getYearlyTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const date = new Date();

    date.setFullYear(date.getFullYear() - 1);

    const data =
      await transactionService.search(
        {
          createdAt: {
            gte: date,
          },
        },
        1,
        5000
      );

    return success(
      res,
      "Yearly transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   TOP TRANSACTIONS
========================================================== */

const getTopTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        amount: "desc",
      },
      take: 20,
    });

    return success(
      res,
      "Top transactions fetched successfully",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   TOP CUSTOMERS
========================================================== */

const getTopCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const customers = await prisma.transaction.groupBy({
      by: ["customerId"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 20,
    });

    return success(
      res,
      "Top customers fetched successfully",
      customers
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   TOP DSA
========================================================== */

const getTopDsa = async (
  req: Request,
  res: Response
) => {
  try {
    const dsa = await prisma.transaction.groupBy({
      by: ["dsaId"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 20,
    });

    return success(
      res,
      "Top DSA fetched successfully",
      dsa
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   TOP PARTNERS
========================================================== */

const getTopPartners = async (
  req: Request,
  res: Response
) => {
  try {
    const partners = await prisma.transaction.groupBy({
      by: ["partnerId"],
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 20,
    });

    return success(
      res,
      "Top partners fetched successfully",
      partners
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   CATEGORY REPORTS
========================================================== */

const getRevenueTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "REVENUE",
      },
      page,
      limit
    );

    return success(res, "Revenue transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getCommissionTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "COMMISSION",
      },
      page,
      limit
    );

    return success(res, "Commission transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getReferralTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "REFERRAL",
      },
      page,
      limit
    );

    return success(res, "Referral transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getLoanTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "LOAN",
      },
      page,
      limit
    );

    return success(res, "Loan transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getRechargeTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "RECHARGE",
      },
      page,
      limit
    );

    return success(res, "Recharge transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getInsuranceTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "INSURANCE",
      },
      page,
      limit
    );

    return success(res, "Insurance transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getInvestmentTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const data = await transactionService.search(
      {
        category: "INVESTMENT",
      },
      page,
      limit
    );

    return success(res, "Investment transactions", data);
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   SEARCH
========================================================== */

const searchTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = getPagination(req);

    const where = buildWhereClause(req);

    const data = await transactionService.search(
      where,
      page,
      limit
    );

    return success(
      res,
      "Transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   LIVE
========================================================== */

const getLiveTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return success(
      res,
      "Live transactions fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   AUDIT
========================================================== */

const getTransactionAuditLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.transaction.findMany({
      select: {
        id: true,
        transactionId: true,
        status: true,
        approvedBy: true,
        verifiedBy: true,
        refundedBy: true,
        ipAddress: true,
        deviceInfo: true,
        platform: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(
      res,
      "Audit logs fetched successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   EXPORT
========================================================== */

const exportTransactionsCsv = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions =
      await prisma.transaction.findMany();

    return success(
      res,
      "CSV export generated",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const exportTransactionsExcel = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions =
      await prisma.transaction.findMany();

    return success(
      res,
      "Excel export generated",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const exportTransactionsPdf = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions =
      await prisma.transaction.findMany();

    return success(
      res,
      "PDF export generated",
      transactions
    );
  } catch (error) {
    return handleError(res, error);
  }
};

/* ==========================================================
   BULK ACTIONS
========================================================== */

const bulkApproveTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      req.body as BulkApproveTransactionDto;

    const data =
      await transactionService.bulkApprove(
        body.ids,
        body.approvedBy
      );

    return success(
      res,
      "Transactions approved successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const bulkRejectTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      req.body as BulkRejectTransactionDto;

    const data =
      await transactionService.bulkReject(
        body.ids,
        body.rejectedBy,
        body.rejectReason
      );

    return success(
      res,
      "Transactions rejected successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const bulkRefundTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      req.body as BulkRefundTransactionDto;

    const data =
      await transactionService.bulkRefund(
        body.ids,
        body.refundedBy
      );

    return success(
      res,
      "Transactions refunded successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const bulkDeleteTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const body =
      req.body as BulkDeleteTransactionDto;

    const data =
      await transactionService.bulkDelete(
        body.ids
      );

    return success(
      res,
      "Transactions deleted successfully",
      data
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,

  getUserTransactions,
  getCustomerTransactions,
  getDsaTransactions,
  getPartnerTransactions,

  getCreditTransactions,
  getDebitTransactions,

  getPendingTransactions,
  getSuccessTransactions,
  getFailedTransactions,
  getRefundedTransactions,

  processTransaction,
  verifyTransaction,

  approveTransaction,
  rejectTransaction,
  refundTransaction,

  getTransactionDashboard,
  getTransactionAnalytics,
  getTransactionStatistics,

  getDailyTransactions,
  getWeeklyTransactions,
  getMonthlyTransactions,
  getYearlyTransactions,

  getTopTransactions,
  getTopCustomers,
  getTopDsa,
  getTopPartners,

  getRevenueTransactions,
  getCommissionTransactions,
  getReferralTransactions,
  getLoanTransactions,
  getRechargeTransactions,
  getInsuranceTransactions,
  getInvestmentTransactions,

  searchTransactions,
  getLiveTransactions,
  getTransactionAuditLogs,

  exportTransactionsCsv,
  exportTransactionsExcel,
  exportTransactionsPdf,

  bulkApproveTransactions,
  bulkRejectTransactions,
  bulkRefundTransactions,
  bulkDeleteTransactions,
};