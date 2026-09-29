"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../../controllers/lead/lead.controller");
const router = (0, express_1.Router)();
/* =========================
   LEAD ANALYTICS
========================= */
router.get("/analytics", lead_controller_1.getLeadAnalytics);
/* =========================
   LEAD CRUD
========================= */
router.post("/", lead_controller_1.createLead);
router.get("/", lead_controller_1.getLeads);
router.get("/:id", lead_controller_1.getLeadById);
router.delete("/:id", lead_controller_1.deleteLead);
/* =========================
   LEAD ACTIONS
========================= */
router.patch("/:id/assign", lead_controller_1.assignLead);
router.patch("/:id/status", lead_controller_1.updateLeadStatus);
exports.default = router;
