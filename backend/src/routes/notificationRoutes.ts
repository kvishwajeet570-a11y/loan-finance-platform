import express from "express";

import {

  getNotifications,

} from "../controllers/notificationController";


const router =
  express.Router();


/* ========================================
   GET NOTIFICATIONS
======================================== */

router.get(

  "/",

  getNotifications

);


/* ========================================
   HEALTH CHECK
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
        "Notification route working successfully",

    });

  }

);


export default router;