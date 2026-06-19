import express from "express";

import {

  getCommission,

} from "../controllers/commissionController";


const router =
  express.Router();


/* ========================================
   GET COMMISSION
======================================== */

router.get(

  "/",

  getCommission

);


export default router;