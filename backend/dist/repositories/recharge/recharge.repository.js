"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRechargeRepo = exports.bulkRefundRechargeRepo = exports.bulkProcessRechargeRepo = exports.monthlyRechargeRepo = exports.topRechargeUsersRepo = exports.rechargeAnalyticsRepo = exports.searchRechargeRepo = exports.getRechargeByStatusRepo = exports.getFastagRechargeRepo = exports.getDthRechargeRepo = exports.getMobileRechargeRepo = exports.getUserRechargeRepo = exports.refundRechargeRepo = exports.updateRechargeStatusRepo = exports.deleteRechargeRepo = exports.updateRechargeRepo = exports.getAllRechargeRepo = exports.findRechargeByTxnRefRepo = exports.findRechargeByIdRepo = exports.createRechargeRepo = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ===========================================
   CREATE
=========================================== */
const createRechargeRepo = (data) => {
    return prisma_1.default.recharge.create({
        data,
        include: {
            user: true,
        },
    });
};
exports.createRechargeRepo = createRechargeRepo;
/* ===========================================
   FIND
=========================================== */
const findRechargeByIdRepo = (id) => {
    return prisma_1.default.recharge.findUnique({
        where: { id },
        include: {
            user: true,
        },
    });
};
exports.findRechargeByIdRepo = findRechargeByIdRepo;
const findRechargeByTxnRefRepo = (transactionRef) => {
    return prisma_1.default.recharge.findUnique({
        where: {
            transactionRef,
        },
    });
};
exports.findRechargeByTxnRefRepo = findRechargeByTxnRefRepo;
const getAllRechargeRepo = () => {
    return prisma_1.default.recharge.findMany({
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllRechargeRepo = getAllRechargeRepo;
/* ===========================================
   UPDATE
=========================================== */
const updateRechargeRepo = (id, data) => {
    return prisma_1.default.recharge.update({
        where: { id },
        data,
    });
};
exports.updateRechargeRepo = updateRechargeRepo;
const deleteRechargeRepo = (id) => {
    return prisma_1.default.recharge.delete({
        where: { id },
    });
};
exports.deleteRechargeRepo = deleteRechargeRepo;
/* ===========================================
   STATUS
=========================================== */
const updateRechargeStatusRepo = (id, status, failureReason) => {
    return prisma_1.default.recharge.update({
        where: { id },
        data: {
            status,
            failureReason,
            processedAt: new Date(),
            completedAt: status === client_1.RechargeStatus.SUCCESS
                ? new Date()
                : undefined,
        },
    });
};
exports.updateRechargeStatusRepo = updateRechargeStatusRepo;
const refundRechargeRepo = (id, refundedBy) => {
    return prisma_1.default.recharge.update({
        where: { id },
        data: {
            status: client_1.RechargeStatus.REFUNDED,
            refundedAt: new Date(),
            refundedBy,
        },
    });
};
exports.refundRechargeRepo = refundRechargeRepo;
/* ===========================================
   USER
=========================================== */
const getUserRechargeRepo = (userId) => {
    return prisma_1.default.recharge.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getUserRechargeRepo = getUserRechargeRepo;
/* ===========================================
   MOBILE
=========================================== */
const getMobileRechargeRepo = () => {
    return prisma_1.default.recharge.findMany({
        where: {
            rechargeType: client_1.RechargeType.MOBILE,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getMobileRechargeRepo = getMobileRechargeRepo;
const getDthRechargeRepo = () => {
    return prisma_1.default.recharge.findMany({
        where: {
            rechargeType: client_1.RechargeType.DTH,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getDthRechargeRepo = getDthRechargeRepo;
const getFastagRechargeRepo = () => {
    return prisma_1.default.recharge.findMany({
        where: {
            rechargeType: client_1.RechargeType.FASTAG,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getFastagRechargeRepo = getFastagRechargeRepo;
/* ===========================================
   STATUS FILTER
=========================================== */
const getRechargeByStatusRepo = (status) => {
    return prisma_1.default.recharge.findMany({
        where: {
            status,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getRechargeByStatusRepo = getRechargeByStatusRepo;
/* ===========================================
   SEARCH
=========================================== */
const searchRechargeRepo = (keyword) => {
    return prisma_1.default.recharge.findMany({
        where: {
            OR: [
                {
                    mobileNumber: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    operator: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    transactionRef: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
            ],
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.searchRechargeRepo = searchRechargeRepo;
/* ===========================================
   ANALYTICS
=========================================== */
const rechargeAnalyticsRepo = async () => {
    const [total, pending, success, failed, refunded, totalAmount, totalCommission,] = await Promise.all([
        prisma_1.default.recharge.count(),
        prisma_1.default.recharge.count({
            where: {
                status: client_1.RechargeStatus.PENDING,
            },
        }),
        prisma_1.default.recharge.count({
            where: {
                status: client_1.RechargeStatus.SUCCESS,
            },
        }),
        prisma_1.default.recharge.count({
            where: {
                status: client_1.RechargeStatus.FAILED,
            },
        }),
        prisma_1.default.recharge.count({
            where: {
                status: client_1.RechargeStatus.REFUNDED,
            },
        }),
        prisma_1.default.recharge.aggregate({
            _sum: {
                amount: true,
            },
        }),
        prisma_1.default.recharge.aggregate({
            _sum: {
                commissionAmount: true,
            },
        }),
    ]);
    return {
        total,
        pending,
        success,
        failed,
        refunded,
        totalAmount: totalAmount._sum.amount ?? 0,
        totalCommission: totalCommission._sum
            .commissionAmount ?? 0,
    };
};
exports.rechargeAnalyticsRepo = rechargeAnalyticsRepo;
/* ===========================================
   TOP USERS
=========================================== */
const topRechargeUsersRepo = () => {
    return prisma_1.default.recharge.groupBy({
        by: ["userId"],
        _count: {
            id: true,
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
        take: 10,
    });
};
exports.topRechargeUsersRepo = topRechargeUsersRepo;
/* ===========================================
   MONTHLY
=========================================== */
const monthlyRechargeRepo = () => {
    return prisma_1.default.recharge.groupBy({
        by: ["createdAt"],
        _sum: {
            amount: true,
        },
        _count: {
            id: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
exports.monthlyRechargeRepo = monthlyRechargeRepo;
/* ===========================================
   BULK
=========================================== */
const bulkProcessRechargeRepo = (ids, status) => {
    return prisma_1.default.recharge.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            status,
            processedAt: new Date(),
        },
    });
};
exports.bulkProcessRechargeRepo = bulkProcessRechargeRepo;
const bulkRefundRechargeRepo = (ids) => {
    return prisma_1.default.recharge.updateMany({
        where: {
            id: {
                in: ids,
            },
        },
        data: {
            status: client_1.RechargeStatus.REFUNDED,
            refundedAt: new Date(),
        },
    });
};
exports.bulkRefundRechargeRepo = bulkRefundRechargeRepo;
/* ===========================================
   EXPORT
=========================================== */
const exportRechargeRepo = () => {
    return prisma_1.default.recharge.findMany({
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.exportRechargeRepo = exportRechargeRepo;
