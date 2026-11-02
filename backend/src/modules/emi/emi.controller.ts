import { Request, Response } from "express";
import { calculateEMI } from "./emi.service";
export const calculateEmiController = (req: Request, res: Response) => {
  const { principal, interestRate, tenureMonths } = req.body ?? {};
  return res.json({ success: true, data: calculateEMI(Number(principal), Number(interestRate), Number(tenureMonths)) });
};
