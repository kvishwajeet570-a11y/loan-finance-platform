"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarRepository = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
class AadhaarRepository {
    /**
     * FIND AADHAAR BY USER ID
     */
    static async findByUserId(userId) {
        return prisma_1.default.aadhaar.findUnique({
            where: {
                userId,
            },
        });
    }
    /**
     * FIND AADHAAR BY ID
     */
    static async findById(id) {
        return prisma_1.default.aadhaar.findUnique({
            where: {
                id,
            },
        });
    }
    /**
     * CREATE AADHAAR RECORD
     */
    static async create(data) {
        return prisma_1.default.aadhaar.create({
            data: {
                userId: data.userId,
                maskedAadhaar: data.maskedAadhaar,
                fullName: data.fullName,
                dob: data.dob,
                status: data.status ?? "PENDING",
            },
        });
    }
    /**
     * UPDATE AADHAAR DETAILS
     */
    static async update(userId, data) {
        return prisma_1.default.aadhaar.update({
            where: {
                userId,
            },
            data,
        });
    }
    /**
     * UPDATE STATUS
     */
    static async updateStatus(id, status) {
        return prisma_1.default.aadhaar.update({
            where: {
                id,
            },
            data: {
                status,
                rejectionReason: null,
            },
        });
    }
    /**
     * REJECT AADHAAR
     */
    static async reject(id, reason) {
        return prisma_1.default.aadhaar.update({
            where: {
                id,
            },
            data: {
                status: "REJECTED",
                rejectionReason: reason,
            },
        });
    }
    /**
     * GET ALL AADHAAR RECORDS
     */
    static async findAll() {
        return prisma_1.default.aadhaar.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * DELETE AADHAAR BY USER ID
     */
    static async deleteByUserId(userId) {
        return prisma_1.default.aadhaar.delete({
            where: {
                userId,
            },
        });
    }
}
exports.AadhaarRepository = AadhaarRepository;
