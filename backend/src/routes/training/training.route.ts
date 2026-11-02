import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import adminMiddleware from "../../middlewares/admin";
import upload from "../../config/upload/trainingMulter";
import { listMyDsaTraining, listPublishedTraining,listAllTraining,createTraining,submitDsaTraining,publishTraining,archiveTraining } from "../../controllers/training/training.controller";
const router=Router();
router.get("/",authMiddleware,listPublishedTraining);
router.get("/dsa/mine",authMiddleware,listMyDsaTraining);
router.get("/admin/all",authMiddleware,adminMiddleware,listAllTraining);
router.post("/admin/upload",authMiddleware,adminMiddleware,upload.single("file"),createTraining);
router.post("/dsa/submit",authMiddleware,upload.fields([{name:"file",maxCount:1},{name:"poster",maxCount:1}]),submitDsaTraining);
router.patch("/admin/:id/publish",authMiddleware,adminMiddleware,publishTraining);
router.patch("/admin/:id/archive",authMiddleware,adminMiddleware,archiveTraining);
export default router;

