"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class CustomerService {
    /**
     * Create Customer
     */
    async createCustomer(data) {
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { phoneNo: data.phoneNo },
                ],
            },
        });
        if (existingUser) {
            throw new Error("Customer already exists");
        }
        return prisma_1.default.user.create({
            data: {
                ...data,
                role: "customer",
            },
        });
    }
    /**
     * Customer Profile
     */
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
    /**
     * Update Customer
     */
    async updateCustomer(customerId, data) {
        return prisma_1.default.user.update({
            where: {
                id: customerId,
            },
            data,
        });
    }
    /**
     * Customer List
     */
    async getCustomers(filters) {
        const { page = 1, limit = 20, search, status, isVerified, } = filters;
        const skip = (page - 1) * limit;
        const where = {
            role: "customer",
        };
        if (search) {
            where.OR = [
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
            ];
        }
        if (typeof isVerified === "boolean") {
            where.isVerified = isVerified;
        }
        if (status === "blocked") {
            where.isBlocked = true;
        }
        const [customers, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.default.user.count({
                where,
            }),
        ]);
        return {
            customers,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    }
    /**
     * Block Customer
     */
    async blockCustomer(customerId) {
        return prisma_1.default.user.update({
            where: {
                id: customerId,
            },
            data: {
                isBlocked: true,
            },
        });
    }
    /**
     * Unblock Customer
     */
    async unblockCustomer(customerId) {
        return prisma_1.default.user.update({
            where: {
                id: customerId,
            },
            data: {
                isBlocked: false,
            },
        });
    }
    /**
     * Customer Loan History
     */
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
    /**
     * Customer Dashboard
     */
    async getCustomerDashboard(customerId) {
        const [totalLoans, approvedLoans, pendingLoans, rejectedLoans,] = await Promise.all([
            prisma_1.default.loanApplication.count({
                where: {
                    userId: customerId,
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId: customerId,
                    status: "approved",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId: customerId,
                    status: "pending",
                },
            }),
            prisma_1.default.loanApplication.count({
                where: {
                    userId: customerId,
                    status: "rejected",
                },
            }),
        ]);
        return {
            totalLoans,
            approvedLoans,
            pendingLoans,
            rejectedLoans,
        };
    }
    /**
     * Customer Analytics
     */
    async getCustomerStats() {
        const [totalCustomers, verifiedCustomers, blockedCustomers, activeCustomers,] = await Promise.all([
            prisma_1.default.user.count({
                where: {
                    role: "customer",
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "customer",
                    isVerified: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "customer",
                    isBlocked: true,
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: "customer",
                    isBlocked: false,
                },
            }),
        ]);
        return {
            totalCustomers,
            verifiedCustomers,
            blockedCustomers,
            activeCustomers,
        };
    }
    /**
     * Delete Customer
     */
    async deleteCustomer(customerId) {
        return prisma_1.default.user.delete({
            where: {
                id: customerId,
            },
        });
    }
}
exports.default = new CustomerService();
