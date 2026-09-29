"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("../../controllers/session/session.controller");
// Uncomment according to your project
// import { authenticate } from "../../middlewares/auth.middleware";
// import { authorize } from "../../middlewares/role.middleware";
// import { validate } from "../../middlewares/validate.middleware";
// import {
//   sessionIdSchema,
//   userSessionSchema,
//   sessionQuerySchema,
//   cleanupSessionSchema,
// } from "../../dto/session/session.dto";
const router = (0, express_1.Router)();
/* ==========================================================
   SESSION MANAGEMENT
========================================================== */
// Get All Sessions
router.get("/", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
// validate(sessionQuerySchema),
session_controller_1.getAllSessions);
// Session Analytics Dashboard
router.get("/analytics", 
// authenticate,
// authorize("SUPER_ADMIN"),
session_controller_1.sessionAnalytics);
// Cleanup Expired Sessions
router.delete("/cleanup", 
// authenticate,
// authorize("SUPER_ADMIN"),
// validate(cleanupSessionSchema),
session_controller_1.cleanupExpiredSessions);
// Get Session By ID
router.get("/:id", 
// authenticate,
// validate(sessionIdSchema),
session_controller_1.getSessionById);
// Force Logout Single Session
router.patch("/:id/logout", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
// validate(sessionIdSchema),
session_controller_1.forceLogoutSession);
// Delete Session
router.delete("/:id", 
// authenticate,
// authorize("SUPER_ADMIN"),
// validate(sessionIdSchema),
session_controller_1.deleteSession);
// Get User Sessions
router.get("/user/:userId", 
// authenticate,
// validate(userSessionSchema),
session_controller_1.getUserSessions);
// User Session Summary
router.get("/user/:userId/summary", 
// authenticate,
// validate(userSessionSchema),
session_controller_1.userSessionSummary);
// Logout All User Sessions
router.patch("/user/:userId/logout-all", 
// authenticate,
// authorize("SUPER_ADMIN", "ADMIN"),
// validate(userSessionSchema),
session_controller_1.logoutAllUserSessions);
exports.default = router;
