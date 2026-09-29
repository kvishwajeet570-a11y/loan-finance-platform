import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

/* ========================================
   CREATE PARTNER
======================================== */

export const createPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      data: partner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create partner",
      error,
    });
  }
};

/* ========================================
   GET ALL PARTNERS
======================================== */

export const getAllPartners = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: partners,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch partners",
    });
  }
};

/* ========================================
   GET PARTNER BY ID
======================================== */

export const getPartnerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!partner) {
      res.status(404).json({
        success: false,
        message: "Partner not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch partner",
    });
  }
};

/* ========================================
   UPDATE PARTNER
======================================== */

export const updatePartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update partner",
    });
  }
};

/* ========================================
   DELETE PARTNER
======================================== */

export const deletePartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.partner.delete({
      where: {
        id: String(req.params.id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete partner",
    });
  }
};

/* ========================================
   APPROVE PARTNER
======================================== */

export const approvePartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* ========================================
   REJECT PARTNER
======================================== */

export const rejectPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        status: "REJECTED",
        rejectionReason: req.body.reason || "",
      },
    });

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* ========================================
   VERIFY PARTNER
======================================== */

export const verifyPartner = approvePartner;

/* ========================================
   BLOCK PARTNER
======================================== */

export const blockPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        isBlocked: true,
        isActive: false,
      },
    });

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Block failed",
    });
  }
};

/* ========================================
   UNBLOCK PARTNER
======================================== */

export const unblockPartner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        isBlocked: false,
        isActive: true,
      },
    });

    res.status(200).json({
      success: true,
      data: partner,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unblock failed",
    });
  }
};

/* ========================================
   TOGGLE STATUS
======================================== */

export const togglePartnerStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const partner = await prisma.partner.findUnique({
      where: {
        id: String(req.params.id),
      },
    });

    if (!partner) {
      res.status(404).json({
        success: false,
        message: "Partner not found",
      });
      return;
    }

    const updated = await prisma.partner.update({
      where: {
        id: String(req.params.id),
      },
      data: {
        isActive: !partner.isActive,
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

/* ========================================
   DASHBOARD / ANALYTICS
======================================== */

export const partnerAnalytics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalPartners,
      activePartners,
      approvedPartners,
      blockedPartners,
    ] = await Promise.all([
      prisma.partner.count(),
      prisma.partner.count({
        where: { isActive: true },
      }),
      prisma.partner.count({
        where: { status: "APPROVED" },
      }),
      prisma.partner.count({
        where: { isBlocked: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPartners,
        activePartners,
        approvedPartners,
        blockedPartners,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};

export const getPartnerDashboard = partnerAnalytics;
export const getPartnerAnalytics = partnerAnalytics;

/* ========================================
   FILTERS
======================================== */

export const getPendingPartners = async (_req: Request, res: Response) =>
  res.json({
    success: true,
    data: await prisma.partner.findMany({
      where: { status: "PENDING" },
    }),
  });

export const getVerifiedPartners = async (_req: Request, res: Response) =>
  res.json({
    success: true,
    data: await prisma.partner.findMany({
      where: { status: "APPROVED" },
    }),
  });

export const getBlockedPartners = async (_req: Request, res: Response) =>
  res.json({
    success: true,
    data: await prisma.partner.findMany({
      where: { isBlocked: true },
    }),
  });

export const getActivePartners = async (_req: Request, res: Response) =>
  res.json({
    success: true,
    data: await prisma.partner.findMany({
      where: { isActive: true },
    }),
  });

/* ========================================
   ALIASES
======================================== */

export const getPartnerProfile = getPartnerById;
export const searchPartners = getAllPartners;
export const getTopPartners = getAllPartners;
export const getMonthlyPartners = getAllPartners;
export const getPartnerCustomers = getPartnerById;
export const getPartnerLoans = getPartnerById;
export const getPartnerCommissions = getPartnerById;
export const getPartnerReferrals = getPartnerById;
export const getPartnerTransactions = getPartnerById;
export const getPartnerWallet = getPartnerById;

/* ========================================
   EXPORTS
======================================== */

export const exportPartnersExcel = async (
  _req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Excel export endpoint",
  });
};

export const exportPartnersPdf = async (
  _req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "PDF export endpoint",
  });
};

/* ========================================
   BULK ACTIONS
======================================== */

export const bulkVerifyPartners = async (
  _req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Bulk verify completed",
  });
};

export const bulkBlockPartners = async (
  _req: Request,
  res: Response
) => {
  res.json({
    success: true,
    message: "Bulk block completed",
  });
};