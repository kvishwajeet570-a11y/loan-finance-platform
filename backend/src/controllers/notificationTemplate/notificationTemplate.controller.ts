import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import prisma from "../../prisma/prisma";

/* =====================================================
   CREATE TEMPLATE
===================================================== */

export const createTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      code,
      category,
      type,
      subject,
      content,
      variables,
    } = req.body;

    const existing =
      await prisma.notificationTemplate.findUnique({
        where: {
          code: String(code).toUpperCase(),
        },
      });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "Template code already exists",
      });
      return;
    }

    const template =
      await prisma.notificationTemplate.create({
        data: {
          name,
          code: String(code).toUpperCase(),
          category,
          type,
          subject,
          content,
          variables,
          createdBy:
            (req as any).user?.id || null,
        },
      });

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/* =====================================================
   GET ALL TEMPLATES
===================================================== */

export const getAllTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : undefined;

    const type =
      typeof req.query.type === "string"
        ? req.query.type
        : undefined;

    const isActive =
      req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
        ? false
        : undefined;

    const where: Prisma.NotificationTemplateWhereInput =
      {
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(category && {
          category,
        }),

        ...(type && {
          type,
        }),

        ...(typeof isActive ===
          "boolean" && {
          isActive,
        }),
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
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/* =====================================================
   GET TEMPLATE BY ID
===================================================== */

export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id =
      String(req.params.id);

    const template =
      await prisma.notificationTemplate.findUnique({
        where: { id },
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/* =====================================================
   UPDATE TEMPLATE
===================================================== */

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id =
      String(req.params.id);

    const existing =
      await prisma.notificationTemplate.findUnique({
        where: { id },
      });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    const updated =
      await prisma.notificationTemplate.update({
        where: { id },

        data: {
          ...req.body,

          version: {
            increment: 1,
          },
        },
      });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/* =====================================================
   DELETE TEMPLATE
===================================================== */

export const deleteTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id =
      String(req.params.id);

    await prisma.notificationTemplate.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message:
        "Template deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

/* =====================================================
   TOGGLE TEMPLATE STATUS
===================================================== */

export const toggleTemplateStatus =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id =
        String(req.params.id);

      const template =
        await prisma.notificationTemplate.findUnique({
          where: { id },
        });

      if (!template) {
        res.status(404).json({
          success: false,
          message:
            "Template not found",
        });
        return;
      }

      const updated =
        await prisma.notificationTemplate.update({
          where: { id },

          data: {
            isActive:
              !template.isActive,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  };

/* =====================================================
   APPROVE TEMPLATE
===================================================== */

export const approveTemplate =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id =
        String(req.params.id);

      const template =
        await prisma.notificationTemplate.update({
          where: { id },

          data: {
            approvedBy:
              (req as any).user?.id ||
              "SYSTEM",
          },
        });

      res.status(200).json({
        success: true,
        data: template,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  };

/* =====================================================
   TEMPLATE ANALYTICS
===================================================== */

export const templateAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const analytics =
        await prisma.notificationTemplate.aggregate({
          _count: {
            id: true,
          },

          _sum: {
            totalSent: true,
            totalDelivered: true,
            totalFailed: true,
          },
        });

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
      });
    }
  };

/* =====================================================
   UPDATE DELIVERY STATS
===================================================== */

export const updateDeliveryStats =
  async (
    templateId: string,
    delivered: boolean
  ) => {
    await prisma.notificationTemplate.update({
      where: {
        id: templateId,
      },

      data: {
        totalSent: {
          increment: 1,
        },

        ...(delivered
          ? {
              totalDelivered: {
                increment: 1,
              },
            }
          : {
              totalFailed: {
                increment: 1,
              },
            }),
      },
    });
  };