import type { Request, Response } from "express";
import prisma from "../../prisma/prisma";

export async function listLenderPolicies(req: Request, res: Response) {
  try {
    const lenderName =
      typeof req.query.lenderName === "string" ? req.query.lenderName.trim() : "";
    const loanType =
      typeof req.query.loanType === "string" ? req.query.loanType.trim() : "";

    const policies = await prisma.lenderPolicy.findMany({
      where: {
        isActive: true,
        ...(lenderName ? { lenderName: { contains: lenderName, mode: "insensitive" as const } } : {}),
        ...(loanType ? { loanType: { contains: loanType, mode: "insensitive" as const } } : {}),
      },
      orderBy: [{ lenderName: "asc" }, { productName: "asc" }],
    });

    return res.json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    console.error("Failed to list lender policies:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load lender policies.",
    });
  }
}
