import express from "express";

import {

  getAnalytics,

} from "../controllers/analyticsController";


const router =
  express.Router();


/* ========================================
   GET ANALYTICS
======================================== */

router.get(

  "/dashboard",

  getAnalytics

);


export default router;