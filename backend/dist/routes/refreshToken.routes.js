"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const refreshToken_controller_1 = require("../controllers/refreshToken/refreshToken.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validation_1 = __importDefault(require("../middlewares/validation"));
const refreshToken_dto_1 = require("../dto/refreshToken/refreshToken.dto");
const router = (0, express_1.Router)();
/* ============================================================
   REFRESH TOKEN ROUTES
   Base URL : /api/refresh-token
============================================================ */
/**
 * @route   POST /api/refresh-token/refresh
 * @desc    Generate new access token using refresh token
 * @access  Public
 */
router.post("/refresh", (0, validation_1.default)(refreshToken_dto_1.rotateRefreshTokenSchema), refreshToken_controller_1.refreshAccessToken);
/**
 * @route   POST /api/refresh-token/logout
 * @desc    Logout current device
 * @access  Private
 */
router.post("/logout", auth_1.default, (0, validation_1.default)(refreshToken_dto_1.revokeRefreshTokenSchema), refreshToken_controller_1.revokeRefreshToken);
/**
 * @route   POST /api/refresh-token/logout-all
 * @desc    Logout all devices
 * @access  Private
 */
router.post("/logout-all", auth_1.default, refreshToken_controller_1.revokeAllTokens);
/**
 * @route   GET /api/refresh-token/sessions
 * @desc    Get active login sessions
 * @access  Private
 */
router.get("/sessions", auth_1.default, refreshToken_controller_1.getActiveSessions);
/**
 * @route   GET /api/refresh-token/analytics
 * @desc    Get refresh token analytics
 * @access  Private (Admin check can be added later)
 */
router.get("/analytics", auth_1.default, refreshToken_controller_1.refreshTokenAnalytics);
exports.default = router;
