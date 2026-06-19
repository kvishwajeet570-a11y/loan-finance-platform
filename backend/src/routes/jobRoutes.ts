import express
from "express";

import {

  createJobApplication,
  getJobApplications,
  getSingleApplication,
  updateJobStatus,
  deleteJobApplication,

} from
"../controllers/jobController";


const router =
  express.Router();


/* ========================================
   CREATE JOB APPLICATION
======================================== */

router.post(

  "/create",

  createJobApplication

);


/* ========================================
   GET ALL JOB APPLICATIONS
======================================== */

router.get(

  "/all",

  getJobApplications

);


/* ========================================
   GET SINGLE APPLICATION
======================================== */

router.get(

  "/:id",

  getSingleApplication

);


/* ========================================
   UPDATE JOB STATUS
======================================== */

router.put(

  "/update/:id",

  updateJobStatus

);


/* ========================================
   DELETE APPLICATION
======================================== */

router.delete(

  "/delete/:id",

  deleteJobApplication

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
        "Job route working successfully",

    });

  }

);


export default router;