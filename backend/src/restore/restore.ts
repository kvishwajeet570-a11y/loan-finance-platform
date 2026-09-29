import prisma from "../prisma/prisma";

export class RestoreService {
  /* =========================
     USER RESTORE
  ========================= */

  static async restoreUser(
    userId: string
  ) {
    return prisma.user.update({
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

  static async restoreUpload(
    uploadId: string
  ) {
    return prisma.upload.update({
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

  static async isUserRestorable(
    userId: string
  ) {
    const user =
      await prisma.user.findUnique({
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

    return (
      user.isDeleted === true ||
      user.deletedAt !== null
    );
  }

  /* =========================
     CHECK UPLOAD RESTORABLE
  ========================= */

  static async isUploadRestorable(
    uploadId: string
  ) {
    const upload =
      await prisma.upload.findUnique({
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

    return (
      upload.isDeleted === true ||
      upload.deletedAt !== null
    );
  }

  /* =========================
     GET DELETED USERS
  ========================= */

  static async getDeletedUsers() {
    return prisma.user.findMany({
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
    return prisma.upload.findMany({
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

  static async restoreEntity(
    model: {
      update: (args: {
        where: {
          id: string;
        };
        data: {
          deletedAt: null;
          isDeleted: boolean;
        };
      }) => Promise<unknown>;
    },
    id: string
  ) {
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