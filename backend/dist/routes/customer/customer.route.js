"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../../controllers/customer/customer.controller");
const router = (0, express_1.Router)();
/* ========================================
   ANALYTICS
======================================== */
router.get("/analytics", customer_controller_1.getCustomerAnalytics);
router.get("/dashboard", customer_controller_1.getCustomerDashboard);
router.get("/top-customers", customer_controller_1.getTopCustomers);
router.get("/monthly", customer_controller_1.getMonthlyCustomers);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", customer_controller_1.exportCustomersExcel);
router.get("/export/pdf", customer_controller_1.exportCustomersPdf);
/* ========================================
   CUSTOMER MANAGEMENT
======================================== */
router.post("/", customer_controller_1.createCustomer);
router.get("/", customer_controller_1.getAllCustomers);
router.get("/search", customer_controller_1.searchCustomers);
router.get("/active", customer_controller_1.getActiveCustomers);
router.get("/inactive", customer_controller_1.getInactiveCustomers);
router.get("/user/:userId", customer_controller_1.getCustomerByUserId);
router.get("/profile/:customerId", customer_controller_1.getCustomerProfile);
router.get("/:id", customer_controller_1.getCustomerById);
router.put("/:id", customer_controller_1.updateCustomer);
router.delete("/:id", customer_controller_1.deleteCustomer);
/* ========================================
   CUSTOMER STATUS
======================================== */
router.patch("/:id/verify", customer_controller_1.verifyCustomer);
router.patch("/:id/block", customer_controller_1.blockCustomer);
router.patch("/:id/unblock", customer_controller_1.unblockCustomer);
/* ========================================
   CUSTOMER DATA
======================================== */
router.get("/:customerId/loans", customer_controller_1.getCustomerLoans);
router.get("/:customerId/transactions", customer_controller_1.getCustomerTransactions);
router.get("/:customerId/documents", customer_controller_1.getCustomerDocuments);
router.get("/:customerId/kyc", customer_controller_1.getCustomerKyc);
exports.default = router;
