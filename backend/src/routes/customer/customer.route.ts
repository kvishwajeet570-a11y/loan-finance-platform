import { Router } from "express";

import {
  createCustomer,
  getCustomerById,
  getCustomerByUserId,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  searchCustomers,

  getCustomerLoans,
  getCustomerTransactions,
  getCustomerDocuments,
  getCustomerKyc,

  verifyCustomer,
  blockCustomer,
  unblockCustomer,

  getActiveCustomers,
  getInactiveCustomers,

  getCustomerAnalytics,
  getTopCustomers,
  getMonthlyCustomers,

  getCustomerDashboard,
  getCustomerProfile,

  exportCustomersExcel,
  exportCustomersPdf,
} from "../../controllers/customer/customer.controller";

const router = Router();

/* ========================================
   ANALYTICS
======================================== */

router.get(
  "/analytics",
  getCustomerAnalytics
);

router.get(
  "/dashboard",
  getCustomerDashboard
);

router.get(
  "/top-customers",
  getTopCustomers
);

router.get(
  "/monthly",
  getMonthlyCustomers
);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportCustomersExcel
);

router.get(
  "/export/pdf",
  exportCustomersPdf
);

/* ========================================
   CUSTOMER MANAGEMENT
======================================== */

router.post(
  "/",
  createCustomer
);

router.get(
  "/",
  getAllCustomers
);

router.get(
  "/search",
  searchCustomers
);

router.get(
  "/active",
  getActiveCustomers
);

router.get(
  "/inactive",
  getInactiveCustomers
);

router.get(
  "/user/:userId",
  getCustomerByUserId
);

router.get(
  "/profile/:customerId",
  getCustomerProfile
);

router.get(
  "/:id",
  getCustomerById
);

router.put(
  "/:id",
  updateCustomer
);

router.delete(
  "/:id",
  deleteCustomer
);

/* ========================================
   CUSTOMER STATUS
======================================== */

router.patch(
  "/:id/verify",
  verifyCustomer
);

router.patch(
  "/:id/block",
  blockCustomer
);

router.patch(
  "/:id/unblock",
  unblockCustomer
);

/* ========================================
   CUSTOMER DATA
======================================== */

router.get(
  "/:customerId/loans",
  getCustomerLoans
);

router.get(
  "/:customerId/transactions",
  getCustomerTransactions
);

router.get(
  "/:customerId/documents",
  getCustomerDocuments
);

router.get(
  "/:customerId/kyc",
  getCustomerKyc
);

export default router;