"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loanController_1 = require("../controllers/loanController");
const router = express_1.default.Router();
/* ========================================
   APPLY LOAN
======================================== */
router.post("/apply", loanController_1.applyLoan);
/* ========================================
   GET ALL LOANS
======================================== */
router.get("/all", loanController_1.getAllLoans);
/* ========================================
   GET SINGLE LOAN
======================================== */
router.get("/:id", loanController_1.getSingleLoan);
/* ========================================
   APPROVE LOAN
======================================== */
router.put("/approve/:id", loanController_1.approveLoan);
/* ========================================
   REJECT LOAN
======================================== */
router.put("/reject/:id", loanController_1.rejectLoan);
/* ========================================
   DELETE LOAN
======================================== */
router.delete("/delete/:id", loanController_1.deleteLoan);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Loan Route Working Successfully",
    });
});
exports.default = router;
