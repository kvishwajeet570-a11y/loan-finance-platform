import { Router } from "express";
import { calculateEMI } from "./emi.service";

const router = Router();

router.post("/calculate", (req, res) => {
  const principal = Number(req.body?.principal);
  const interestRate = Number(req.body?.interestRate);
  const tenureMonths = Number(req.body?.tenureMonths);

  if (
    !Number.isFinite(principal) || principal <= 0 ||
    !Number.isFinite(interestRate) || interestRate < 0 ||
    !Number.isInteger(tenureMonths) || tenureMonths <= 0
  ) {
    return res.status(400).json({ success: false, message: "Enter a valid loan amount, interest rate, and tenure." });
  }

  return res.json({ success: true, data: calculateEMI(principal, interestRate, tenureMonths) });
});

export default router;
