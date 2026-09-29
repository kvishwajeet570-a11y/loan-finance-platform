import { Router } from "express";

import {
  createSystemSetting,
  getAllSystemSettings,
  getSystemSettingById,
  getSystemSettingByKey,
  updateSystemSetting,
  deleteSystemSetting,
  bulkUpdateSystemSettings,
  toggleSystemSettingStatus,
  toggleEncryption,
} from "../../controllers/systemSetting/systemSetting.controller";

const router = Router();

/* ======================================================
   CREATE
====================================================== */

router.post("/", createSystemSetting);

/* ======================================================
   GET ALL
====================================================== */

router.get("/", getAllSystemSettings);

/* ======================================================
   GET BY KEY
====================================================== */

router.get("/key/:key", getSystemSettingByKey);

/* ======================================================
   GET BY ID
====================================================== */

router.get("/:id", getSystemSettingById);

/* ======================================================
   UPDATE
====================================================== */

router.put("/:id", updateSystemSetting);

/* ======================================================
   DELETE
====================================================== */

router.delete("/:id", deleteSystemSetting);

/* ======================================================
   BULK UPDATE
====================================================== */

router.put("/bulk/update", bulkUpdateSystemSettings);

/* ======================================================
   TOGGLE STATUS
====================================================== */

router.patch("/:id/status", toggleSystemSettingStatus);

/* ======================================================
   TOGGLE ENCRYPTION
====================================================== */

router.patch("/:id/encryption", toggleEncryption);

export default router;