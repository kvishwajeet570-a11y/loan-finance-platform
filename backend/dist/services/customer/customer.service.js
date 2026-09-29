"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = void 0;
const prisma_1 = __importDefault(require("../../config/database/prisma"));
class CustomerService {
    async createCustomer(data) {
        return prisma_1.default.user.create({
            data,
        });
    }
    async getCustomers(query) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);
        return prisma_1.default.user.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: {
                loans: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getCustomerById(customerId) {
        return prisma_1.default.user.findUnique({
            where: { id: customerId },
            include: {
                loans: true,
            },
        });
    }
    async getCustomerByUserId(userId) {
        return prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                loans: true,
            },
        });
    }
    async updateCustomer(customerId, data) {
        return prisma_1.default.user.update({
            where: { id: customerId },
            data,
        });
    }
    async deleteCustomer(customerId) {
        return prisma_1.default.user.delete({
            where: { id: customerId },
        });
    }
    async blockCustomer(customerId) {
        return prisma_1.default.user.update({
            where: { id: customerId },
            data: {
                isBlocked: true,
            },
        });
    }
    async unblockCustomer(customerId) {
        return prisma_1.default.user.update({
            where: { id: customerId },
            data: {
                isBlocked: false,
            },
        });
    }
    async searchCustomers(search) {
        return prisma_1.default.user.findMany({
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
            include: {
                loans: true,
            },
        });
    }
    async getCustomerLoans(customerId) {
        return prisma_1.default.loanApplication.findMany({
            where: {
                userId: customerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getCustomerTransactions(customerId) {
        return {
            customerId,
            transactions: [],
        };
    }
    async getCustomerDocuments(customerId) {
        return {
            customerId,
            documents: [],
        };
    }
    async getCustomerKyc(customerId) {
        const customer = await prisma_1.default.user.findUnique({
            where: {
                id: customerId,
            },
        });
        return {
            customerId,
            isVerified: customer?.isVerified ?? false,
        };
    }
    async verifyCustomer(customerId) {
        return prisma_1.default.user.update({
            where: {
                id: customerId,
            },
            data: {
                isVerified: true,
            },
        });
    }
    async getActiveCustomers() {
        return prisma_1.default.user.findMany({
            where: {
                isBlocked: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getInactiveCustomers() {
        return prisma_1.default.user.findMany({
            where: {
                isBlocked: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getTopCustomers() {
        return prisma_1.default.user.findMany({
            take: 10,
            include: {
                loans: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getMonthlyCustomers() {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        return prisma_1.default.user.findMany({
            where: {
                createdAt: {
                    gte: currentMonth,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getCustomerProfile(customerId) {
        return prisma_1.default.user.findUnique({
            where: {
                id: customerId,
            },
            include: {
                loans: true,
            },
        });
    }
    async getCustomerDashboard(customerId) {
        const customer = await prisma_1.default.user.findUnique({
            where: {
                id: customerId,
            },
        });
        const totalLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId: customerId,
            },
        });
        const approvedLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId: customerId,
                status: "APPROVED",
            },
        });
        const pendingLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId: customerId,
                status: "PENDING",
            },
        });
        const rejectedLoans = await prisma_1.default.loanApplication.count({
            where: {
                userId: customerId,
                status: "REJECTED",
            },
        });
        return {
            customer,
            totalLoans,
            approvedLoans,
            pendingLoans,
            rejectedLoans,
        };
    }
    async getCustomerAnalytics() {
        const totalCustomers = await prisma_1.default.user.count();
        const activeCustomers = await prisma_1.default.user.count({
            where: {
                isBlocked: false,
            },
        });
        const blockedCustomers = await prisma_1.default.user.count({
            where: {
                isBlocked: true,
            },
        });
        const verifiedCustomers = await prisma_1.default.user.count({
            where: {
                isVerified: true,
            },
        });
        return {
            totalCustomers,
            activeCustomers,
            blockedCustomers,
            verifiedCustomers,
        };
    }
    async exportCustomersExcel() {
        const customers = await prisma_1.default.user.findMany();
        return {
            success: true,
            total: customers.length,
            data: customers,
        };
    }
    async exportCustomersPdf() {
        const customers = await prisma_1.default.user.findMany();
        return {
            success: true,
            total: customers.length,
            data: customers,
        };
    }
}
exports.customerService = new CustomerService();
