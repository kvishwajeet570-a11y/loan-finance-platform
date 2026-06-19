"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
/* ========================================
   GET WALLET
======================================== */
router.get("/:userId", walletController_1.getWallet);
/* ========================================
   ADD MONEY
======================================== */
router.post("/add-money", walletController_1.addMoney);
/* ========================================
   WITHDRAW MONEY
======================================== */
router.post("/withdraw-money", walletController_1.withdrawMoney);
/* ========================================
   WALLET HISTORY
======================================== */
router.get("/history/:userId", walletController_1.getWalletHistory);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Wallet route working successfully",
    });
});
exports.default = router;
