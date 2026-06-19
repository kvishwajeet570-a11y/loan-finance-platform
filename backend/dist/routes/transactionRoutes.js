"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
/* ========================================
   GET ALL TRANSACTIONS
======================================== */
router.get("/wallet/:walletId", transactionController_1.getTransactions);
/* ========================================
   CREATE TRANSACTION
======================================== */
router.post("/create", transactionController_1.createTransaction);
/* ========================================
   GET SINGLE TRANSACTION
======================================== */
router.get("/single/:id", transactionController_1.getSingleTransaction);
/* ========================================
   DELETE TRANSACTION
======================================== */
router.delete("/delete/:id", transactionController_1.deleteTransaction);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Transaction route working successfully",
    });
});
exports.default = router;
