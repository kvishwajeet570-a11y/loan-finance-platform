"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../../controllers/admin/admin.controller");
const router = (0, express_1.Router)();
/* ==========================================
   DASHBOARD
========================================== */
router.get("/dashboard", admin_controller_1.getDashboardStats);
/* ==========================================
   USER MANAGEMENT
========================================== */
router.get("/users", admin_controller_1.getAllUsers);
router.get("/users/:id", admin_controller_1.getUserById);
router.patch("/users/:id/block", admin_controller_1.blockUser);
router.patch("/users/:id/unblock", admin_controller_1.unblockUser);
router.patch("/users/:id/verify", admin_controller_1.verifyUser);
/* ==========================================
   LOAN MANAGEMENT
========================================== */
router.get("/loans", admin_controller_1.getRecentLoans);
router.get("/loans/:id", admin_controller_1.getLoanById);
router.patch("/loans/:id/approve", admin_controller_1.approveLoan);
router.patch("/loans/:id/reject", admin_controller_1.rejectLoan);
exports.default = router;
