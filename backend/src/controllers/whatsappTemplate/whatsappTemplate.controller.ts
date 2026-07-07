import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE TEMPLATE
 */
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
      variables
    } = req.body;

    const exists =
      await prisma.whatsAppTemplate.findUnique({
        where: { name }
      });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Template already exists"
      });
      return;
    }

    const template =
      await prisma.whatsAppTemplate.create({
        data: {
          name,
          category,
          language,
          body,
          headerType,
          headerText,
          footerText,
          buttons,
          variables
        }
      });

    res.status(201).json({
      success: true,
      data: template
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error
    });

  }
};

/**
 * GET ALL TEMPLATES
 */
export const getTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const page =
      Number(req.query.page || 1);

    const limit =
      Number(req.query.limit || 20);

    const skip =
      (page - 1) * limit;

    const templates =
      await prisma.whatsAppTemplate.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      });

    const total =
      await prisma.whatsAppTemplate.count();

    res.status(200).json({
      success: true,
      total,
      page,
      data: templates
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * GET TEMPLATE BY ID
 */
export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const template =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id: req.params.id
        }
      });

    if (!template) {

      res.status(404).json({
        success: false,
        message: "Template not found"
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: template
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * UPDATE TEMPLATE
 */
export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id: req.params.id
        },
        data: req.body
      });

    res.status(200).json({
      success: true,
      data: template
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * APPROVE TEMPLATE
 */
export const approveTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id: req.params.id
        },
        data: {
          status: "APPROVED",
          approvedAt: new Date()
        }
      });

    res.status(200).json({
      success: true,
      data: template
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * REJECT TEMPLATE
 */
export const rejectTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const template =
      await prisma.whatsAppTemplate.update({
        where: {
          id: req.params.id
        },
        data: {
          status: "REJECTED",
          rejectionReason:
            req.body.reason
        }
      });

    res.status(200).json({
      success: true,
      data: template
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * TOGGLE TEMPLATE STATUS
 */
export const toggleTemplateStatus =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const template =
      await prisma.whatsAppTemplate.findUnique({
        where: {
          id: req.params.id
        }
      });

    if (!template) {
      res.status(404).json({
        success: false
      });
      return;
    }

    const updated =
      await prisma.whatsAppTemplate.update({
        where: {
          id: req.params.id
        },
        data: {
          isActive:
            !template.isActive
        }
      });

    res.status(200).json({
      success: true,
      data: updated
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};

/**
 * TEMPLATE ANALYTICS
 */
export const templateAnalytics =
async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      total,
      approved,
      pending,
      rejected
    ] = await Promise.all([

      prisma.whatsAppTemplate.count(),

      prisma.whatsAppTemplate.count({
        where: {
          status: "APPROVED"
        }
      }),

      prisma.whatsAppTemplate.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.whatsAppTemplate.count({
        where: {
          status: "REJECTED"
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        approved,
        pending,
        rejected
      }
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }
};