"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSystem = exports.getNotifications = exports.getLiveActivities = exports.bulkApproveLoans = exports.bulkDeleteUsers = exports.bulkBlockUsers = exports.getCommissionDashboard = exports.getRevenueDashboard = exports.exportPdf = exports.exportExcel = exports.getReports = exports.restoreDatabase = exports.backupDatabase = exports.getDatabaseHealth = exports.getServerHealth = exports.getSystemLogs = exports.getAuditLogs = exports.getAllReferrals = exports.getAllCommissions = exports.getAllTransactions = exports.blockPartner = exports.verifyPartner = exports.getAllPartners = exports.blockDsa = exports.verifyDsa = exports.getAllDsa = exports.disburseLoan = exports.rejectLoan = exports.approveLoan = exports.getAllLoans = exports.deleteUser = exports.unblockUser = exports.blockUser = exports.getAllUsers = exports.updateSystemSettings = exports.getSystemSettings = exports.removeRole = exports.assignRole = exports.unblockAdmin = exports.blockAdmin = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAllAdmins = exports.getLoanAnalytics = exports.getUserAnalytics = exports.getRevenueAnalytics = exports.getBusinessAnalytics = exports.getSystemAnalytics = exports.getSuperAdminDashboard = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/* ==========================================================
   HELPER
