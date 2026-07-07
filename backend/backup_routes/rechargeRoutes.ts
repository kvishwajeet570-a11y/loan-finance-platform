import express from "express";

import {

  createRecharge,
  getUserRecharges,

} from "../controllers/rechargeController";


const router =
  express.Router();


/* ========================================
   CREATE RECHARGE
======================================== */

router.post(

  "/create",

  createRecharge

);


/* ========================================
   GET USER RECHARGES
======================================== */

router.get(

  "/:userId",

  getUserRecharges

);


/* ========================================
   HEALTH CHECK
======================================== */

router.get(

  "/health/check",

  (

    req,

    res

  ) => {

    return res.status(200).json({

      success: true,

      message:
        "Recharge route working successfully",

    });

  }

);


export default router;