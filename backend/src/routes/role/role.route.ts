import { Router } from "express";

import {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,

  assignRoleToUser,
  removeRoleFromUser,

  assignMultipleRoles,
  removeMultipleRoles,

  getUserRoles,
  getRoleUsers,

  getRolePermissions,
  assignPermissionToRole,
  removePermissionFromRole,

  cloneRole,

  activateRole,
  deactivateRole,

  getAdminRoles,
  getCustomerRoles,
  getDsaRoles,
  getPartnerRoles,

  getSystemRoles,
  getCustomRoles,

  searchRoles,

  getRoleDashboard,
  getRoleAnalytics,

  getRoleHierarchy,

  exportRolesExcel,
  exportRolesPdf,

  bulkCreateRoles,
  bulkDeleteRoles,
  bulkAssignRoles,

  getRoleAuditLogs,
} from "../../controllers/role/role.controller";

const router = Router();

/* =====================================
   DASHBOARD & ANALYTICS
===================================== */

router.get("/dashboard", getRoleDashboard);

router.get("/analytics", getRoleAnalytics);

router.get("/hierarchy", getRoleHierarchy);

router.get("/audit-logs", getRoleAuditLogs);

/* =====================================
   ROLE TYPES
===================================== */

router.get("/system", getSystemRoles);

router.get("/custom", getCustomRoles);

router.get("/admin", getAdminRoles);

router.get("/customer", getCustomerRoles);

router.get("/dsa", getDsaRoles);

router.get("/partner", getPartnerRoles);

/* =====================================
   ROLE SEARCH
===================================== */

router.get("/search", searchRoles);

/* =====================================
   ROLE EXPORT
===================================== */

router.get("/export/excel", exportRolesExcel);

router.get("/export/pdf", exportRolesPdf);

/* =====================================
   ROLE CRUD
===================================== */

router.post("/", createRole);

router.get("/", getAllRoles);

router.get("/:id", getRoleById);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

/* =====================================
   ROLE STATUS
===================================== */

router.patch("/:id/activate", activateRole);

router.patch("/:id/deactivate", deactivateRole);

router.post("/:id/clone", cloneRole);

/* =====================================
   USER ROLE MANAGEMENT
===================================== */

router.post(
  "/assign/user",
  assignRoleToUser
);

router.post(
  "/remove/user",
  removeRoleFromUser
);

router.post(
  "/assign-multiple/user",
  assignMultipleRoles
);

router.post(
  "/remove-multiple/user",
  removeMultipleRoles
);

router.get(
  "/user/:userId",
  getUserRoles
);

router.get(
  "/users/:roleId",
  getRoleUsers
);

/* =====================================
   PERMISSION MANAGEMENT
===================================== */

router.get(
  "/permissions/:roleId",
  getRolePermissions
);

router.post(
  "/permission/assign",
  assignPermissionToRole
);

router.post(
  "/permission/remove",
  removePermissionFromRole
);

/* =====================================
   BULK ACTIONS
===================================== */

router.post(
  "/bulk/create",
  bulkCreateRoles
);

router.post(
  "/bulk/delete",
  bulkDeleteRoles
);

router.post(
  "/bulk/assign",
  bulkAssignRoles
);

export default router;