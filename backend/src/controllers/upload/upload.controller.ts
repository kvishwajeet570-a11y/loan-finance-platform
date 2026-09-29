import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import prisma from "../../prisma/prisma";

/**
 * ===========================================
 * Helpers
 * ===========================================
 */

const ensureUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

ensureUploadDir(UPLOAD_DIR);

const generateFileName = (originalName: string) => {
  const ext = path.extname(originalName);
  const name = Date.now() + "-" + Math.random().toString(36).substring(2, 8);

  return `${name}${ext}`;
};

const success = (
  res: Response,
  message: string,
  data?: any,
  status = 200
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const failure = (
  res: Response,
  error: any,
  status = 500
) => {
  return res.status(status).json({
    success: false,
    message: error instanceof Error ? error.message : String(error),
  });
};
/**
 * ===========================================
 * Common Upload Helpers
 * ===========================================
 */

const saveUploadRecord = async ({
  fileName,
  originalName,
  fileUrl,
  fileType,
  fileSize,
  category,
  uploadedBy,
  userId,
  loanApplicationId,
}: {
  fileName: string;
  originalName?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  category?: string;
  uploadedBy?: string;
  userId?: string;
  loanApplicationId?: string;
}) => {
  return prisma.upload.create({
    data: {
      fileName,
      originalName,
      fileUrl,
      fileType,
      fileSize,
      category,
      uploadedBy,
      userId,
      loanApplicationId,
    },
  });
};

const getFileExtension = (fileName: string) => {
  return path.extname(fileName).replace(".", "").toLowerCase();
};

const isImage = (fileName: string) => {
  const ext = getFileExtension(fileName);

  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
  ].includes(ext);
};

const isPdf = (fileName: string) => {
  return getFileExtension(fileName) === "pdf";
};

const removeFileIfExists = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const createUploadResponse = (upload: any) => ({
  id: upload.id,
  fileName: upload.fileName,
  originalName: upload.originalName,
  fileUrl: upload.fileUrl,
  fileType: upload.fileType,
  fileSize: upload.fileSize,
  category: upload.category,
  uploadedBy: upload.uploadedBy,
  userId: upload.userId,
  createdAt: upload.createdAt,
});
/**
 * ===========================================
 * Upload Single File
 * ===========================================
 */

export const uploadSingleFile = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return failure(res, "No file uploaded", 400);
    }

    const upload = await saveUploadRecord({
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      category: req.body.category,
      uploadedBy: req.body.uploadedBy,
      userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
    });

    return success(
      res,
      "File uploaded successfully",
      createUploadResponse(upload),
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * Upload Multiple Files
 * ===========================================
 */

export const uploadMultipleFiles = async (
  req: Request,
  res: Response
) => {
  try {
    const files = (req as any).files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return failure(res, "No files uploaded", 400);
    }

    const uploads = [];

    for (const file of files) {
      const upload = await saveUploadRecord({
        fileName: file.filename,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        category: req.body.category,
        uploadedBy: req.body.uploadedBy,
        userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
      });

      uploads.push(createUploadResponse(upload));
    }

    return success(
      res,
      `${uploads.length} file(s) uploaded successfully`,
      uploads,
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * Upload Profile Image
 * ===========================================
 */

export const uploadProfileImage = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return failure(res, "Profile image is required", 400);
    }

    if (!isImage(file.originalname)) {
      removeFileIfExists(file.path);
      return failure(res, "Only image files are allowed", 400);
    }

    const upload = await saveUploadRecord({
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      category: "PROFILE",
      uploadedBy: req.body.uploadedBy,
      userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
    });

    return success(
      res,
      "Profile image uploaded successfully",
      createUploadResponse(upload),
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};
/**
 * ===========================================
 * Upload KYC Document
 * ===========================================
 */

export const uploadKycDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return failure(res, "KYC document is required", 400);
    }

    const upload = await saveUploadRecord({
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      category: "KYC",
      uploadedBy: req.body.uploadedBy,
      userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
    });

    return success(
      res,
      "KYC document uploaded successfully",
      createUploadResponse(upload),
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * Upload Loan Document
 * ===========================================
 */

export const uploadLoanDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return failure(res, "Loan document is required", 400);
    }

    const upload = await saveUploadRecord({
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      category: "LOAN",
      uploadedBy: req.body.uploadedBy,
      userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
    });

    return success(
      res,
      "Loan document uploaded successfully",
      createUploadResponse(upload),
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * Upload Bank Document
 * ===========================================
 */

export const uploadBankDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return failure(res, "Bank document is required", 400);
    }

    const upload = await saveUploadRecord({
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      category: "BANK",
      uploadedBy: req.body.uploadedBy,
      userId: req.body.userId,
      loanApplicationId: req.body.loanApplicationId,
    });

    return success(
      res,
      "Bank document uploaded successfully",
      createUploadResponse(upload),
      201
    );
  } catch (error) {
    return failure(res, error);
  }
};
/**
 * ===========================================
 * PAN CARD
 * ===========================================
 */