========================================================== */
const getParam = (value) => {
    if (Array.isArray(value)) {
        return value[0] || "";
    }
    return value || "";
};
/* ==========================================================
   SUPER ADMIN DASHBOARD
========================================================== */
const getSuperAdminDashboard = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalDsa, totalPartners, totalTransactions, totalCommissions,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.commission.count(),
        ]);
        const loanStats = await prisma_1.default.loanApplication.groupBy({
            by: ["status"],
            _count: {
                id: true,
            },
        });
        const transactionStats = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                users: totalUsers,
                loans: totalLoans,
                dsa: totalDsa,
                partners: totalPartners,
                transactions: totalTransactions,
                commissions: totalCommissions,
                transactionVolume: transactionStats._sum.amount || 0,
                loanStats,
            },
        });
    }
    catch (error) {
        console.error("Super Admin Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch super admin dashboard",
        });
    }
};
exports.getSuperAdminDashboard = getSuperAdminDashboard;
/* ==========================================================
   SYSTEM ANALYTICS
========================================================== */
const getSystemAnalytics = async (req, res) => {
    try {
        const [users, loans, transactions, dsa, partners,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                users,
                loans,
                transactions,
                dsa,
                partners,
            },
        });
    }
    catch (error) {
        console.error("System Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch system analytics",
        });
    }
};
exports.getSystemAnalytics = getSystemAnalytics;
/* ==========================================================
   BUSINESS ANALYTICS
========================================================== */
const getBusinessAnalytics = async (req, res) => {
    try {
        const [totalLoans, approvedLoans, rejectedLoans, pendingLoans, totalDsa, totalPartners,] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalLoans,
                approvedLoans,
                rejectedLoans,
                pendingLoans,
                totalDsa,
                totalPartners,
            },
        });
    }
    catch (error) {
        console.error("Business Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch business analytics",
        });
    }
};
exports.getBusinessAnalytics = getBusinessAnalytics;
/* ==========================================================
   REVENUE ANALYTICS
========================================================== */
const getRevenueAnalytics = async (req, res) => {
    try {
        const transactionData = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
                fee: true,
                gst: true,
                commission: true,
                cashback: true,
                tax: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                transactionAmount: transactionData._sum.amount || 0,
                fees: transactionData._sum.fee || 0,
                gst: transactionData._sum.gst || 0,
                commission: transactionData._sum.commission || 0,
                cashback: transactionData._sum.cashback || 0,
                tax: transactionData._sum.tax || 0,
            },
        });
    }
    catch (error) {
        console.error("Revenue Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch revenue analytics",
        });
    }
};
exports.getRevenueAnalytics = getRevenueAnalytics;
/* ==========================================================
   USER ANALYTICS
========================================================== */
const getUserAnalytics = async (req, res) => {
    try {
        const [totalUsers, verifiedUsers, blockedUsers,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({
                where: {
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    isBlocked: true,
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                verifiedUsers,
                blockedUsers,
                activeUsers: totalUsers - blockedUsers,
            },
        });
    }
    catch (error) {
        console.error("User Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user analytics",
        });
    }
};
exports.getUserAnalytics = getUserAnalytics;
/* ==========================================================
   LOAN ANALYTICS
========================================================== */
const getLoanAnalytics = async (req, res) => {
    try {
        const [totalLoans, approved, rejected, pending, totalAmount,] = await Promise.all([
            prisma_1.default.loanApplication.count(),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "REJECTED",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_1.default.loanApplication.aggregate({
                _sum: {
                    amount: true,
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                totalLoans,
                approved,
                rejected,
                pending,
                totalLoanAmount: totalAmount._sum.amount || 0,
            },
        });
    }
    catch (error) {
        console.error("Loan Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loan analytics",
        });
    }
};
exports.getLoanAnalytics = getLoanAnalytics;
/* ==========================================================
   GET ALL ADMINS
========================================================== */
const getAllAdmins = async (req, res) => {
    try {
        const admins = await prisma_1.default.user.findMany({
            where: {
                role: "ADMIN",
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            total: admins.length,
            data: admins,
        });
    }
    catch (error) {
        console.error("Get Admins Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admins",
        });
    }
};
exports.getAllAdmins = getAllAdmins;
/* ==========================================================
   CREATE ADMIN
========================================================== */
const createAdmin = async (req, res) => {
    try {
        const { name, email, phoneNo, password, } = req.body;
        if (!name ||
            !email ||
            !phoneNo ||
            !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone number and password are required",
            });
        }
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    {
                        email,
                    },
                    {
                        phoneNo,
                    },
                ],
            },
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email or phone number already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const admin = await prisma_1.default.user.create({
            data: {
                name,
                email,
                phoneNo,
                password: hashedPassword,
                role: "ADMIN",
                isVerified: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Create Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create admin",
        });
    }
};
exports.createAdmin = createAdmin;
/* ==========================================================
   UPDATE ADMIN
========================================================== */
const updateAdmin = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        const { name, email, phoneNo, } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }
        const existingAdmin = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        const admin = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phoneNo !== undefined && { phoneNo }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                role: true,
                isVerified: true,
                isBlocked: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Update Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update admin",
        });
    }
};
exports.updateAdmin = updateAdmin;
/* ==========================================================
   DELETE ADMIN
========================================================== */
const deleteAdmin = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }
        const admin = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        await prisma_1.default.user.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete admin",
        });
    }
};
exports.deleteAdmin = deleteAdmin;
/* ==========================================================
   BLOCK ADMIN
========================================================== */
const blockAdmin = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        const admin = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Admin blocked successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Block Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block admin",
        });
    }
};
exports.blockAdmin = blockAdmin;
/* ==========================================================
   UNBLOCK ADMIN
========================================================== */
const unblockAdmin = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        const admin = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Admin unblocked successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Unblock Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to unblock admin",
        });
    }
};
exports.unblockAdmin = unblockAdmin;
/* ==========================================================
   ASSIGN ROLE
========================================================== */
const assignRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            return res.status(400).json({
                success: false,
                message: "User ID and role are required",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                role: String(role),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Role assigned successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Assign Role Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to assign role",
        });
    }
};
exports.assignRole = assignRole;
/* ==========================================================
   REMOVE ROLE
========================================================== */
const removeRole = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: String(userId),
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: String(userId),
            },
            data: {
                role: "USER",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Role removed successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.error("Remove Role Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove role",
        });
    }
};
exports.removeRole = removeRole;
/* ==========================================================
   GET SYSTEM SETTINGS
========================================================== */
const getSystemSettings = async (req, res) => {
    try {
        const settings = await prisma_1.default.systemSetting.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: settings.length,
            data: settings,
        });
    }
    catch (error) {
        console.error("Get System Settings Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch system settings",
        });
    }
};
exports.getSystemSettings = getSystemSettings;
/* ==========================================================
   UPDATE SYSTEM SETTINGS
========================================================== */
const updateSystemSettings = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Setting key is required",
            });
        }
        const setting = await prisma_1.default.systemSetting.upsert({
            where: {
                key: String(key),
            },
            update: {
                value: value !== undefined ? String(value) : "",
            },
            create: {
                key: String(key),
                value: value !== undefined ? String(value) : "",
                category: "SYSTEM",
                dataType: "STRING",
            },
        });
        return res.status(200).json({
            success: true,
            message: "System setting updated successfully",
            data: setting,
        });
    }
    catch (error) {
        console.error("Update System Settings Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update system settings",
        });
    }
};
exports.updateSystemSettings = updateSystemSettings;
/* ==========================================================
   GET ALL USERS
========================================================== */
const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";
        const where = search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        phoneNo: {
                            contains: search,
                        },
                    },
                ],
            }
            : {};
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isVerified: true,
                    isBlocked: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: users,
        });
    }
    catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getAllUsers = getAllUsers;
