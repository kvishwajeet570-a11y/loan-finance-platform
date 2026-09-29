import { Router } from "express";

import {
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllTokens,
  getActiveSessions,
  refreshTokenAnalytics,
} from "../controllers/refreshToken/refreshToken.controller";

import authMiddleware from "../middlewares/auth";
import validation from "../middlewares/validation";

import {
  rotateRefreshTokenSchema,
  revokeRefreshTokenSchema,
} from "../dto/refreshToken/refreshToken.dto";

const router = Router();

/* ============================================================
   REFRESH TOKEN ROUTES
   Base URL : /api/refresh-token
============================================================ */

/**
 * @route   POST /api/refresh-token/refresh
 * @desc    Generate new access token using refresh token
 * @access  Public
 */
router.post(
  "/refresh",
  validation(rotateRefreshTokenSchema),
  refreshAccessToken
);

/**
 * @route   POST /api/refresh-token/logout
 * @desc    Logout current device
 * @access  Private
 */
router.post(
  "/logout",
  authMiddleware,
  validation(revokeRefreshTokenSchema),
  revokeRefreshToken
);

/**
 * @route   POST /api/refresh-token/logout-all
 * @desc    Logout all devices
 * @access  Private
 */
router.post(
  "/logout-all",
  authMiddleware,
  revokeAllTokens
);

/**
 * @route   GET /api/refresh-token/sessions
 * @desc    Get active login sessions
 * @access  Private
 */
router.get(
  "/sessions",
  authMiddleware,
  getActiveSessions
);

/**
 * @route   GET /api/refresh-token/analytics
 * @desc    Get refresh token analytics
 * @access  Private (Admin check can be added later)
 */
router.get(
  "/analytics",
  authMiddleware,
  refreshTokenAnalytics
);

export default router;