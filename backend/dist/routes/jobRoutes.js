"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const router = express_1.default.Router();
/* ========================================
   CREATE JOB APPLICATION
======================================== */
router.post("/create", jobController_1.createJobApplication);
/* ========================================
   GET ALL JOB APPLICATIONS
======================================== */
router.get("/all", jobController_1.getJobApplications);
/* ========================================
   GET SINGLE APPLICATION
======================================== */
router.get("/:id", jobController_1.getSingleApplication);
/* ========================================
   UPDATE JOB STATUS
======================================== */
router.put("/update/:id", jobController_1.updateJobStatus);
/* ========================================
   DELETE APPLICATION
======================================== */
router.delete("/delete/:id", jobController_1.deleteJobApplication);
/* ========================================
   HEALTH CHECK
======================================== */
router.get("/health/check", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Job route working successfully",
    });
});
exports.default = router;
