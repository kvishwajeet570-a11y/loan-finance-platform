import express from "express";

import {

  getWallet,
  addMoney,
  withdrawMoney,
  getWalletHistory,

} from "../controllers/walletController";


const router =
  express.Router();


/* ========================================
   GET WALLET
======================================== */

router.get(

  "/:userId",

  getWallet

);


/* ========================================
   ADD MONEY
======================================== */

router.post(

  "/add-money",

  addMoney

);


/* ========================================
   WITHDRAW MONEY
======================================== */

router.post(

  "/withdraw-money",

  withdrawMoney

);


/* ========================================
   WALLET HISTORY
======================================== */

router.get(

  "/history/:userId",

  getWalletHistory

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
        "Wallet route working successfully",

    });

  }

);


export default router;