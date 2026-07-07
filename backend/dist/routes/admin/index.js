"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_route_1 = __importDefault(require("./admin.route"));
const router = (0, express_1.Router)();
/* ========================================
   ADMIN ROUTES
======================================== */
router.use("/", admin_route_1.default);
exports.default = router;
