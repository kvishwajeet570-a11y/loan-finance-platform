import express
from "express";

import {

  getRevenueAnalytics,
  getMonthlyRevenue,

} from
"../controllers/revenueController";


const router =
  express.Router();


/* ========================================
   GET REVENUE ANALYTICS
======================================== */

router.get(

  "/analytics",

  getRevenueAnalytics

);


/* ========================================
   GET MONTHLY REVENUE
======================================== */

router.get(

  "/monthly",

  getMonthlyRevenue

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
        "Revenue route working successfully",

    });

  }

);


export default router;