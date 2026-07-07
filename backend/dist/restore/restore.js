"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestoreService = void 0;
const prisma_1 = require("../../prisma");
class RestoreService {
    /* =========================
        USER RESTORE
    ========================= */
    static async restoreUser(userId) {
        return prisma_1.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        LOAN RESTORE
    ========================= */
    static async restoreLoan(loanId) {
        return prisma_1.prisma.loanApplication.update({
            where: {
                id: loanId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        DOCUMENT RESTORE
    ========================= */
    static async restoreDocument(documentId) {
        return prisma_1.prisma.document.update({
            where: {
                id: documentId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        PARTNER RESTORE
    ========================= */
    static async restorePartner(partnerId) {
        return prisma_1.prisma.partnerProfile.update({
            where: {
                id: partnerId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        DSA RESTORE
    ========================= */
    static async restoreDsa(dsaId) {
        return prisma_1.prisma.dsaProfile.update({
            where: {
                id: dsaId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        BANK RESTORE
    ========================= */
    static async restoreBank(bankId) {
        return prisma_1.prisma.bankAccount.update({
            where: {
                id: bankId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        FILE RESTORE
    ========================= */
    static async restoreUpload(uploadId) {
        return prisma_1.prisma.upload.update({
            where: {
                id: uploadId
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
    /* =========================
        GENERIC RESTORE
    ========================= */
    static async restoreEntity(model, id) {
        return model.update({
            where: {
                id
            },
            data: {
                deletedAt: null,
                isDeleted: false
            }
        });
    }
}
exports.RestoreService = RestoreService;
