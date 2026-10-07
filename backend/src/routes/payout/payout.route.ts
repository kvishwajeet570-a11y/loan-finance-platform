import { Router } from "express";
import { authGuard } from "../../guards/authGuard";
import {
  getMyPayout,
  requestPayout,
} from "../../controllers/payout/payout.controller";

const router = Router();

router.get(
  "/me",
  authGuard,
  getMyPayout
);

router.get(
  "/summary",
  authGuard,
  getMyPayout
);

router.get(
  "/eligibility",
  authGuard,
  getMyPayout
);

router.get(
  "/bank-account",
  authGuard,
  getMyPayout
);

router.get(
  "/history",
  authGuard,
  getMyPayout
);

router.post(
  "/request",
  authGuard,
  requestPayout
);

export default router;
