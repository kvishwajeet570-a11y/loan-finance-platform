import express from "express";

import {

  getLeaderboard,

} from "../controllers/leaderboardController";


const router =
  express.Router();


/* ========================================
   GET LEADERBOARD
======================================== */

router.get(

  "/",

  getLeaderboard

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
        "Leaderboard route working successfully",

    });

  }

);


export default router;