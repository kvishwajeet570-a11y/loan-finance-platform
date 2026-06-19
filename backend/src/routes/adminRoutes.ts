import express from "express";

import {

  getUsers,
  blockUser,
  unblockUser,

} from "../controllers/adminController";


const router =
  express.Router();


/* ========================================
   GET USERS
======================================== */

router.get(

  "/users",

  getUsers

);


/* ========================================
   BLOCK USER
======================================== */

router.post(

  "/block-user",

  blockUser

);


/* ========================================
   UNBLOCK USER
======================================== */

router.post(

  "/unblock-user",

  unblockUser

);


export default router;