import { Router } from "express";

import {
  createBankAccount,
  getUserBankAccounts,
  getBankById,
  verifyBankAccount,
  setPrimaryAccount,
  updateBankAccount,
  deleteBankAccount,
  searchAccounts,
  getAllBankAccounts,
  getBankAnalytics,
} from "../../controllers/bank/bank.controller";

import authenticate from "../../middlewares/AuthMiddleware";
import roleMiddleware from "../../middlewares/RoleMiddleware";

const router = Router();

// Every bank endpoint requires a valid login.
router.use(authenticate);

// Administrative bank overview and verification.
router.get("/analytics", roleMiddleware("SUPER_ADMIN", "ADMIN"), getBankAnalytics);
router.get("/", roleMiddleware("SUPER_ADMIN", "ADMIN"), getAllBankAccounts);
router.get("/search/:keyword", roleMiddleware("SUPER_ADMIN", "ADMIN"), searchAccounts);
router.patch("/:id/verify", roleMiddleware("SUPER_ADMIN", "ADMIN"), verifyBankAccount);

// Customer account operations require authentication.
// Controllers must still enforce account ownership using req.user.id.
router.post("/", createBankAccount);
router.get("/user/:userId", getUserBankAccounts);
router.get("/:id", getBankById);
router.put("/:id", updateBankAccount);
router.delete("/:id", deleteBankAccount);
router.patch("/:id/set-primary", setPrimaryAccount);

export default router;
