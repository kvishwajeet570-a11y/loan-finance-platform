"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../../controllers/role/role.controller");
const router = (0, express_1.Router)();
/* =====================================
   DASHBOARD & ANALYTICS
===================================== */
router.get("/dashboard", role_controller_1.getRoleDashboard);
router.get("/analytics", role_controller_1.roleAnalytics);
router.get("/hierarchy", role_controller_1.getRoleHierarchy);
router.get("/audit-logs", role_controller_1.getRoleAuditLogs);
/* =====================================
   ROLE TYPES
===================================== */
router.get("/system", role_controller_1.getSystemRoles);
router.get("/custom", role_controller_1.getCustomRoles);
router.get("/admin", role_controller_1.getAdminRoles);
router.get("/customer", role_controller_1.getCustomerRoles);
router.get("/dsa", role_controller_1.getDsaRoles);
router.get("/partner", role_controller_1.getPartnerRoles);
/* =====================================
   ROLE SEARCH
===================================== */
router.get("/search", role_controller_1.searchRoles);
/* =====================================
   ROLE EXPORT
===================================== */
router.get("/export/excel", role_controller_1.exportRolesExcel);
router.get("/export/pdf", role_controller_1.exportRolesPdf);
/* =====================================
   ROLE CRUD
===================================== */
router.post("/", role_controller_1.createRole);
router.get("/", role_controller_1.getAllRoles);
router.get("/:id", role_controller_1.getRoleById);
router.put("/:id", role_controller_1.updateRole);
router.delete("/:id", role_controller_1.deleteRole);
/* =====================================
   ROLE STATUS
===================================== */
router.patch("/:id/activate", role_controller_1.activateRole);
router.patch("/:id/deactivate", role_controller_1.deactivateRole);
router.post("/:id/clone", role_controller_1.cloneRole);
/* =====================================
   USER ROLE MANAGEMENT
===================================== */
router.post("/assign/user", role_controller_1.assignRoleToUser);
router.post("/remove/user", role_controller_1.removeRoleFromUser);
router.post("/assign-multiple/user", role_controller_1.assignMultipleRoles);
router.post("/remove-multiple/user", role_controller_1.removeMultipleRoles);
router.get("/user/:userId", role_controller_1.getUserRoles);
router.get("/users/:roleId", role_controller_1.getRoleUsers);
/* =====================================
   PERMISSION MANAGEMENT
===================================== */
router.get("/permissions/:roleId", role_controller_1.getRolePermissions);
router.post("/permission/assign", role_controller_1.assignPermissionToRole);
router.post("/permission/remove", role_controller_1.removePermissionFromRole);
/* =====================================
   BULK ACTIONS
===================================== */
router.post("/bulk/create", role_controller_1.bulkCreateRoles);
router.post("/bulk/delete", role_controller_1.bulkDeleteRoles);
router.post("/bulk/assign", role_controller_1.bulkAssignRoles);
exports.default = router;
