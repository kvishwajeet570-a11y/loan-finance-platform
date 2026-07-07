"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_controller_1 = require("../../controllers/support/support.controller");
const router = (0, express_1.Router)();
/* ========================================
   DASHBOARD
======================================== */
router.get("/dashboard", support_controller_1.getSupportDashboard);
router.get("/analytics", support_controller_1.getSupportAnalytics);
router.get("/statistics", support_controller_1.getTicketStatistics);
/* ========================================
   REPORTS
======================================== */
router.get("/sla-report", support_controller_1.getSlaReport);
router.get("/response-time-report", support_controller_1.getResponseTimeReport);
router.get("/department-performance", support_controller_1.getDepartmentPerformance);
router.get("/agent-performance", support_controller_1.getAgentPerformance);
/* ========================================
   STATUS
======================================== */
router.get("/pending", support_controller_1.getPendingTickets);
router.get("/open", support_controller_1.getOpenTickets);
router.get("/resolved", support_controller_1.getResolvedTickets);
router.get("/closed", support_controller_1.getClosedTickets);
router.get("/escalated", support_controller_1.getEscalatedTickets);
/* ========================================
   TICKET MANAGEMENT
======================================== */
router.post("/", support_controller_1.createTicket);
router.get("/", support_controller_1.getAllTickets);
router.get("/recent", support_controller_1.getRecentTickets);
router.get("/:id", support_controller_1.getTicketById);
router.put("/:id", support_controller_1.updateTicket);
router.delete("/:id", support_controller_1.deleteTicket);
/* ========================================
   TICKET ACTIONS
======================================== */
router.patch("/:id/assign", support_controller_1.assignTicket);
router.patch("/:id/transfer", support_controller_1.transferTicket);
router.patch("/:id/resolve", support_controller_1.resolveTicket);
router.patch("/:id/close", support_controller_1.closeTicket);
router.patch("/:id/reopen", support_controller_1.reopenTicket);
router.patch("/:id/escalate", support_controller_1.escalateTicket);
/* ========================================
   REPLIES
======================================== */
router.post("/:id/reply", support_controller_1.addReply);
router.get("/:id/replies", support_controller_1.getTicketReplies);
/* ========================================
   USER SUPPORT
======================================== */
router.get("/my/tickets", support_controller_1.getMyTickets);
router.get("/user/:userId", support_controller_1.getUserTickets);
router.get("/history/:customerId", support_controller_1.getCustomerSupportHistory);
/* ========================================
   LIVE CHAT
======================================== */
router.get("/live-chat", support_controller_1.getLiveSupportChats);
router.get("/chat-history/:chatId", support_controller_1.getChatHistory);
router.post("/chat/send-message", support_controller_1.sendSupportMessage);
/* ========================================
   FAQ
======================================== */
router.post("/faq/create", support_controller_1.createFaqTicket);
router.post("/faq/convert/:ticketId", support_controller_1.convertTicketToFaq);
/* ========================================
   AGENTS
======================================== */
router.get("/top-agents", support_controller_1.getTopAgents);
/* ========================================
   AUDIT
======================================== */
router.get("/audit-logs", support_controller_1.getTicketAuditLogs);
/* ========================================
   SEARCH
======================================== */
router.get("/search", support_controller_1.searchTickets);
/* ========================================
   EXPORT
======================================== */
router.get("/export/excel", support_controller_1.exportTicketsExcel);
router.get("/export/pdf", support_controller_1.exportTicketsPdf);
/* ========================================
   BULK ACTIONS
======================================== */
router.post("/bulk/assign", support_controller_1.bulkAssignTickets);
router.post("/bulk/close", support_controller_1.bulkCloseTickets);
router.post("/bulk/delete", support_controller_1.bulkDeleteTickets);
exports.default = router;
