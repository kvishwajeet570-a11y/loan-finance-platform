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

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getBankAnalytics
);

/* ========================================
   BANK ACCOUNTS
======================================== */

router.post(
  "/",
  createBankAccount
);

router.get(
  "/",
  getAllBankAccounts
);

router.get(
  "/search/:keyword",
  searchAccounts
);

router.get(
  "/:id",
  getBankById
);

router.put(
  "/:id",
  updateBankAccount
);

router.delete(
  "/:id",
  deleteBankAccount
);

/* ========================================
   USER BANK ACCOUNTS
======================================== */

router.get(
  "/user/:userId",
  getUserBankAccounts
);

/* ========================================
   VERIFICATION
======================================== */

router.patch(
  "/:id/verify",
  verifyBankAccount
);

/* ========================================
   PRIMARY ACCOUNT
======================================== */

router.patch(
  "/:id/set-primary",
  setPrimaryAccount
);

export default router;