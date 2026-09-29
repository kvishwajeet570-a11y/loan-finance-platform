"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const systemSetting_controller_1 = require("../../controllers/systemSetting/systemSetting.controller");
const router = (0, express_1.Router)();
/* ======================================================
   CREATE
====================================================== */
router.post("/", systemSetting_controller_1.createSystemSetting);
/* ======================================================
   GET ALL
====================================================== */
router.get("/", systemSetting_controller_1.getAllSystemSettings);
/* ======================================================
   GET BY KEY
====================================================== */
router.get("/key/:key", systemSetting_controller_1.getSystemSettingByKey);
/* ======================================================
   GET BY ID
====================================================== */
router.get("/:id", systemSetting_controller_1.getSystemSettingById);
/* ======================================================
   UPDATE
====================================================== */
router.put("/:id", systemSetting_controller_1.updateSystemSetting);
/* ======================================================
   DELETE
====================================================== */
router.delete("/:id", systemSetting_controller_1.deleteSystemSetting);
/* ======================================================
   BULK UPDATE
====================================================== */
router.put("/bulk/update", systemSetting_controller_1.bulkUpdateSystemSettings);
/* ======================================================
   TOGGLE STATUS
====================================================== */
router.patch("/:id/status", systemSetting_controller_1.toggleSystemSettingStatus);
/* ======================================================
   TOGGLE ENCRYPTION
====================================================== */
router.patch("/:id/encryption", systemSetting_controller_1.toggleEncryption);
exports.default = router;
