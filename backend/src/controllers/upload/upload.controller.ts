import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * UPLOAD FILE
 */
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "File required",
      });
      return;
    }

    const upload =
      await prisma.upload.create({
        data: {
          userId: req.body.userId,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          fileUrl: `/uploads/${req.file.filename}`,
          fileType: req.body.category,
          category: req.body.category,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
        },
      });

    res.status(201).json({
      success: true,
      data: upload,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error,
    });

  }
};

/**
 * GET ALL FILES
 */
export const getAllUploads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const uploads =
      await prisma.upload.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count: uploads.length,
      data: uploads,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * GET USER FILES
 */
export const getUserUploads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const uploads =
      await prisma.upload.findMany({
        where: {
          userId: req.params.userId,
        },
      });

    res.status(200).json({
      success: true,
      data: uploads,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * GET SINGLE FILE
 */
export const getUploadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const upload =
      await prisma.upload.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!upload) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: upload,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * VERIFY FILE
 */
export const verifyUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const upload =
      await prisma.upload.update({
        where: {
          id: req.params.id,
        },
        data: {
          isVerified: true,
        },
      });

    res.status(200).json({
      success: true,
      data: upload,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * DELETE FILE
 */
export const deleteUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    await prisma.upload.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UPLOAD ANALYTICS
 */
export const uploadAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const [
      totalFiles,
      verifiedFiles,
      pendingFiles,
    ] = await Promise.all([

      prisma.upload.count(),

      prisma.upload.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.upload.count({
        where: {
          isVerified: false,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        verifiedFiles,
        pendingFiles,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};