import express from "express";

import {

  getTasks,

} from "../controllers/taskController";


const router =
  express.Router();


/* ========================================
   GET TASKS
======================================== */

router.get(

  "/",

  getTasks

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
        "Task route working successfully",

    });

  }

);


export default router;