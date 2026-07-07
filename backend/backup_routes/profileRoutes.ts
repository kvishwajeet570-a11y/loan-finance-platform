import express
from "express";

import {

  getUserProfile,
  updateProfile,
  deleteProfile,

} from
"../controllers/profileController";


const router =
  express.Router();


/* ========================================
   GET USER PROFILE
======================================== */

router.get(

  "/:userId",

  getUserProfile

);


/* ========================================
   UPDATE PROFILE
======================================== */

router.put(

  "/update/:userId",

  updateProfile

);


/* ========================================
   DELETE PROFILE
======================================== */

router.delete(

  "/delete/:userId",

  deleteProfile

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
        "Profile route working successfully",

    });

  }

);


export default router;