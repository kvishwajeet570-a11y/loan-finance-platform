import { prisma } from "../../prisma";

export class RestoreService {

  /* =========================
      USER RESTORE
  ========================= */

  static async restoreUser(
    userId: string
  ) {

    return prisma.user.update({

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

  static async restoreLoan(
    loanId: string
  ) {

    return prisma.loanApplication.update({

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

  static async restoreDocument(
    documentId: string
  ) {

    return prisma.document.update({

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

  static async restorePartner(
    partnerId: string
  ) {

    return prisma.partnerProfile.update({

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

  static async restoreDsa(
    dsaId: string
  ) {

    return prisma.dsaProfile.update({

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

  static async restoreBank(
    bankId: string
  ) {

    return prisma.bankAccount.update({

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

  static async restoreUpload(
    uploadId: string
  ) {

    return prisma.upload.update({

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

  static async restoreEntity(
    model: any,
    id: string
  ) {

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