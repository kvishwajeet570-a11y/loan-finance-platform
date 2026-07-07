import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * CREATE PARTNER
 */
export const createPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exists = await prisma.partner.findFirst({
      where: {
        OR: [
          { email: req.body.email },
          { partnerCode: req.body.partnerCode }
        ]
      }
    });

    if (exists) {
      res.status(400).json({
        success: false,
        message: "Partner already exists"
      });
      return;
    }

    const partner = await prisma.partner.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      data: partner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create partner"
    });
  }
};

/**
 * GET ALL PARTNERS
 */
export const getAllPartners = async (
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
          companyName: {
            contains: search,
            mode: "insensitive" as const
          }
        },
        {
          contactPerson: {
            contains: search,
            mode: "insensitive" as const
          }
        }
      ]
    };

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.partner.count({ where })
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      data: partners
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch partners"
    });
  }
};

/**
 * GET SINGLE PARTNER
 */
export const getPartnerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!partner) {
      res.status(404).json({
        success: false,
        message: "Partner not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed"
    });
  }
};

/**
 * APPROVE PARTNER
 */
export const approvePartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: req.params.id
      },
      data: {
        status: "APPROVED",
        approvedBy: req.user?.id,
        approvedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: "Partner approved",
      data: partner
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed"
    });
  }
};

/**
 * REJECT PARTNER
 */
export const rejectPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: req.params.id
      },
      data: {
        status: "REJECTED",
        remarks: req.body.remarks
      }
    });

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed"
    });
  }
};

/**
 * BLOCK / UNBLOCK
 */
export const togglePartnerStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: req.params.id }
    });

    if (!partner) {
      res.status(404).json({
        success: false,
        message: "Partner not found"
      });
      return;
    }

    const updated = await prisma.partner.update({
      where: { id: req.params.id },
      data: {
        isActive: !partner.isActive
      }
    });

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

/**
 * ANALYTICS
 */
export const partnerAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalPartners,
      activePartners,
      approvedPartners,
      pendingPartners
    ] = await Promise.all([
      prisma.partner.count(),
      prisma.partner.count({
        where: { isActive: true }
      }),
      prisma.partner.count({
        where: { status: "APPROVED" }
      }),
      prisma.partner.count({
        where: { status: "PENDING" }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPartners,
        activePartners,
        approvedPartners,
        pendingPartners
      }
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed"
    });
  }
};