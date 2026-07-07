import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const uploadMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const media = await prisma.media.create({
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype.split("/")[0],
        mimeType: file.mimetype,
        fileSize: file.size,
        category: req.body.category,
        uploadedBy: req.user?.id,
      },
    });

    res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};

export const getAllMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.media.count(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: media,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
};

export const getMediaById = async (
  req: Request,
  res: Response
) => {
  try {
    const media = await prisma.media.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.media.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Media deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const toggleMediaStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const media = await prisma.media.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    const updated = await prisma.media.update({
      where: {
        id: req.params.id,
      },
      data: {
        isActive: !media.isActive,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const getMediaAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const totalFiles =
      await prisma.media.count();

    const activeFiles =
      await prisma.media.count({
        where: {
          isActive: true,
        },
      });

    const imageFiles =
      await prisma.media.count({
        where: {
          fileType: "image",
        },
      });

    const documentFiles =
      await prisma.media.count({
        where: {
          fileType: "application",
        },
      });

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        activeFiles,
        imageFiles,
        documentFiles,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};