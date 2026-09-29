"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
class RestoreService {
    /* =========================
       USER RESTORE
    ========================= */
    static async restoreUser(userId) {
        return prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                deletedAt: null,
                isDeleted: false,
            },
        });
    }
    /* =========================
       UPLOAD / FILE RESTORE
    ========================= */
    static async restoreUpload(uploadId) {
        return prisma_1.default.upload.update({
            where: {
                id: uploadId,
            },
            data: {
                deletedAt: null,
                isDeleted: false,
            },
        });
    }
    /* =========================
       CHECK USER RESTORABLE
    ========================= */
    static async isUserRestorable(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                isDeleted: true,
                deletedAt: true,
            },
        });
        if (!user) {
            return false;
        }
        return (user.isDeleted === true ||
            user.deletedAt !== null);
    }
    /* =========================
       CHECK UPLOAD RESTORABLE
    ========================= */
    static async isUploadRestorable(uploadId) {
        const upload = await prisma_1.default.upload.findUnique({
            where: {
                id: uploadId,
            },
            select: {
                id: true,
                isDeleted: true,
                deletedAt: true,
            },
        });
        if (!upload) {
            return false;
        }
        return (upload.isDeleted === true ||
            upload.deletedAt !== null);
    }
    /* =========================
       GET DELETED USERS
    ========================= */
    static async getDeletedUsers() {
        return prisma_1.default.user.findMany({
            where: {
                OR: [
                    {
                        isDeleted: true,
                    },
                    {
                        deletedAt: {
                            not: null,
                        },
                    },
                ],
            },
            orderBy: {
                deletedAt: "desc",
            },
        });
    }
    /* =========================
       GET DELETED UPLOADS
    ========================= */
    static async getDeletedUploads() {
        return prisma_1.default.upload.findMany({
            where: {
                OR: [
                    {
                        isDeleted: true,
                    },
                    {
                        deletedAt: {
                            not: null,
                        },
                    },
                ],
            },
            orderBy: {
                deletedAt: "desc",
            },
        });
    }
    /* =========================
       GENERIC RESTORE
  
       Use only with Prisma models
       containing:
       - id
       - isDeleted
       - deletedAt
    ========================= */
    static async restoreEntity(model, id) {
        return model.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
                isDeleted: false,
            },
        });
    }
}
exports.RestoreService = RestoreService;