export const uploadPanCard = async (
  req: Request,
  res: Response
) => {
  req.body.category = "PAN";
  return uploadKycDocument(req, res);
};

/**
 * ===========================================
 * AADHAAR CARD
 * ===========================================
 */

export const uploadAadhaarCard = async (
  req: Request,
  res: Response
) => {
  req.body.category = "AADHAAR";
  return uploadKycDocument(req, res);
};

/**
 * ===========================================
 * PASSPORT
 * ===========================================
 */

export const uploadPassport = async (
  req: Request,
  res: Response
) => {
  req.body.category = "PASSPORT";
  return uploadKycDocument(req, res);
};

/**
 * ===========================================
 * DRIVING LICENSE
 * ===========================================
 */

export const uploadDrivingLicense = async (
  req: Request,
  res: Response
) => {
  req.body.category = "DRIVING_LICENSE";
  return uploadKycDocument(req, res);
};

/**
 * ===========================================
 * AGREEMENT
 * ===========================================
 */

export const uploadAgreement = async (
  req: Request,
  res: Response
) => {
  req.body.category = "AGREEMENT";
  return uploadLoanDocument(req, res);
};

/**
 * ===========================================
 * INSURANCE DOCUMENT
 * ===========================================
 */

export const uploadInsuranceDocument = async (
  req: Request,
  res: Response
) => {
  req.body.category = "INSURANCE";
  return uploadLoanDocument(req, res);
};
/**
 * ===========================================
 * GET ALL UPLOADS
 * ===========================================
 */

