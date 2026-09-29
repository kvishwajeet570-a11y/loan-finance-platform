import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
/* =========================================
   CREATE
========================================= */

export const createInvestment = async (
  req: Request,
  res: Response
) => {
  try {
    const investment = await prisma.investment.create({
      data: req.body,
    });

    return res.status(201).json({
      success: true,
      data: investment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET ALL
========================================= */

export const getAllInvestments = async (
  req: Request,
  res: Response
) => {
  try {
    const investments =
      await prisma.investment.findMany();

    return res.status(200).json({
      success: true,
      data: investments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET BY ID
========================================= */

export const getInvestmentById = async (
  req: Request,
  res: Response
) => {
  try {
    const investment =
      await prisma.investment.findUnique({
        where: {
          id: String(req.params.id),
        },
      });

    return res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   UPDATE
========================================= */

export const updateInvestment = async (
  req: Request,
  res: Response
) => {
  try {
    const investment =
      await prisma.investment.update({
        where: {
          id: String(req.params.id),
        },
        data: req.body,
      });

    return res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DELETE
========================================= */

export const deleteInvestment = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.investment.delete({
      where: {
        id: String(req.params.id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   APPROVE
========================================= */

export const approveInvestment = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "approveInvestment",
  });
};

/* =========================================
   REJECT
========================================= */

export const rejectInvestment = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "rejectInvestment",
  });
};

/* =========================================
   ACTIVATE
========================================= */

export const activateInvestment = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "activateInvestment",
  });
};

/* =========================================
   CLOSE
========================================= */

export const closeInvestment = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "closeInvestment",
  });
};

/* =========================================
   SEARCH
========================================= */

export const searchInvestments = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "searchInvestments",
  });
};

/* =========================================
   USER INVESTMENTS
========================================= */

export const getUserInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getUserInvestments",
    });
  };

/* =========================================
   STATUS LISTS
========================================= */

export const getPendingInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getPendingInvestments",
    });
  };

export const getActiveInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getActiveInvestments",
    });
  };

export const getClosedInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getClosedInvestments",
    });
  };

export const getRejectedInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getRejectedInvestments",
    });
  };

/* =========================================
   ANALYTICS
========================================= */

export const getInvestmentAnalytics =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "getInvestmentAnalytics",
    });
  };

export const getInvestmentDashboard =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "getInvestmentDashboard",
    });
  };

/* =========================================
   TOP DATA
========================================= */

export const getTopInvestors =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message: "getTopInvestors",
    });
  };

export const getTopPlans = async (
  req: Request,
  res: Response
) => {
  return res.json({
    success: true,
    message: "getTopPlans",
  });
};

export const getMonthlyInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "getMonthlyInvestments",
    });
  };

/* =========================================
   RETURNS
========================================= */

export const getInvestmentReturns =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "getInvestmentReturns",
    });
  };

export const calculateReturns =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "calculateReturns",
    });
  };

/* =========================================
   EXPORT
========================================= */

export const exportInvestmentsExcel =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "exportInvestmentsExcel",
    });
  };

export const exportInvestmentsPdf =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "exportInvestmentsPdf",
    });
  };

/* =========================================
   BULK ACTIONS
========================================= */

export const bulkApproveInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "bulkApproveInvestments",
    });
  };

export const bulkRejectInvestments =
  async (
    req: Request,
    res: Response
  ) => {
    return res.json({
      success: true,
      message:
        "bulkRejectInvestments",
    });
  };

