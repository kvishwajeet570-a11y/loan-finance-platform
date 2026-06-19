import express from "express";

import {

  sendMessage,

} from "../controllers/contactController";


const router =
  express.Router();


/* ========================================
   SEND CONTACT MESSAGE
======================================== */

router.post(

  "/send",

  sendMessage

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
        "Contact route working successfully",

    });

  }

);


export default router;