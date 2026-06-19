import express from "express";

import {

  getTransactions,
  createTransaction,
  getSingleTransaction,
  deleteTransaction,

} from "../controllers/transactionController";


const router =
  express.Router();


/* ========================================
   GET ALL TRANSACTIONS
======================================== */

router.get(

  "/wallet/:walletId",

  getTransactions

);


/* ========================================
   CREATE TRANSACTION
======================================== */

router.post(

  "/create",

  createTransaction

);


/* ========================================
   GET SINGLE TRANSACTION
======================================== */

router.get(

  "/single/:id",

  getSingleTransaction

);


/* ========================================
   DELETE TRANSACTION
======================================== */

router.delete(

  "/delete/:id",

  deleteTransaction

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
        "Transaction route working successfully",

    });

  }

);


export default router;