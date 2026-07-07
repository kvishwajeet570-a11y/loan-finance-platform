import { Router } from "express";
import {
  verifyAadhaar,
  getAadhaarStatus,
  updateAadhaar,
  deleteAadhaar,
} from "./aadhaar.controller";

const router = Router();

/**
 * Aadhaar Verification
 */
router.post("/verify", verifyAadhaar);

/**
 * Get Aadhaar Verification Status
 */
router.get("/status/:userId", getAadhaarStatus);

/**
 * Update Aadhaar Details
 */
router.put("/update/:userId", updateAadhaar);

/**
 * Delete Aadhaar Record
 */
router.delete("/delete/:userId", deleteAadhaar);

export default router;