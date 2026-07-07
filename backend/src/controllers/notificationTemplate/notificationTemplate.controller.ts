import { Request, Response } from "express";
import prisma from "../../config/prisma";

export const createTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      type,
      subject,
      content,
      variables,
    } = req.body;

    const exists =
      await prisma.notificationTemplate.findUnique({
        where: { code },
      });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Template code already exists",
      });
      return;
    }

    const template =
      await prisma.notificationTemplate.create({
        data: {
          name,
          code,
          type,
          subject,
          content,
          variables,
          createdBy: req.user?.id,
        },
      });

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create template",
    });
  }
};

export const getAllTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = String(req.query.search || "");

    const skip = (page - 1) * limit;

    const where = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          code: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const [templates, total] =
      await Promise.all([
        prisma.notificationTemplate.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.notificationTemplate.count({
          where,
        }),
      ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: templates,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await prisma.notificationTemplate.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await prisma.notificationTemplate.update({
        where: {
          id: req.params.id,
        },
        data: {
          ...req.body,
          updatedBy: req.user?.id,
        },
      });

    res.status(200).json({
      success: true,
      message: "Template updated",
      data: template,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const toggleTemplateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template =
      await prisma.notificationTemplate.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    const updated =
      await prisma.notificationTemplate.update({
        where: {
          id: req.params.id,
        },
        data: {
          isActive: !template.isActive,
        },
      });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};

export const deleteTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.notificationTemplate.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Template deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const templateAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalTemplates,
      activeTemplates,
      emailTemplates,
      smsTemplates,
      pushTemplates,
      whatsappTemplates,
    ] = await Promise.all([
      prisma.notificationTemplate.count(),
      prisma.notificationTemplate.count({
        where: { isActive: true },
      }),
      prisma.notificationTemplate.count({
        where: { type: "EMAIL" },
      }),
      prisma.notificationTemplate.count({
        where: { type: "SMS" },
      }),
      prisma.notificationTemplate.count({
        where: { type: "PUSH" },
      }),
      prisma.notificationTemplate.count({
        where: { type: "WHATSAPP" },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTemplates,
        activeTemplates,
        emailTemplates,
        smsTemplates,
        pushTemplates,
        whatsappTemplates,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};