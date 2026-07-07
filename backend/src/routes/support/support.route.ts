import { Router } from "express";

import {
  createTicket,
  getTicketById,
  getAllTickets,
  updateTicket,
  deleteTicket,

  assignTicket,
  transferTicket,

  closeTicket,
  reopenTicket,
  resolveTicket,

  addReply,
  getTicketReplies,

  getMyTickets,
  getUserTickets,

  getPendingTickets,
  getOpenTickets,
  getResolvedTickets,
  getClosedTickets,
  getEscalatedTickets,

  escalateTicket,

  getSupportDashboard,
  getSupportAnalytics,

  getRecentTickets,
  getTopAgents,

  getAgentPerformance,
  getDepartmentPerformance,

  getCustomerSupportHistory,

  searchTickets,

  exportTicketsExcel,
  exportTicketsPdf,

  getTicketAuditLogs,

  bulkAssignTickets,
  bulkCloseTickets,
  bulkDeleteTickets,

  getLiveSupportChats,
  getChatHistory,

  sendSupportMessage,

  createFaqTicket,
  convertTicketToFaq,

  getSlaReport,
  getResponseTimeReport,

  getTicketStatistics,
} from "../../controllers/support/support.controller";

const router = Router();

/* ========================================
   DASHBOARD
======================================== */

router.get("/dashboard", getSupportDashboard);

router.get("/analytics", getSupportAnalytics);

router.get("/statistics", getTicketStatistics);

/* ========================================
   REPORTS
======================================== */

router.get("/sla-report", getSlaReport);

router.get(
  "/response-time-report",
  getResponseTimeReport
);

router.get(
  "/department-performance",
  getDepartmentPerformance
);

router.get(
  "/agent-performance",
  getAgentPerformance
);

/* ========================================
   STATUS
======================================== */

router.get("/pending", getPendingTickets);

router.get("/open", getOpenTickets);

router.get("/resolved", getResolvedTickets);

router.get("/closed", getClosedTickets);

router.get("/escalated", getEscalatedTickets);

/* ========================================
   TICKET MANAGEMENT
======================================== */

router.post("/", createTicket);

router.get("/", getAllTickets);

router.get("/recent", getRecentTickets);

router.get("/:id", getTicketById);

router.put("/:id", updateTicket);

router.delete("/:id", deleteTicket);

/* ========================================
   TICKET ACTIONS
======================================== */

router.patch("/:id/assign", assignTicket);

router.patch("/:id/transfer", transferTicket);

router.patch("/:id/resolve", resolveTicket);

router.patch("/:id/close", closeTicket);

router.patch("/:id/reopen", reopenTicket);

router.patch("/:id/escalate", escalateTicket);

/* ========================================
   REPLIES
======================================== */

router.post("/:id/reply", addReply);

router.get("/:id/replies", getTicketReplies);

/* ========================================
   USER SUPPORT
======================================== */

router.get("/my/tickets", getMyTickets);

router.get("/user/:userId", getUserTickets);

router.get(
  "/history/:customerId",
  getCustomerSupportHistory
);

/* ========================================
   LIVE CHAT
======================================== */

router.get("/live-chat", getLiveSupportChats);

router.get(
  "/chat-history/:chatId",
  getChatHistory
);

router.post(
  "/chat/send-message",
  sendSupportMessage
);

/* ========================================
   FAQ
======================================== */

router.post(
  "/faq/create",
  createFaqTicket
);

router.post(
  "/faq/convert/:ticketId",
  convertTicketToFaq
);

/* ========================================
   AGENTS
======================================== */

router.get("/top-agents", getTopAgents);

/* ========================================
   AUDIT
======================================== */

router.get(
  "/audit-logs",
  getTicketAuditLogs
);

/* ========================================
   SEARCH
======================================== */

router.get("/search", searchTickets);

/* ========================================
   EXPORT
======================================== */

router.get(
  "/export/excel",
  exportTicketsExcel
);

router.get(
  "/export/pdf",
  exportTicketsPdf
);

/* ========================================
   BULK ACTIONS
======================================== */

router.post(
  "/bulk/assign",
  bulkAssignTickets
);

router.post(
  "/bulk/close",
  bulkCloseTickets
);

router.post(
  "/bulk/delete",
  bulkDeleteTickets
);

export default router;