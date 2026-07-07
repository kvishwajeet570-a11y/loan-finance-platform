import { Router } from "express";

import {
  applyLoan,
  getAllLoans,
  getSingleLoan,
  approveLoan,
  rejectLoan,
  deleteLoan,
} from "../../controllers/loan/loan.controller";

const router = Router();

router.post("/", applyLoan);

router.get("/", getAllLoans);

router.get("/:id", getSingleLoan);

router.patch("/:id/approve", approveLoan);

router.patch("/:id/reject", rejectLoan);

router.delete("/:id", deleteLoan);

export default router;