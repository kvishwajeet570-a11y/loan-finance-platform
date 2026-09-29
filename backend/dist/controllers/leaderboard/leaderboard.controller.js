"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeaderboardPdf = exports.exportLeaderboardExcel = exports.getLeaderboardDashboard = exports.getLeaderboardAnalytics = exports.getAchievementLeaderboard = exports.getWalletLeaderboard = exports.getRevenueLeaderboard = exports.getYearlyLeaderboard = exports.getMonthlyLeaderboard = exports.getWeeklyLeaderboard = exports.getDailyLeaderboard = exports.getTopPartners = exports.getTopDsa = exports.getTopCustomers = exports.getFastagLeaderboard = exports.getInvestmentLeaderboard = exports.getInsuranceLeaderboard = exports.getReferralLeaderboard = exports.getCommissionLeaderboard = exports.getLoanLeaderboard = exports.getPartnerLeaderboard = exports.getDsaLeaderboard = exports.getCustomerLeaderboard = exports.getOverallLeaderboard = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   BASE LEADERBOARD LOGIC
======================================== */
const buildLeaderboard = async () => {
    const loans = await prisma_1.default.loanApplication.findMany({
        where: {
            status: "APPROVED",
        },
        include: {
            user: true,
        },
    });
    const groupedUsers = {};
    loans.forEach((loan) => {
        const userName = loan.user?.name ||
            loan.fullName ||
            "Unknown User";
        if (groupedUsers[userName]) {
            groupedUsers[userName].totalAmount += loan.amount;
            groupedUsers[userName].totalLoans += 1;
        }
        else {
            groupedUsers[userName] = {
                name: userName,
                totalAmount: loan.amount,
                totalLoans: 1,
            };
        }
    });
    return Object.values(groupedUsers)
        .map((user) => ({
        ...user,
        commission: Math.round(user.totalAmount * 0.02),
    }))
        .sort((a, b) => b.totalAmount - a.totalAmount);
};
/* ========================================
   MAIN
======================================== */
const getOverallLeaderboard = async (req, res) => {
    try {
        const leaderboard = await buildLeaderboard();
        return res.status(200).json({
            success: true,
            data: leaderboard,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard",
            error,
        });
    }
};
exports.getOverallLeaderboard = getOverallLeaderboard;
/* ========================================
   USER LEADERBOARDS
======================================== */
exports.getCustomerLeaderboard = exports.getOverallLeaderboard;
exports.getDsaLeaderboard = exports.getOverallLeaderboard;
exports.getPartnerLeaderboard = exports.getOverallLeaderboard;
/* ========================================
   BUSINESS LEADERBOARDS
======================================== */
exports.getLoanLeaderboard = exports.getOverallLeaderboard;
exports.getCommissionLeaderboard = exports.getOverallLeaderboard;
exports.getReferralLeaderboard = exports.getOverallLeaderboard;
exports.getInsuranceLeaderboard = exports.getOverallLeaderboard;
exports.getInvestmentLeaderboard = exports.getOverallLeaderboard;
exports.getFastagLeaderboard = exports.getOverallLeaderboard;
/* ========================================
   TOP PERFORMERS
======================================== */
exports.getTopCustomers = exports.getOverallLeaderboard;
exports.getTopDsa = exports.getOverallLeaderboard;
exports.getTopPartners = exports.getOverallLeaderboard;
/* ========================================
   PERIOD WISE
======================================== */
exports.getDailyLeaderboard = exports.getOverallLeaderboard;
exports.getWeeklyLeaderboard = exports.getOverallLeaderboard;
exports.getMonthlyLeaderboard = exports.getOverallLeaderboard;
exports.getYearlyLeaderboard = exports.getOverallLeaderboard;
/* ========================================
   FINANCIAL
======================================== */
exports.getRevenueLeaderboard = exports.getOverallLeaderboard;
exports.getWalletLeaderboard = exports.getOverallLeaderboard;
/* ========================================
   ACHIEVEMENTS
======================================== */
exports.getAchievementLeaderboard = exports.getOverallLeaderboard;
/* ========================================
   ANALYTICS
======================================== */
const getLeaderboardAnalytics = async (req, res) => {
    try {
        const leaderboard = await buildLeaderboard();
        const totalBusiness = leaderboard.reduce((acc, item) => acc + item.totalAmount, 0);
        const totalCommission = leaderboard.reduce((acc, item) => acc + item.commission, 0);
        return res.status(200).json({
            success: true,
            totalUsers: leaderboard.length,
            totalBusiness,
            totalCommission,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};
exports.getLeaderboardAnalytics = getLeaderboardAnalytics;
/* ========================================
   DASHBOARD
======================================== */
exports.getLeaderboardDashboard = exports.getLeaderboardAnalytics;
/* ========================================
   EXPORTS
======================================== */
const exportLeaderboardExcel = async (req, res) => {
    return res.json({
        success: true,
        message: "Excel export coming soon",
    });
};
exports.exportLeaderboardExcel = exportLeaderboardExcel;
const exportLeaderboardPdf = async (req, res) => {
    return res.json({
        success: true,
        message: "PDF export coming soon",
    });
};
exports.exportLeaderboardPdf = exportLeaderboardPdf;
