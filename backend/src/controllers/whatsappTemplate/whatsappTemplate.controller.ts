import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ==========================================================
   HELPER
========================================================== */

const getParam = (
  value: string | string[] | undefined
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

/* ==========================================================
   CREATE TEMPLATE
========================================================== */

export const createTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      category,
      language,
      body,
      headerType,
      headerText,
      footerText,
      buttons,
      variables,
    } = req.body;

    const exists = await prisma.whatsAppTemplate.findUnique({
      where: {
        name,
      },
    });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Template already exists",
      });
      return;
    }

    const template = await prisma.whatsAppTemplate.create({
      data: {
        name,
        category,
        language,
        body,
        headerType,
        headerText,
        footerText,
        buttons,
        variables,
      },
    });

    res.status(201).json({
      success: true,
      message: "WhatsApp template created successfully",
      data: template,
    });
  } catch (error) {
    console.error("Create WhatsApp template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create WhatsApp template",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
};

/* ==========================================================
   GET ALL TEMPLATES
========================================================== */

export const getTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(
      1,
      Number(req.query.page || 1)
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number(req.query.limit || 20)
      )
    );

    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      prisma.whatsAppTemplate.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.whatsAppTemplate.count(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: templates,
    });
  } catch (error) {
    console.error("Get WhatsApp templates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch WhatsApp templates",
    });
  }
};

/* ==========================================================
   GET TEMPLATE BY ID
========================================================== */

export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Template ID is required",
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id,
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
  } catch (error) {
    console.error("Get WhatsApp template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch WhatsApp template",
    });
  }
};

/* ==========================================================
   UPDATE TEMPLATE
========================================================== */

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Template ID is required",
      });
      return;
    }

    const existing =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id,
        },

        data: req.body,
      });

    res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  } catch (error) {
    console.error("Update WhatsApp template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update WhatsApp template",
    });
  }
};

/* ==========================================================
   APPROVE TEMPLATE
========================================================== */

export const approveTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Template ID is required",
      });
      return;
    }

    const existing =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id,
        },

        data: {
          status: "APPROVED",
          approvedAt: new Date(),
          rejectionReason: null,
        },
      });

    res.status(200).json({
      success: true,
      message: "Template approved successfully",
      data: template,
    });
  } catch (error) {
    console.error("Approve WhatsApp template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to approve WhatsApp template",
    });
  }
};

/* ==========================================================
   REJECT TEMPLATE
========================================================== */

export const rejectTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Template ID is required",
      });
      return;
    }

    const existing =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Template not found",
      });
      return;
    }

    const reason =
      typeof req.body.reason === "string"
        ? req.body.reason.trim()
        : "";

    if (!reason) {
      res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id,
        },

        data: {
          status: "REJECTED",
          rejectionReason: reason,
        },
      });

    res.status(200).json({
      success: true,
      message: "Template rejected successfully",
      data: template,
    });
  } catch (error) {
    console.error("Reject WhatsApp template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reject WhatsApp template",
    });
  }
};

/* ==========================================================
   TOGGLE TEMPLATE STATUS
========================================================== */

export const toggleTemplateStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = getParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Template ID is required",
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id,
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
      await prisma.whatsAppTemplate.update({
        where: {
          id,
        },

        data: {
          isActive: !template.isActive,
        },
      });

    res.status(200).json({
      success: true,
      message: updated.isActive
        ? "Template activated successfully"
        : "Template deactivated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Toggle WhatsApp template status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update template status",
    });
  }
};

/* ==========================================================
   TEMPLATE ANALYTICS
========================================================== */

export const templateAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      total,
      approved,
      pending,
      rejected,
      active,
      inactive,
    ] = await Promise.all([
      prisma.whatsAppTemplate.count(),

      prisma.whatsAppTemplate.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.whatsAppTemplate.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.whatsAppTemplate.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.whatsAppTemplate.count({
        where: {
          isActive: true,
        },
      }),

      prisma.whatsAppTemplate.count({
        where: {
          isActive: false,
        },
      }),
    ]);

    res.status(200).json({
      success: true,

      data: {
        total,
        approved,
        pending,
        rejected,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error(
      "WhatsApp template analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch template analytics",
    });
  }
};