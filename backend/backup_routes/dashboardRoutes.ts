import express from "express";

import {

  getDashboardStats,

} from "../controllers/dashboardController";


const router =
  express.Router();


/* ========================================
   GET DASHBOARD STATS
======================================== */

router.get(

  "/",

  getDashboardStats

);


/* ========================================
   DASHBOARD HEALTH CHECK
======================================== */

router.get(

  "/health",

  (

    req,

    res

  ) => {

    return res.status(200).json({

      success: true,

      message:
        "Dashboard route working successfully",

    });

  }

);


export default router;