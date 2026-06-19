import express
from "express";

import {

  createSupportTicket,
  getUserTickets,
  updateTicketStatus,

} from
"../controllers/supportController";


const router =
  express.Router();


/* ========================================
   CREATE SUPPORT TICKET
======================================== */

router.post(

  "/create",

  createSupportTicket

);


/* ========================================
   GET USER TICKETS
======================================== */

router.get(

  "/:userId",

  getUserTickets

);


/* ========================================
   UPDATE TICKET STATUS
======================================== */

router.put(

  "/update/:id",

  updateTicketStatus

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
        "Support route working successfully",

    });

  }

);


export default router;