"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aadhaar_controller_1 = require("./aadhaar.controller");
const router = (0, express_1.Router)();
/**
 * Aadhaar Verification
 */
router.post("/verify", aadhaar_controller_1.verifyAadhaar);
/**
 * Get Aadhaar Verification Status
 */
router.get("/status/:userId", aadhaar_controller_1.getAadhaarStatus);
/**
 * Update Aadhaar Details
 */
router.put("/update/:userId", aadhaar_controller_1.updateAadhaar);
/**
 * Delete Aadhaar Record
 */
router.delete("/delete/:userId", aadhaar_controller_1.deleteAadhaar);
exports.default = router;
