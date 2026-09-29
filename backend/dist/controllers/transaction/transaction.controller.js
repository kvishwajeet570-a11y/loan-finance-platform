"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteTransactions = exports.bulkRefundTransactions = exports.bulkRejectTransactions = exports.bulkApproveTransactions = exports.exportTransactionsPdf = exports.exportTransactionsExcel = exports.exportTransactionsCsv = exports.getTransactionAuditLogs = exports.getLiveTransactions = exports.searchTransactions = exports.getInvestmentTransactions = exports.getInsuranceTransactions = exports.getRechargeTransactions = exports.getLoanTransactions = exports.getReferralTransactions = exports.getCommissionTransactions = exports.getRevenueTransactions = exports.getTopPartners = exports.getTopDsa = exports.getTopCustomers = exports.getTopTransactions = exports.getYearlyTransactions = exports.getMonthlyTransactions = exports.getWeeklyTransactions = exports.getDailyTransactions = exports.getTransactionStatistics = exports.getTransactionAnalytics = exports.getTransactionDashboard = exports.refundTransaction = exports.rejectTransaction = exports.approveTransaction = exports.verifyTransaction = exports.processTransaction = exports.getRefundedTransactions = exports.getFailedTransactions = exports.getSuccessTransactions = exports.getPendingTransactions = exports.getDebitTransactions = exports.getCreditTransactions = exports.getPartnerTransactions = exports.getDsaTransactions = exports.getCustomerTransactions = exports.getUserTransactions = exports.deleteTransaction = exports.updateTransaction = exports.getAllTransactions = exports.getTransactionById = exports.createTransaction = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const transaction_service_1 = __importDefault(require("../../services/transaction/transaction.service"));
/* ==========================================================
   CONSTANTS
========================================================== */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
/* ==========================================================
   RESPONSE HELPERS
========================================================== */
const success = (res, message, data = null, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
};
const failure = (res, message, error = null, status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        error,
    });
};
/* ==========================================================
   PAGINATION
========================================================== */
const getPagination = (req) => {
    const page = Math.max(Number(req.query.page) || DEFAULT_PAGE, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};
/* ==========================================================
   SORT
========================================================== */
const getSort = (req) => {
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "asc" : "desc";
    return {
        [sortBy]: order,
    };
};
/* ==========================================================
   SEARCH FILTER
========================================================== */
const buildWhereClause = (req) => {
    const where = {};
    if (req.query.userId)
        where.userId = String(req.query.userId);
    if (req.query.walletId)
        where.walletId = String(req.query.walletId);
    if (req.query.transactionId)
        where.transactionId = String(req.query.transactionId);
    if (req.query.referenceId)
        where.referenceId = String(req.query.referenceId);
    if (req.query.status)
        where.status = String(req.query.status);
    if (req.query.type)
        where.type = String(req.query.type);
    if (req.query.category)
        where.category = String(req.query.category);
    if (req.query.paymentMethod)
        where.paymentMethod = String(req.query.paymentMethod);
    return where;
};
/* ==========================================================
   ERROR HANDLER
========================================================== */
const handleError = (res, error) => {
    console.error(error);
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        return failure(res, error.message, error.meta, 400);
    }
    return failure(res, error?.message || "Internal Server Error");
};
/* ==========================================================
   CREATE TRANSACTION
========================================================== */
const createTransaction = async (req, res) => {
    try {
        const body = req.body;
        if (!body.amount || body.amount <= 0) {
            return failure(res, "Amount must be greater than zero", null, 400);
        }
        if (!body.category) {
            return failure(res, "Category is required", null, 400);
        }
        const transaction = await transaction_service_1.default.create({
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
        return success(res, "Transaction created successfully", transaction, 201);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.createTransaction = createTransaction;
/* ==========================================================
   GET TRANSACTION BY ID
========================================================== */
const getTransactionById = async (req, res) => {
    try {
        const id = String(req.params.id);
        const transaction = await transaction_service_1.default.getById(id);
        if (!transaction) {
            return failure(res, "Transaction not found", null, 404);
        }
        return success(res, "Transaction fetched successfully", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTransactionById = getTransactionById;
/* ==========================================================
   GET ALL TRANSACTIONS
========================================================== */
const getAllTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const where = buildWhereClause(req);
        const data = await transaction_service_1.default.getAll(where, page, limit);
        return success(res, "Transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getAllTransactions = getAllTransactions;
/* ==========================================================
   UPDATE TRANSACTION
========================================================== */
const updateTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        const existing = await transaction_service_1.default.getById(id);
        if (!existing) {
            return failure(res, "Transaction not found", null, 404);
        }
        const updated = await transaction_service_1.default.update(id, body);
        return success(res, "Transaction updated successfully", updated);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.updateTransaction = updateTransaction;
/* ==========================================================
   DELETE TRANSACTION
========================================================== */
const deleteTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const existing = await transaction_service_1.default.getById(id);
        if (!existing) {
            return failure(res, "Transaction not found", null, 404);
        }
        await transaction_service_1.default.delete(id);
        return success(res, "Transaction deleted successfully");
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.deleteTransaction = deleteTransaction;
/* ==========================================================
   USER TRANSACTIONS
========================================================== */
const getUserTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const userId = String(req.params.userId);
        const data = await transaction_service_1.default.search({
            userId,
        }, page, limit);
        return success(res, "User transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getUserTransactions = getUserTransactions;
const getCustomerTransactions = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            customerId,
        }, page, limit);
        return success(res, "Customer transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getCustomerTransactions = getCustomerTransactions;
const getDsaTransactions = async (req, res) => {
    try {
        const { dsaId } = req.params;
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            dsaId,
        }, page, limit);
        return success(res, "DSA transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getDsaTransactions = getDsaTransactions;
const getPartnerTransactions = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            partnerId,
        }, page, limit);
        return success(res, "Partner transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getPartnerTransactions = getPartnerTransactions;
/* ==========================================================
   CREDIT / DEBIT
========================================================== */
const getCreditTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            type: "CREDIT",
        }, page, limit);
        return success(res, "Credit transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getCreditTransactions = getCreditTransactions;
const getDebitTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            type: "DEBIT",
        }, page, limit);
        return success(res, "Debit transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getDebitTransactions = getDebitTransactions;
/* ==========================================================
   STATUS TRANSACTIONS
========================================================== */
const getPendingTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const transactions = await transaction_service_1.default.search({
            status: "pending",
        }, page, limit);
        return success(res, "Pending transactions fetched successfully", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getPendingTransactions = getPendingTransactions;
const getSuccessTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const transactions = await transaction_service_1.default.search({
            status: "success",
        }, page, limit);
        return success(res, "Success transactions fetched successfully", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getSuccessTransactions = getSuccessTransactions;
const getFailedTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const transactions = await transaction_service_1.default.search({
            status: "failed",
        }, page, limit);
        return success(res, "Failed transactions fetched successfully", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getFailedTransactions = getFailedTransactions;
const getRefundedTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const transactions = await transaction_service_1.default.search({
            isRefunded: true,
        }, page, limit);
        return success(res, "Refunded transactions fetched successfully", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getRefundedTransactions = getRefundedTransactions;
/* ==========================================================
   PROCESS
========================================================== */
const processTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const transaction = await transaction_service_1.default.process(id);
        return success(res, "Transaction moved to processing", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.processTransaction = processTransaction;
const verifyTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        const transaction = await transaction_service_1.default.verify(id, body.verifiedBy);
        return success(res, "Transaction verified successfully", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.verifyTransaction = verifyTransaction;
const approveTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        const transaction = await transaction_service_1.default.approve(id, body.approvedBy);
        return success(res, "Transaction approved successfully", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.approveTransaction = approveTransaction;
const rejectTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        const transaction = await transaction_service_1.default.reject(id, body.rejectedBy, body.rejectReason);
        return success(res, "Transaction rejected successfully", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.rejectTransaction = rejectTransaction;
const refundTransaction = async (req, res) => {
    try {
        const id = String(req.params.id);
        const body = req.body;
        const transaction = await transaction_service_1.default.refund(id, body.refundAmount, body.reason, body.refundedBy ?? "SYSTEM");
        return success(res, "Transaction refunded successfully", transaction);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.refundTransaction = refundTransaction;
/* ==========================================================
   DASHBOARD
========================================================== */
const getTransactionDashboard = async (req, res) => {
    try {
        const dashboard = await transaction_service_1.default.dashboard();
        return success(res, "Transaction dashboard fetched successfully", dashboard);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTransactionDashboard = getTransactionDashboard;
/* ==========================================================
   ANALYTICS
========================================================== */
const getTransactionAnalytics = async (req, res) => {
    try {
        const analytics = await transaction_service_1.default.analytics();
        return success(res, "Transaction analytics fetched successfully", analytics);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTransactionAnalytics = getTransactionAnalytics;
/* ==========================================================
   STATISTICS
========================================================== */
const getTransactionStatistics = async (req, res) => {
    try {
        const statistics = await transaction_service_1.default.statistics();
        return success(res, "Transaction statistics fetched successfully", statistics);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTransactionStatistics = getTransactionStatistics;
/* ==========================================================
   DAILY REPORT
========================================================== */
const getDailyTransactions = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const data = await transaction_service_1.default.search({
            createdAt: {
                gte: today,
            },
        }, 1, 100);
        return success(res, "Daily transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getDailyTransactions = getDailyTransactions;
/* ==========================================================
   WEEKLY REPORT
========================================================== */
const getWeeklyTransactions = async (req, res) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const data = await transaction_service_1.default.search({
            createdAt: {
                gte: date,
            },
        }, 1, 500);
        return success(res, "Weekly transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getWeeklyTransactions = getWeeklyTransactions;
/* ==========================================================
   MONTHLY REPORT
========================================================== */
const getMonthlyTransactions = async (req, res) => {
    try {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        const data = await transaction_service_1.default.search({
            createdAt: {
                gte: date,
            },
        }, 1, 1000);
        return success(res, "Monthly transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getMonthlyTransactions = getMonthlyTransactions;
/* ==========================================================
   YEARLY REPORT
========================================================== */
const getYearlyTransactions = async (req, res) => {
    try {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        const data = await transaction_service_1.default.search({
            createdAt: {
                gte: date,
            },
        }, 1, 5000);
        return success(res, "Yearly transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getYearlyTransactions = getYearlyTransactions;
/* ==========================================================
   TOP TRANSACTIONS
========================================================== */
const getTopTransactions = async (req, res) => {
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            orderBy: {
                amount: "desc",
            },
            take: 20,
        });
        return success(res, "Top transactions fetched successfully", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTopTransactions = getTopTransactions;
/* ==========================================================
   TOP CUSTOMERS
========================================================== */
const getTopCustomers = async (req, res) => {
    try {
        const customers = await prisma_1.default.transaction.groupBy({
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
        return success(res, "Top customers fetched successfully", customers);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTopCustomers = getTopCustomers;
/* ==========================================================
   TOP DSA
========================================================== */
const getTopDsa = async (req, res) => {
    try {
        const dsa = await prisma_1.default.transaction.groupBy({
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
        return success(res, "Top DSA fetched successfully", dsa);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTopDsa = getTopDsa;
/* ==========================================================
   TOP PARTNERS
========================================================== */
const getTopPartners = async (req, res) => {
    try {
        const partners = await prisma_1.default.transaction.groupBy({
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
        return success(res, "Top partners fetched successfully", partners);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTopPartners = getTopPartners;
/* ==========================================================
   CATEGORY REPORTS
========================================================== */
const getRevenueTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "REVENUE",
        }, page, limit);
        return success(res, "Revenue transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getRevenueTransactions = getRevenueTransactions;
const getCommissionTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "COMMISSION",
        }, page, limit);
        return success(res, "Commission transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getCommissionTransactions = getCommissionTransactions;
const getReferralTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "REFERRAL",
        }, page, limit);
        return success(res, "Referral transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getReferralTransactions = getReferralTransactions;
const getLoanTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "LOAN",
        }, page, limit);
        return success(res, "Loan transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getLoanTransactions = getLoanTransactions;
const getRechargeTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "RECHARGE",
        }, page, limit);
        return success(res, "Recharge transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getRechargeTransactions = getRechargeTransactions;
const getInsuranceTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "INSURANCE",
        }, page, limit);
        return success(res, "Insurance transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getInsuranceTransactions = getInsuranceTransactions;
const getInvestmentTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const data = await transaction_service_1.default.search({
            category: "INVESTMENT",
        }, page, limit);
        return success(res, "Investment transactions", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getInvestmentTransactions = getInvestmentTransactions;
/* ==========================================================
   SEARCH
========================================================== */
const searchTransactions = async (req, res) => {
    try {
        const { page, limit } = getPagination(req);
        const where = buildWhereClause(req);
        const data = await transaction_service_1.default.search(where, page, limit);
        return success(res, "Transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.searchTransactions = searchTransactions;
/* ==========================================================
   LIVE
========================================================== */
const getLiveTransactions = async (req, res) => {
    try {
        const data = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });
        return success(res, "Live transactions fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getLiveTransactions = getLiveTransactions;
/* ==========================================================
   AUDIT
========================================================== */
const getTransactionAuditLogs = async (req, res) => {
    try {
        const data = await prisma_1.default.transaction.findMany({
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
        return success(res, "Audit logs fetched successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.getTransactionAuditLogs = getTransactionAuditLogs;
/* ==========================================================
   EXPORT
========================================================== */
const exportTransactionsCsv = async (req, res) => {
    try {
        const transactions = await prisma_1.default.transaction.findMany();
        return success(res, "CSV export generated", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.exportTransactionsCsv = exportTransactionsCsv;
const exportTransactionsExcel = async (req, res) => {
    try {
        const transactions = await prisma_1.default.transaction.findMany();
        return success(res, "Excel export generated", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.exportTransactionsExcel = exportTransactionsExcel;
const exportTransactionsPdf = async (req, res) => {
    try {
        const transactions = await prisma_1.default.transaction.findMany();
        return success(res, "PDF export generated", transactions);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.exportTransactionsPdf = exportTransactionsPdf;
/* ==========================================================
   BULK ACTIONS
========================================================== */
const bulkApproveTransactions = async (req, res) => {
    try {
        const body = req.body;
        const data = await transaction_service_1.default.bulkApprove(body.ids, body.approvedBy);
        return success(res, "Transactions approved successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.bulkApproveTransactions = bulkApproveTransactions;
const bulkRejectTransactions = async (req, res) => {
    try {
        const body = req.body;
        const data = await transaction_service_1.default.bulkReject(body.ids, body.rejectedBy, body.rejectReason);
        return success(res, "Transactions rejected successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.bulkRejectTransactions = bulkRejectTransactions;
const bulkRefundTransactions = async (req, res) => {
    try {
        const body = req.body;
        const data = await transaction_service_1.default.bulkRefund(body.ids, body.refundedBy);
        return success(res, "Transactions refunded successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.bulkRefundTransactions = bulkRefundTransactions;
const bulkDeleteTransactions = async (req, res) => {
    try {
        const body = req.body;
        const data = await transaction_service_1.default.bulkDelete(body.ids);
        return success(res, "Transactions deleted successfully", data);
    }
    catch (error) {
        return handleError(res, error);
    }
};
exports.bulkDeleteTransactions = bulkDeleteTransactions;
