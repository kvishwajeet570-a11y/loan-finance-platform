import prisma from "../../prisma/prisma";
import fs from "fs";
import path from "path";

class UploadService {

  /**
   * Save Upload Record
   */
  async createUpload(data: {
    userId: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    category: string;
  }) {
    return prisma.upload.create({
      data,
    });
  }

  /**
   * Upload Profile Image
   */
  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File
  ) {

    const upload =
      await this.createUpload({
        userId,
        fileName: file.filename,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        mimeType: file.mimetype,
        fileSize: file.size,
        category: "PROFILE",
      });

    await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: upload.fileUrl,
      },
    });

    return upload;
  }

  /**
   * Upload PAN
   */
  async uploadPanDocument(
    userId: string,
    file: Express.Multer.File
  ) {
    return this.createUpload({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      category: "PAN_CARD",
    });
  }

  /**
   * Upload Loan Document
   */
  async uploadLoanDocument(
    userId: string,
    file: Express.Multer.File
  ) {
    return this.createUpload({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      category: "LOAN_DOCUMENT",
    });
  }

  /**
   * Upload Insurance Document
   */
  async uploadInsuranceDocument(
    userId: string,
    file: Express.Multer.File
  ) {
    return this.createUpload({
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      category: "INSURANCE_DOCUMENT",
    });
  }

  /**
   * Upload Multiple Files
   */
  async uploadMultipleFiles(
    userId: string,
    files: Express.Multer.File[],
    category: string
  ) {

    const uploads = [];

    for (const file of files) {
      const upload =
        await this.createUpload({
          userId,
          fileName: file.filename,
          originalName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          fileSize: file.size,
          category,
        });

      uploads.push(upload);
    }

    return uploads;
  }

  /**
   * User Upload History
   */
  async getUserUploads(
    userId: string,
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [uploads, total] =
      await Promise.all([
        prisma.upload.findMany({
          where: { userId },

          skip,
          take: limit,

          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.upload.count({
          where: { userId },
        }),
      ]);

    return {
      uploads,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get Upload By ID
   */
  async getUploadById(id: string) {
    return prisma.upload.findUnique({
      where: { id },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Delete Upload
   */
  async deleteUpload(id: string) {

    const upload =
      await prisma.upload.findUnique({
        where: { id },
      });

    if (!upload) {
      throw new Error(
        "Upload not found"
      );
    }

    const filePath =
      path.join(
        process.cwd(),
        "uploads",
        upload.fileName
      );

    if (
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }

    return prisma.upload.delete({
      where: { id },
    });
  }

  /**
   * Admin Upload Analytics
   */
  async getUploadStats() {

    const [
      totalUploads,
      totalUsers,
      totalSize,
    ] = await Promise.all([
      prisma.upload.count(),

      prisma.upload.groupBy({
        by: ["userId"],
      }),

      prisma.upload.aggregate({
        _sum: {
          fileSize: true,
        },
      }),
    ]);

    return {
      totalUploads,

      uniqueUsers:
        totalUsers.length,

      totalStorageUsed:
        totalSize._sum.fileSize || 0,
    };
  }

  /**
   * Category Analytics
   */
  async categoryAnalytics() {
    return prisma.upload.groupBy({
      by: ["category"],

      _count: {
        category: true,
      },

      orderBy: {
        _count: {
          category: "desc",
        },
      },
    });
  }

  /**
   * Recent Uploads
   */
  async recentUploads() {
    return prisma.upload.findMany({
      take: 20,

      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new UploadService();