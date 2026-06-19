"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supportController_1 = require("../controllers/supportController");
const router = express_1.default.Router();
/* ========================================
   CREATE SUPPORT TICKET
======================================== */
router.post("/create", supportController_1.createSupportTicket);
/* ========================================
   GET USER TICKETS
======================================== */
router.get("/:userId", supportController_1.getUserTickets);
/* ========================================
   UPDATE TICKET STATUS
======================================== */
router.put("/update/:id", supportController_1.updateTicketStatus);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Support route working successfully",
    });
});
exports.default = router;
