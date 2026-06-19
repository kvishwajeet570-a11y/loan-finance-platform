"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
/* ========================================
   GET USERS
======================================== */
router.get("/users", adminController_1.getUsers);
/* ========================================
   BLOCK USER
======================================== */
router.post("/block-user", adminController_1.blockUser);
/* ========================================
   UNBLOCK USER
======================================== */
router.post("/unblock-user", adminController_1.unblockUser);
exports.default = router;
