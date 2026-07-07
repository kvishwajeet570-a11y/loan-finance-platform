import express from "express";

import {

  createReferral,
  getReferral,
  applyReferralCode,

} from "../controllers/referralController";


const router =
  express.Router();


/* ========================================
   CREATE REFERRAL
======================================== */

router.post(

  "/create",

  createReferral

);


/* ========================================
   GET REFERRAL
======================================== */

router.get(

  "/:userId",

  getReferral

);


/* ========================================
   APPLY REFERRAL CODE
======================================== */

router.post(

  "/apply-code",

  applyReferralCode

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
        "Referral route working successfully",

    });

  }

);


export default router;