export const getAllUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(res, "Uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET UPLOAD BY ID
 * ===========================================
 */

export const getUploadById = async (
  req: Request,
  res: Response
) => {
  try {
    const upload = await prisma.upload.findUnique({
      where: {
        id: String(req.params.id)
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    return success(res, "Upload fetched successfully", upload);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET USER UPLOADS
 * ===========================================
 */

export const getUserUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        userId: String(req.params.userId)
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(res, "User uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET CUSTOMER UPLOADS
 * ===========================================
 */

export const getCustomerUploads = async (
  req: Request,
  res: Response
) => {
  return getUserUploads(req, res);
};

/**
 * ===========================================
 * GET DSA UPLOADS
 * ===========================================
 */

export const getDsaUploads = async (
  req: Request,
  res: Response
) => {
  return getUserUploads(req, res);
};

/**
 * ===========================================
 * GET PARTNER UPLOADS
 * ===========================================
 */

export const getPartnerUploads = async (
  req: Request,
  res: Response
) => {
  return getUserUploads(req, res);
};
/**
 * ===========================================
 * VERIFY DOCUMENT
 * ===========================================
 */

export const verifyUploadedDocument = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { verifiedBy } = req.body;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const updated = await prisma.upload.update({
      where: {
        id: id!,
      },
      data: {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date(),
      },
    });

    return success(
      res,
      "Document verified successfully",
      updated
    );
  } catch (error) {
    return failure(res, error);
  }
};
/**
 * ===========================================
 * APPROVE DOCUMENT
 * ===========================================
 */

export const approveUpload = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { approvedBy } = req.body;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const updated = await prisma.upload.update({
      where: {
        id: id!,
      },
      data: {
        status: "APPROVED",
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
      },
    });

    return success(
      res,
      "Upload approved successfully",
      updated
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * REJECT DOCUMENT
 * ===========================================
 */

export const rejectUpload = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const {
      rejectedBy,
      rejectReason,
    } = req.body;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const updated = await prisma.upload.update({
      where: {
        id: id!,
      },
      data: {
        status: "REJECTED",
        rejectedBy,
        rejectedAt: new Date(),
        rejectReason,
      },
    });

    return success(
      res,
      "Upload rejected successfully",
      updated
    );
  } catch (error) {
    return failure(res, error);
  }
};
/**
 * ===========================================
 * REJECT VERIFIED DOCUMENT
 * (Alias for compatibility)
 * ===========================================
 */

export const rejectUploadedDocument = rejectUpload;

/**
 * ===========================================
 * DOWNLOAD FILE
 * ===========================================
 */

export const downloadFile = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const filePath =
      upload.filePath ||
      path.join(UPLOAD_DIR, upload.fileName);

    if (!fs.existsSync(filePath)) {
      return failure(res, "File not found", 404);
    }

    return res.download(
      filePath,
      upload.originalName || upload.fileName
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * PREVIEW FILE
 * ===========================================
 */

export const previewFile = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const filePath =
      upload.filePath ||
      path.join(UPLOAD_DIR, upload.fileName);

    if (!fs.existsSync(filePath)) {
      return failure(res, "File not found", 404);
    }

    if (upload.mimeType) {
      res.setHeader(
        "Content-Type",
        upload.mimeType
      );
    }

    return res.sendFile(filePath);
  } catch (error) {
    return failure(res, error);
  }
};
/**
 * ===========================================
 * DELETE FILE (SOFT DELETE)
 * ===========================================
 */

export const deleteFile = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const updated = await prisma.upload.update({
      where: {
        id: id!,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "DELETED",
      },
    });

    return success(
      res,
      "File deleted successfully",
      updated
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * RESTORE FILE
 * ===========================================
 */

export const restoreFile = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    const updated = await prisma.upload.update({
      where: {
        id: id!,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
        status: "ACTIVE",
      },
    });

    return success(
      res,
      "File restored successfully",
      updated
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET PENDING UPLOADS
 * ===========================================
 */

export const getPendingUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        status: "PENDING",
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(res, "Pending uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET APPROVED UPLOADS
 * ===========================================
 */

export const getApprovedUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        status: "APPROVED",
        isDeleted: false,
      },
      orderBy: {
        approvedAt: "desc",
      },
    });

    return success(res, "Approved uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

export const getRejectedUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        status: "REJECTED",
        isDeleted: false,
      },
      orderBy: {
        rejectedAt: "desc",
      },
    });

    return success(res, "Rejected uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET EXPIRED UPLOADS
 * ===========================================
 */

export const getExpiredUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        isExpired: true,
        isDeleted: false,
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    return success(res, "Expired uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET RECENT UPLOADS
 * ===========================================
 */

export const getRecentUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const uploads = await prisma.upload.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return success(res, "Recent uploads fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GET LARGE FILES
 * ===========================================
 */

export const getLargeFiles = async (
  req: Request,
  res: Response
) => {
  try {
    const minSize =
      Number(req.query.minSize) || 5 * 1024 * 1024;

    const uploads = await prisma.upload.findMany({
      where: {
        fileSize: {
          gte: minSize,
        },
        isDeleted: false,
      },
      orderBy: {
        fileSize: "desc",
      },
    });

    return success(res, "Large files fetched successfully", uploads);
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * UPLOAD DASHBOARD
 * ===========================================
 */

export const getUploadDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const [
      total,
      pending,
      approved,
      rejected,
      deleted,
      expired,
    ] = await Promise.all([
      prisma.upload.count(),
      prisma.upload.count({ where: { status: "PENDING" } }),
      prisma.upload.count({ where: { status: "APPROVED" } }),
      prisma.upload.count({ where: { status: "REJECTED" } }),
      prisma.upload.count({ where: { isDeleted: true } }),
      prisma.upload.count({ where: { isExpired: true } }),
    ]);

    return success(res, "Dashboard fetched successfully", {
      total,
      pending,
      approved,
      rejected,
      deleted,
      expired,
    });
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * UPLOAD ANALYTICS
 * ===========================================
 */

export const getUploadAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
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

    const byCategory = uploads.reduce((acc: any, item) => {
      const key = item.category || "OTHER";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return success(res, "Analytics fetched successfully", {
      totalFiles,
      totalStorage,
      byCategory,
    });
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * STORAGE ANALYTICS
 * ===========================================
 */

export const getStorageAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
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

    const averageSize =
      totalFiles === 0
        ? 0
        : Math.round(totalStorage / totalFiles);

    return success(res, "Storage analytics fetched successfully", {
      totalFiles,
      totalStorage,
      averageSize,
    });
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * FILE TYPE ANALYTICS
 * ===========================================
 */

export const getFileTypeAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        extension: true,
      },
    });

    const analytics = uploads.reduce((acc: any, item) => {
      const ext = item.extension || "unknown";
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {});

    return success(
      res,
      "File type analytics fetched successfully",
      analytics
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * SEARCH UPLOADS
 * ===========================================
 */

export const searchUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const q = String(req.query.q || "");

    const uploads = await prisma.upload.findMany({
      where: {
        OR: [
          {
            fileName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            originalName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            documentType: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(
      res,
      "Search completed successfully",
      uploads
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * EXPORT UPLOADS (EXCEL)
 * ===========================================
 */
export const exportUploadsExcel = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(
      res,
      "Excel export data fetched successfully",
      uploads
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * EXPORT UPLOADS (PDF)
 * ===========================================
 */
export const exportUploadsPdf = async (
  req: Request,
  res: Response
) => {
  try {
    const uploads = await prisma.upload.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return success(
      res,
      "PDF export data fetched successfully",
      uploads
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * BULK APPROVE
 * ===========================================
 */
export const bulkApproveUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids, approvedBy } = req.body;

    const result = await prisma.upload.updateMany({
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

    return success(
      res,
      "Uploads approved successfully",
      result
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * BULK REJECT
 * ===========================================
 */
export const bulkRejectUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      ids,
      rejectedBy,
      rejectReason,
    } = req.body;

    const result = await prisma.upload.updateMany({
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

    return success(
      res,
      "Uploads rejected successfully",
      result
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * BULK DELETE
 * ===========================================
 */
export const bulkDeleteUploads = async (
  req: Request,
  res: Response
) => {
  try {
    const { ids } = req.body;

    const result = await prisma.upload.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "DELETED",
      },
    });

    return success(
      res,
      "Uploads deleted successfully",
      result
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * UPLOAD AUDIT LOGS
 * ===========================================
 */
export const getUploadAuditLogs = async (
  req: Request,
  res: Response
) => {
  try {
    const logs = await prisma.upload.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        status: true,
        uploadedBy: true,
        approvedBy: true,
        rejectedBy: true,
        verifiedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return success(
      res,
      "Audit logs fetched successfully",
      logs
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GENERATE UPLOAD URL
 * ===========================================
 */
export const generateUploadUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const fileName =
      req.body.fileName ||
      generateFileName("upload.bin");

    return success(
      res,
      "Upload URL generated successfully",
      {
        uploadUrl: `/uploads/${fileName}`,
        fileName,
      }
    );
  } catch (error) {
    return failure(res, error);
  }
};

/**
 * ===========================================
 * GENERATE DOWNLOAD URL
 * ===========================================
 */
export const generateDownloadUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const upload = await prisma.upload.findUnique({
      where: {
        id: id!,
      },
    });

    if (!upload) {
      return failure(res, "Upload not found", 404);
    }

    return success(
      res,
      "Download URL generated successfully",
      {
        downloadUrl: upload.downloadUrl || upload.fileUrl,
      }
    );
  } catch (error) {
    return failure(res, error);
  }
};

export const getUserDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getAllDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const updateDocument = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const searchDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getPendingDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getVerifiedDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getRejectedDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getDocumentsByType = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const downloadDocument = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getDocumentDashboard = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const getRecentDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const bulkVerifyDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const bulkRejectDocuments = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const exportDocumentsExcel = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};

export const exportDocumentsPdf = async (req: Request, res: Response) => {
  return res.status(501).json({ message: "Not implemented" });
};




