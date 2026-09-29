import { Request, Response } from "express";
import dsaService from "../../services/dsa/dsa.service";

/* ==========================
   GET ALL DSA
========================== */

export const getDSAs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const result =
      await dsaService.getDSAList({
        page,
        limit,
        search,
      });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch DSA list",
    });
  }
};

/* ==========================
   GET DSA BY ID
========================== */

export const getDSAById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.getDSAProfile(
        String(req.params.id)
      );

    if (!dsa) {
      return void res.status(404).json({
        success: false,
        message: "DSA not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dsa,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch DSA",
    });
  }
};

/* ==========================
   CREATE DSA
========================== */

export const createDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.registerDSA({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
        referralCode:
          req.body.referralCode,
      });

    res.status(201).json({
      success: true,
      message: "DSA created successfully",
      data: dsa,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Failed to create DSA",
    });
  }
};

/* ==========================
   APPROVE DSA
========================== */

export const approveDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.verifyDSA(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "DSA approved successfully",
      data: dsa,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};

/* ==========================
   REJECT DSA
========================== */

export const rejectDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.updateDSA(
        String(req.params.id),
        {
          isVerified: false,
        }
      );

    res.status(200).json({
      success: true,
      message: "DSA rejected successfully",
      data: dsa,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

/* ==========================
   BLOCK DSA
========================== */

export const blockDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.blockDSA(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "DSA blocked successfully",
      data: dsa,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Block failed",
    });
  }
};

/* ==========================
   UNBLOCK DSA
========================== */

export const unblockDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsa =
      await dsaService.unblockDSA(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      message: "DSA unblocked successfully",
      data: dsa,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unblock failed",
    });
  }
};

/* ==========================
   DSA LOANS
========================== */

export const getDSALoans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsaId = String(req.params.id);

    const loans =
      await dsaService.getDSALoans(dsaId);

    console.log('=== DSA LOANS DEBUG ===');
    console.log('DSA ID:', dsaId);
    console.log('TOTAL LOANS:', loans.length);
    console.table(loans.map((loan: any) => ({ id: loan.id, fullName: loan.fullName, status: loan.status, assignedTo: loan.assignedTo, companyName: loan.companyName, loanType: loan.loanType })));

    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch loans",
    });
  }
};

/* ==========================
   DSA DASHBOARD
========================== */

export const getDSADashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dashboard =
      await dsaService.getDSADashboard(
        String(req.params.id)
      );

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

/* ==========================
   TOP DSA
========================== */

export const getTopDSA = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data =
      await dsaService.getTopDSA();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch top DSA",
    });
  }
};

/* ==========================
   ANALYTICS
========================== */

export const getDSAAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics = {
      totalDsa: 0,
      activeDsa: 0,
      totalBusiness: 0,
      totalCommission: 0,
    };

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};
