"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bank_controller_1 = require("../../controllers/bank/bank.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", bank_controller_1.getBankAnalytics);
/* ========================================
   BANK ACCOUNTS
======================================== */
router.post("/", bank_controller_1.createBankAccount);
router.get("/", bank_controller_1.getAllBankAccounts);
router.get("/search/:keyword", bank_controller_1.searchAccounts);
router.get("/:id", bank_controller_1.getBankById);
router.put("/:id", bank_controller_1.updateBankAccount);
router.delete("/:id", bank_controller_1.deleteBankAccount);
/* ========================================
   USER BANK ACCOUNTS
======================================== */
router.get("/user/:userId", bank_controller_1.getUserBankAccounts);
/* ========================================
   VERIFICATION
======================================== */
router.patch("/:id/verify", bank_controller_1.verifyBankAccount);
/* ========================================
   PRIMARY ACCOUNT
======================================== */
router.patch("/:id/set-primary", bank_controller_1.setPrimaryAccount);
exports.default = router;
