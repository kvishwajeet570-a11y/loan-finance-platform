import {

  Request,
  Response,

} from "express";

import prisma
from "../prisma/prisma";


/* ========================================
   CREATE SUPPORT TICKET
======================================== */

export const createSupportTicket =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        userId,
        subject,
        message,
        priority,

      } = req.body;


      /* ========================================
         VALIDATION
      ======================================== */

      if (

        !userId ||

        !subject ||

        !message

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const user =
        await prisma.user.findUnique({

          where: {

            id: userId,

          },

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      /* ========================================
         CREATE TICKET
      ======================================== */

      const ticket =
        await prisma.supportTicket.create({

          data: {

            userId,

            subject,

            message,

            priority:
              priority || "medium",

            status: "open",

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Support Ticket Created",

          message:
            `Your support ticket "${subject}" has been created successfully.`,

          type:
            "support",

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(201).json({

        success: true,

        message:
          "Support ticket created successfully",

        ticket,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to create ticket",

      });

    }

  };


/* ========================================
   GET USER TICKETS
======================================== */

export const getUserTickets =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const userId =
        req.params.userId as string;


      /* ========================================
         VALIDATION
      ======================================== */

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      /* ========================================
         FETCH TICKETS
      ======================================== */

      const tickets =
        await prisma.supportTicket.findMany({

          where: {

            userId,

          },

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        count:
          tickets.length,

        tickets,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch tickets",

      });

    }

  };


/* ========================================
   GET ALL SUPPORT TICKETS
======================================== */

export const getAllTickets =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const tickets =
        await prisma.supportTicket.findMany({

          include: {

            user: {

              select: {

                id: true,

                name: true,

                email: true,

              },

            },

          },

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        count:
          tickets.length,

        tickets,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch support tickets",

      });

    }

  };


/* ========================================
   UPDATE TICKET STATUS
======================================== */

export const updateTicketStatus =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const {

        status,
        adminReply,

      } = req.body;


      /* ========================================
         FIND TICKET
      ======================================== */

      const existingTicket =
        await prisma.supportTicket.findUnique({

          where: {

            id,

          },

        });


      if (!existingTicket) {

        return res.status(404).json({

          success: false,

          message:
            "Ticket not found",

        });

      }


      /* ========================================
         UPDATE TICKET
      ======================================== */

      const updatedTicket =
        await prisma.supportTicket.update({

          where: {

            id,

          },

          data: {

            status,

            adminReply,

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      await prisma.notification.create({

        data: {

          userId:
            existingTicket.userId,

          title:
            "Support Ticket Updated",

          message:
            `Your ticket "${existingTicket.subject}" status changed to ${status}.`,

          type:
            "support",

        },

      });


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        message:
          "Ticket updated successfully",

        ticket:
          updatedTicket,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to update ticket",

      });

    }

  };


/* ========================================
   DELETE SUPPORT TICKET
======================================== */

export const deleteTicket =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const ticket =
        await prisma.supportTicket.findUnique({

          where: {

            id,

          },

        });


      if (!ticket) {

        return res.status(404).json({

          success: false,

          message:
            "Ticket not found",

        });

      }


      await prisma.supportTicket.delete({

        where: {

          id,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Support ticket deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete support ticket",

      });

    }

  };