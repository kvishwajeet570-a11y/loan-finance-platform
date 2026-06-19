import express from "express";

import {

  applyLoan,
  getAllLoans,
  getSingleLoan,
  approveLoan,
  rejectLoan,
  deleteLoan,

} from "../controllers/loanController";


const router =
  express.Router();


/* ========================================
   APPLY LOAN
======================================== */

router.post(

  "/apply",

  applyLoan

);


/* ========================================
   GET ALL LOANS
======================================== */

router.get(

  "/all",

  getAllLoans

);


/* ========================================
   GET SINGLE LOAN
======================================== */

router.get(

  "/:id",

  getSingleLoan

);


/* ========================================
   APPROVE LOAN
======================================== */

router.put(

  "/approve/:id",

  approveLoan

);


/* ========================================
   REJECT LOAN
======================================== */

router.put(

  "/reject/:id",

  rejectLoan

);


/* ========================================
   DELETE LOAN
======================================== */

router.delete(

  "/delete/:id",

  deleteLoan

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
        "Loan Route Working Successfully",

    });

  }

);


export default router;