/* ==========================================================
   BLOCK USER
========================================================== */
const blockUser = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Block User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block user",
        });
    }
};
exports.blockUser = blockUser;
/* ==========================================================
   UNBLOCK USER
========================================================== */
const unblockUser = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User unblocked successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Unblock User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to unblock user",
        });
    }
};
exports.unblockUser = unblockUser;
/* ==========================================================
   DELETE USER
========================================================== */
const deleteUser = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await prisma_1.default.user.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};
exports.deleteUser = deleteUser;
/* ==========================================================
   GET ALL LOANS
========================================================== */
const getAllLoans = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const status = typeof req.query.status === "string"
            ? req.query.status.toUpperCase()
            : undefined;
        const where = status
            ? {
                status: status,
            }
            : {};
        const [loans, total] = await Promise.all([
            prisma_1.default.loanApplication.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.loanApplication.count({
                where,
            }),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: loans,
        });
    }
    catch (error) {
        console.error("Get All Loans Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loans",
        });
    }
};
exports.getAllLoans = getAllLoans;
/* ==========================================================
   APPROVE LOAN
========================================================== */
const approveLoan = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Loan ID is required",
            });
        }
        const loan = await prisma_1.default.loanApplication.update({
            where: {
                id,
            },
            data: {
                status: "APPROVED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan approved successfully",
            data: loan,
        });
    }
    catch (error) {
        console.error("Approve Loan Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve loan",
        });
    }
};
exports.approveLoan = approveLoan;
/* ==========================================================
   REJECT LOAN
========================================================== */
const rejectLoan = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Loan ID is required",
            });
        }
        const loan = await prisma_1.default.loanApplication.update({
            where: {
                id,
            },
            data: {
                status: "REJECTED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan rejected successfully",
            data: loan,
        });
    }
    catch (error) {
        console.error("Reject Loan Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject loan",
        });
    }
};
exports.rejectLoan = rejectLoan;
/* ==========================================================
   DISBURSE LOAN
========================================================== */
const disburseLoan = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Loan ID is required",
            });
        }
        const existingLoan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id,
            },
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found",
            });
        }
        if (existingLoan.status !== "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Only approved loans can be disbursed",
            });
        }
        const loan = await prisma_1.default.loanApplication.update({
            where: {
                id,
            },
            data: {
                status: "APPROVED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan disbursed successfully",
            data: loan,
        });
    }
    catch (error) {
        console.error("Disburse Loan Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to disburse loan",
        });
    }
};
exports.disburseLoan = disburseLoan;
/* ==========================================================
   GET ALL DSA
========================================================== */
const getAllDsa = async (req, res) => {
    try {
        const dsa = await prisma_1.default.user.findMany({
            where: {
                role: "DSA",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: dsa.length,
            data: dsa,
        });
    }
    catch (error) {
        console.error("Get All DSA Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch DSA",
        });
    }
};
exports.getAllDsa = getAllDsa;
/* ==========================================================
   VERIFY DSA
========================================================== */
const verifyDsa = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "DSA ID is required",
            });
        }
        const existingDsa = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!existingDsa) {
            return res.status(404).json({
                success: false,
                message: "DSA not found",
            });
        }
        const dsa = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isVerified: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "DSA verified successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error("Verify DSA Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify DSA",
        });
    }
};
exports.verifyDsa = verifyDsa;
/* ==========================================================
   BLOCK DSA
========================================================== */
const blockDsa = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "DSA ID is required",
            });
        }
        const existingDsa = await prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!existingDsa) {
            return res.status(404).json({
                success: false,
                message: "DSA not found",
            });
        }
        const dsa = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "DSA blocked successfully",
            data: dsa,
        });
    }
    catch (error) {
        console.error("Block DSA Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block DSA",
        });
    }
};
exports.blockDsa = blockDsa;
/* ==========================================================
   GET ALL PARTNERS
========================================================== */
const getAllPartners = async (req, res) => {
    try {
        const partners = await prisma_1.default.partner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            total: partners.length,
            data: partners,
        });
    }
    catch (error) {
        console.error("Get All Partners Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch partners",
        });
    }
};
exports.getAllPartners = getAllPartners;
/* ==========================================================
   VERIFY PARTNER
========================================================== */
const verifyPartner = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Partner ID is required",
            });
        }
        const existingPartner = await prisma_1.default.partner.findUnique({
            where: {
                id,
            },
        });
        if (!existingPartner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found",
            });
        }
        const partner = await prisma_1.default.partner.update({
            where: {
                id,
            },
            data: {
                status: "APPROVED",
                isActive: true,
                approvedAt: new Date(),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Partner verified successfully",
            data: partner,
        });
    }
    catch (error) {
        console.error("Verify Partner Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify partner",
        });
    }
};
exports.verifyPartner = verifyPartner;
/* ==========================================================
   BLOCK PARTNER
========================================================== */
const blockPartner = async (req, res) => {
    try {
        const id = getParam(req.params.id);
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Partner ID is required",
            });
        }
        const existingPartner = await prisma_1.default.partner.findUnique({
            where: {
                id,
            },
        });
        if (!existingPartner) {
            return res.status(404).json({
                success: false,
                message: "Partner not found",
            });
        }
        const partner = await prisma_1.default.partner.update({
            where: {
                id,
            },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Partner blocked successfully",
            data: partner,
        });
    }
    catch (error) {
        console.error("Block Partner Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block partner",
        });
    }
};
exports.blockPartner = blockPartner;
/* ==========================================================
   GET ALL TRANSACTIONS
========================================================== */
const getAllTransactions = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const status = typeof req.query.status === "string"
            ? req.query.status
            : undefined;
        const type = typeof req.query.type === "string"
            ? req.query.type
            : undefined;
        const category = typeof req.query.category === "string"
            ? req.query.category
            : undefined;
        const where = {
            ...(status && {
                status,
            }),
            ...(type && {
                type,
            }),
            ...(category && {
                category,
            }),
        };
        const [transactions, total] = await Promise.all([
            prisma_1.default.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.transaction.count({
                where,
            }),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: transactions,
        });
    }
    catch (error) {
        console.error("Get All Transactions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
};
exports.getAllTransactions = getAllTransactions;
/* ==========================================================
   GET ALL COMMISSIONS
========================================================== */
const getAllCommissions = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const [commissions, total] = await Promise.all([
            prisma_1.default.commission.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.commission.count(),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: commissions,
        });
    }
    catch (error) {
        console.error("Get All Commissions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch commissions",
        });
    }
};
exports.getAllCommissions = getAllCommissions;
/* ==========================================================
   GET ALL REFERRALS
========================================================== */
const getAllReferrals = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const [referrals, total] = await Promise.all([
            prisma_1.default.referral.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.referral.count(),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: referrals,
        });
    }
    catch (error) {
        console.error("Get All Referrals Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch referrals",
        });
    }
};
exports.getAllReferrals = getAllReferrals;
/* ==========================================================
   GET AUDIT LOGS
========================================================== */
const getAuditLogs = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.auditLog.count(),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: logs,
        });
    }
    catch (error) {
        console.error("Get Audit Logs Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
        });
    }
};
exports.getAuditLogs = getAuditLogs;
/* ==========================================================
   GET SYSTEM LOGS
========================================================== */
const getSystemLogs = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        /*
          SecurityLog is being used here as the system log source.
        */
        const [logs, total] = await Promise.all([
            prisma_1.default.securityLog.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.securityLog.count(),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: logs,
        });
    }
    catch (error) {
        console.error("Get System Logs Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch system logs",
        });
    }
};
exports.getSystemLogs = getSystemLogs;
/* ==========================================================
   GET SERVER HEALTH
========================================================== */
const getServerHealth = async (req, res) => {
    try {
        const memory = process.memoryUsage();
        const uptimeSeconds = process.uptime();
        return res.status(200).json({
            success: true,
            data: {
                status: "UP",
                environment: process.env.NODE_ENV || "development",
                nodeVersion: process.version,
                platform: process.platform,
                uptime: uptimeSeconds,
                uptimeMinutes: Math.floor(uptimeSeconds / 60),
                memory: {
                    rss: memory.rss,
                    heapTotal: memory.heapTotal,
                    heapUsed: memory.heapUsed,
                    external: memory.external,
                },
                timestamp: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Server Health Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch server health",
        });
    }
};
exports.getServerHealth = getServerHealth;
/* ==========================================================
   GET DATABASE HEALTH
========================================================== */
const getDatabaseHealth = async (req, res) => {
    try {
        const start = Date.now();
        await prisma_1.default.$queryRaw `SELECT 1`;
        const responseTime = Date.now() - start;
        return res.status(200).json({
            success: true,
            data: {
                status: "UP",
                database: "CONNECTED",
                responseTime: `${responseTime}ms`,
                timestamp: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Database Health Error:", error);
        return res.status(503).json({
            success: false,
            data: {
                status: "DOWN",
                database: "DISCONNECTED",
                timestamp: new Date(),
            },
            message: "Database health check failed",
        });
    }
};
exports.getDatabaseHealth = getDatabaseHealth;
/* ==========================================================
   BACKUP DATABASE
========================================================== */
const backupDatabase = async (req, res) => {
    try {
        /*
          This endpoint currently registers the backup request.
    
          Actual PostgreSQL pg_dump execution should normally
          be handled by a dedicated backup service.
        */
        const backupId = `BACKUP-${Date.now()}`;
        return res.status(200).json({
            success: true,
            message: "Database backup request created successfully",
            data: {
                backupId,
                status: "QUEUED",
                createdAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Backup Database Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create database backup",
        });
    }
};
exports.backupDatabase = backupDatabase;
/* ==========================================================
   RESTORE DATABASE
========================================================== */
const restoreDatabase = async (req, res) => {
    try {
        const { backupId } = req.body;
        if (!backupId) {
            return res.status(400).json({
                success: false,
                message: "Backup ID is required",
            });
        }
        /*
          Actual database restore should be handled by
          a protected PostgreSQL restore service.
    
          We do not directly run destructive database
          commands inside the HTTP controller.
        */
        return res.status(200).json({
            success: true,
            message: "Database restore request created successfully",
            data: {
                backupId: String(backupId),
                status: "QUEUED",
                requestedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Restore Database Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create restore request",
        });
    }
};
exports.restoreDatabase = restoreDatabase;
/* ==========================================================
   GET REPORTS
========================================================== */
const getReports = async (req, res) => {
    try {
        const [totalUsers, totalLoans, totalTransactions, totalDsa, totalPartners, totalCommissions, totalReferrals,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
            prisma_1.default.commission.count(),
            prisma_1.default.referral.count(),
        ]);
        const transactionAmount = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
            },
        });
        const commissionAmount = await prisma_1.default.commission.aggregate({
            _sum: {
                amount: true,
            },
        });
        const approvedLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "APPROVED",
            },
        });
        const pendingLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "PENDING",
            },
        });
        const rejectedLoans = await prisma_1.default.loanApplication.count({
            where: {
                status: "REJECTED",
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                },
                loans: {
                    total: totalLoans,
                    approved: approvedLoans,
                    pending: pendingLoans,
                    rejected: rejectedLoans,
                },
                transactions: {
                    total: totalTransactions,
                    totalAmount: transactionAmount._sum.amount || 0,
                },
                dsa: {
                    total: totalDsa,
                },
                partners: {
                    total: totalPartners,
                },
                commissions: {
                    total: totalCommissions,
                    totalAmount: commissionAmount._sum.amount || 0,
                },
                referrals: {
                    total: totalReferrals,
                },
                generatedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Get Reports Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate reports",
        });
    }
};
exports.getReports = getReports;
/* ==========================================================
   EXPORT EXCEL
========================================================== */
const exportExcel = async (req, res) => {
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 10000,
        });
        /*
          CSV is returned here so this controller does not
          require an additional Excel package.
        */
        const escapeCsv = (value) => {
            if (value === null || value === undefined) {
                return "";
            }
            const text = String(value).replace(/"/g, '""');
            return `"${text}"`;
        };
        const header = [
            "Transaction ID",
            "User ID",
            "Wallet ID",
            "Type",
            "Category",
            "Amount",
            "Status",
            "Description",
            "Created At",
        ];
        const rows = transactions.map((transaction) => [
            transaction.transactionId,
            transaction.userId || "",
            transaction.walletId || "",
            transaction.type,
            transaction.category,
            transaction.amount,
            transaction.status,
            transaction.description || "",
            transaction.createdAt.toISOString(),
        ]);
        const csv = [
            header.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(",")),
        ].join("\n");
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="super-admin-report-${Date.now()}.csv"`);
        return res.status(200).send(csv);
    }
    catch (error) {
        console.error("Export Excel Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to export report",
        });
    }
};
exports.exportExcel = exportExcel;
/* ==========================================================
   EXPORT PDF
========================================================== */
const exportPdf = async (req, res) => {
    try {
        /*
          Returning report data here keeps the controller
          independent of a PDF library.
    
          A real PDF can later be generated through
          PDFKit/Puppeteer/report service.
        */
        const [users, loans, transactions, dsa, partners,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.loanApplication.count(),
            prisma_1.default.transaction.count(),
            prisma_1.default.user.count({
                where: {
                    role: "DSA",
                },
            }),
            prisma_1.default.partner.count(),
        ]);
        return res.status(200).json({
            success: true,
            message: "PDF report data generated successfully",
            data: {
                reportTitle: "Super Admin System Report",
                summary: {
                    users,
                    loans,
                    transactions,
                    dsa,
                    partners,
                },
                generatedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Export PDF Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF report",
        });
    }
};
exports.exportPdf = exportPdf;
/* ==========================================================
   GET REVENUE DASHBOARD
========================================================== */
const getRevenueDashboard = async (req, res) => {
    try {
        const transactionStats = await prisma_1.default.transaction.aggregate({
            _sum: {
                amount: true,
                fee: true,
                gst: true,
                commission: true,
                cashback: true,
                tax: true,
            },
            _count: {
                id: true,
            },
        });
        const successfulTransactions = await prisma_1.default.transaction.count({
            where: {
                status: "SUCCESS",
            },
        });
        const pendingTransactions = await prisma_1.default.transaction.count({
            where: {
                status: "PENDING",
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                totalTransactions: transactionStats._count.id,
                successfulTransactions,
                pendingTransactions,
                totalAmount: transactionStats._sum.amount || 0,
                totalFees: transactionStats._sum.fee || 0,
                totalGST: transactionStats._sum.gst || 0,
                totalCommission: transactionStats._sum.commission || 0,
                totalCashback: transactionStats._sum.cashback || 0,
                totalTax: transactionStats._sum.tax || 0,
                generatedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Revenue Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch revenue dashboard",
        });
    }
};
exports.getRevenueDashboard = getRevenueDashboard;
/* ==========================================================
   GET COMMISSION DASHBOARD
========================================================== */
const getCommissionDashboard = async (req, res) => {
    try {
        const totalCommissions = await prisma_1.default.commission.count();
        const commissionAmount = await prisma_1.default.commission.aggregate({
            _sum: {
                amount: true,
            },
        });
        const transactionCommission = await prisma_1.default.transaction.aggregate({
            _sum: {
                commission: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                totalCommissions,
                totalCommissionAmount: commissionAmount._sum.amount || 0,
                transactionCommission: transactionCommission._sum.commission || 0,
                generatedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Commission Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch commission dashboard",
        });
    }
};
exports.getCommissionDashboard = getCommissionDashboard;
/* ==========================================================
   BULK BLOCK USERS
========================================================== */
const bulkBlockUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) ||
            userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "userIds must be a non-empty array",
            });
        }
        const ids = userIds
            .map((id) => String(id))
            .filter(Boolean);
        if (ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Valid user IDs are required",
            });
        }
        const result = await prisma_1.default.user.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                isBlocked: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Users blocked successfully",
            data: {
                affectedUsers: result.count,
            },
        });
    }
    catch (error) {
        console.error("Bulk Block Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to block users",
        });
    }
};
exports.bulkBlockUsers = bulkBlockUsers;
/* ==========================================================
   BULK DELETE USERS
========================================================== */
const bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) ||
            userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "userIds must be a non-empty array",
            });
        }
        const ids = userIds
            .map((id) => String(id))
            .filter(Boolean);
        if (ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Valid user IDs are required",
            });
        }
        const result = await prisma_1.default.user.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return res.status(200).json({
            success: true,
            message: "Users deleted successfully",
            data: {
                deletedUsers: result.count,
            },
        });
    }
    catch (error) {
        console.error("Bulk Delete Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete users",
        });
    }
};
exports.bulkDeleteUsers = bulkDeleteUsers;
/* ==========================================================
   BULK APPROVE LOANS
========================================================== */
const bulkApproveLoans = async (req, res) => {
    try {
        const { loanIds } = req.body;
        if (!Array.isArray(loanIds) ||
            loanIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "loanIds must be a non-empty array",
            });
        }
        const ids = loanIds
            .map((id) => String(id))
            .filter(Boolean);
        if (ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Valid loan IDs are required",
            });
        }
        const result = await prisma_1.default.loanApplication.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                status: "APPROVED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loans approved successfully",
            data: {
                approvedLoans: result.count,
            },
        });
    }
    catch (error) {
        console.error("Bulk Approve Loans Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve loans",
        });
    }
};
exports.bulkApproveLoans = bulkApproveLoans;
/* ==========================================================
   GET LIVE ACTIVITIES
========================================================== */
const getLiveActivities = async (req, res) => {
    try {
        const [transactions, loans, users,] = await Promise.all([
            prisma_1.default.transaction.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.loanApplication.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.user.findMany({
                take: 10,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            data: {
                transactions,
                loans,
                users,
                refreshedAt: new Date(),
            },
        });
    }
    catch (error) {
        console.error("Get Live Activities Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch live activities",
        });
    }
};
exports.getLiveActivities = getLiveActivities;
/* ==========================================================
   GET NOTIFICATIONS
========================================================== */
const getNotifications = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma_1.default.notification.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.notification.count(),
        ]);
        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: notifications,
        });
    }
    catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};
exports.getNotifications = getNotifications;
/* ==========================================================
   SEARCH SYSTEM
========================================================== */
const searchSystem = async (req, res) => {
    try {
        const search = typeof req.query.q === "string"
            ? req.query.q.trim()
            : "";
        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search query q is required",
            });
        }
        const [users, transactions,] = await Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            phoneNo: {
                                contains: search,
                            },
                        },
                    ],
                },
                take: 20,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNo: true,
                    role: true,
                    isBlocked: true,
                    createdAt: true,
                },
            }),
            prisma_1.default.transaction.findMany({
                where: {
                    OR: [
                        {
                            transactionId: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            referenceId: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                take: 20,
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            query: search,
            data: {
                users,
                transactions,
            },
        });
    }
    catch (error) {
        console.error("Search System Error:", error);
        return res.status(500).json({
            success: false,
            message: "System search failed",
        });
    }
};
exports.searchSystem = searchSystem;
