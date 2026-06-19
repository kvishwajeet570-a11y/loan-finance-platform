import express from "express";

import {

  getAchievements,

} from "../controllers/achievementController";


const router =
  express.Router();


/* ========================================
   GET ACHIEVEMENTS
======================================== */

router.get(

  "/",

  getAchievements

);


export default router;