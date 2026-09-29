import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

/* ===========================================================
   CREATE UPLOAD
=========================================================== */

export const createUpload = async (
  data: Prisma.UploadCreateInput
) => {
  return prisma.upload.create({
    data,
  });
};

/* ===========================================================
   UPDATE UPLOAD
=========================================================== */

export const updateUpload = async (
  id: string,
  data: Prisma.UploadUpdateInput
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data,
  });
};

/* ===========================================================
   GET UPLOAD BY ID
=========================================================== */

export const getUploadById = async (
  id: string
) => {
  return prisma.upload.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
};

/* ===========================================================
   GET ALL UPLOADS
=========================================================== */

export const getAllUploads = async (
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  return prisma.upload.findMany({
    skip,
    take: limit,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET USER UPLOADS
=========================================================== */

export const getUserUploads = async (
  userId: string
) => {
  return prisma.upload.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET CUSTOMER UPLOADS
=========================================================== */

export const getCustomerUploads = async (
  customerId: string
) => {
  return prisma.upload.findMany({
    where: {
      customerId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET DSA UPLOADS
=========================================================== */

export const getDsaUploads = async (
  dsaId: string
) => {
  return prisma.upload.findMany({
    where: {
      dsaId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET PARTNER UPLOADS
=========================================================== */

export const getPartnerUploads = async (
  partnerId: string
) => {
  return prisma.upload.findMany({
    where: {
      partnerId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
/* ===========================================================
   APPROVE UPLOAD
=========================================================== */

export const approveUpload = async (
  id: string,
  approvedBy?: string
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      status: "APPROVED",
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    },
  });
};

/* ===========================================================
   REJECT UPLOAD
=========================================================== */

export const rejectUpload = async (
  id: string,
  rejectedBy?: string,
  rejectReason?: string
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
      rejectedBy,
      rejectedAt: new Date(),
      rejectReason,
    },
  });
};

/* ===========================================================
   VERIFY UPLOAD
=========================================================== */

export const verifyUpload = async (
  id: string,
  verifiedBy?: string
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      isVerified: true,
      verifiedBy,
      verifiedAt: new Date(),
    },
  });
};

/* ===========================================================
   DELETE UPLOAD (SOFT DELETE)
=========================================================== */

export const deleteUpload = async (
  id: string
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      status: "DELETED",
    },
  });
};

/* ===========================================================
   RESTORE UPLOAD
=========================================================== */

export const restoreUpload = async (
  id: string
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
      deletedAt: null,
      status: "ACTIVE",
    },
  });
};

/* ===========================================================
   GET PENDING UPLOADS
=========================================================== */

export const getPendingUploads = async () => {
  return prisma.upload.findMany({
    where: {
      status: "PENDING",
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET APPROVED UPLOADS
=========================================================== */

export const getApprovedUploads = async () => {
  return prisma.upload.findMany({
    where: {
      status: "APPROVED",
      isDeleted: false,
    },
    orderBy: {
      approvedAt: "desc",
    },
  });
};

/* ===========================================================
   GET REJECTED UPLOADS
=========================================================== */

export const getRejectedUploads = async () => {
  return prisma.upload.findMany({
    where: {
      status: "REJECTED",
      isDeleted: false,
    },
    orderBy: {
      rejectedAt: "desc",
    },
  });
};

/* ===========================================================
   GET EXPIRED UPLOADS
=========================================================== */

export const getExpiredUploads = async () => {
  return prisma.upload.findMany({
    where: {
      isExpired: true,
      isDeleted: false,
    },
    orderBy: {
      expiryDate: "asc",
    },
  });
};

/* ===========================================================
   SEARCH UPLOADS
=========================================================== */

export const searchUploads = async (
  search: string,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  return prisma.upload.findMany({
    where: {
      isDeleted: false,
      OR: [
        {
          fileName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          originalName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          documentType: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET RECENT UPLOADS
=========================================================== */

export const getRecentUploads = async (
  limit = 10
) => {
  return prisma.upload.findMany({
    where: {
      isDeleted: false,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ===========================================================
   GET LARGE FILES
=========================================================== */

export const getLargeFiles = async (
  minSize = 5 * 1024 * 1024
) => {
  return prisma.upload.findMany({
    where: {
      isDeleted: false,
      fileSize: {
        gte: minSize,
      },
    },
    orderBy: {
      fileSize: "desc",
    },
  });
};

/* ===========================================================
   UPLOAD DASHBOARD
=========================================================== */

export const getUploadDashboard = async () => {
  const [
    total,
    pending,
    approved,
    rejected,
    deleted,
    expired,
  ] = await Promise.all([
    prisma.upload.count(),
    prisma.upload.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.upload.count({
      where: {
        status: "APPROVED",
      },
    }),
    prisma.upload.count({
      where: {
        status: "REJECTED",
      },
    }),
    prisma.upload.count({
      where: {
        isDeleted: true,
      },
    }),
    prisma.upload.count({
      where: {
        isExpired: true,
      },
    }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    deleted,
    expired,
  };
};

/* ===========================================================
   UPLOAD ANALYTICS
=========================================================== */

export const getUploadAnalytics = async () => {
  const uploads = await prisma.upload.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      category: true,
      fileSize: true,
    },
  });

  const totalFiles = uploads.length;

  const totalStorage = uploads.reduce(
    (sum, item) => sum + (item.fileSize || 0),
    0
  );

  const categoryStats = uploads.reduce(
    (acc: Record<string, number>, item) => {
      const key = item.category || "OTHER";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalFiles,
    totalStorage,
    categoryStats,
  };
};

/* ===========================================================
   STORAGE ANALYTICS
=========================================================== */

export const getStorageAnalytics = async () => {
  const uploads = await prisma.upload.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      fileSize: true,
    },
  });

  const totalFiles = uploads.length;

  const totalStorage = uploads.reduce(
    (sum, item) => sum + (item.fileSize || 0),
    0
  );

  return {
    totalFiles,
    totalStorage,
    averageSize:
      totalFiles === 0
        ? 0
        : Math.round(totalStorage / totalFiles),
  };
};

/* ===========================================================
   FILE TYPE ANALYTICS
=========================================================== */

export const getFileTypeAnalytics = async () => {
  const uploads = await prisma.upload.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      extension: true,
    },
  });

  return uploads.reduce(
    (acc: Record<string, number>, item) => {
      const key = item.extension || "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );
};
/* ===========================================================
   BULK APPROVE UPLOADS
=========================================================== */

export const bulkApproveUploads = async (
  ids: string[],
  approvedBy?: string
) => {
  return prisma.upload.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: "APPROVED",
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    },
  });
};

/* ===========================================================
   BULK REJECT UPLOADS
=========================================================== */

export const bulkRejectUploads = async (
  ids: string[],
  rejectedBy?: string,
  rejectReason?: string
) => {
  return prisma.upload.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: "REJECTED",
      rejectedBy,
      rejectedAt: new Date(),
      rejectReason,
    },
  });
};

/* ===========================================================
   BULK DELETE UPLOADS
=========================================================== */

export const bulkDeleteUploads = async (
  ids: string[]
) => {
  return prisma.upload.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: "DELETED",
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

/* ===========================================================
   GET UPLOAD AUDIT LOGS
=========================================================== */

export const getUploadAuditLogs = async (
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  return prisma.upload.findMany({
    skip,
    take: limit,
    select: {
      id: true,
      fileName: true,
      originalName: true,
      status: true,
      uploadedBy: true,
      uploadedIp: true,
      deviceInfo: true,
      platform: true,
      approvedBy: true,
      approvedAt: true,
      rejectedBy: true,
      rejectedAt: true,
      rejectReason: true,
      verifiedBy: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

/* ===========================================================
   COUNT UPLOADS
=========================================================== */

export const countUploads = async () => {
  return prisma.upload.count();
};

/* ===========================================================
   COUNT ACTIVE UPLOADS
=========================================================== */

export const countActiveUploads = async () => {
  return prisma.upload.count({
    where: {
      isDeleted: false,
    },
  });
};

/* ===========================================================
   FIND UPLOAD BY FILE NAME
=========================================================== */

export const findUploadByFileName = async (
  fileName: string
) => {
  return prisma.upload.findFirst({
    where: {
      fileName,
    },
  });
};

/* ===========================================================
   CHECK UPLOAD EXISTS
=========================================================== */

export const uploadExists = async (
  id: string
) => {
  const count = await prisma.upload.count({
    where: {
      id,
    },
  });

  return count > 0;
};
