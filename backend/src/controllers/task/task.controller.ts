import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET TASKS
======================================== */

export const getTasks =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* ========================================
         FETCH LOANS
      ======================================== */

      const loans =
        await prisma.loanApplication.findMany({

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         FETCH RECHARGES
      ======================================== */

      const recharges =
        await prisma.recharge.findMany({

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         FETCH SUPPORT TICKETS
      ======================================== */

      const supportTickets =
        await prisma.supportTicket.findMany({

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         TASK ARRAY
      ======================================== */

      const tasks: any[] = [];


      /* ========================================
         LOAN TASKS
      ======================================== */

      loans.forEach((loan) => {

        if (

          loan.status === "pending"

        ) {

          tasks.push({

            id: loan.id,

            type: "loan",

            priority: "high",

            task:
              `Verify ${loan.fullName}'s loan documents`,

            status:
              loan.status,

            createdAt:
              loan.createdAt,

          });

        }


        if (

          loan.status === "approved"

        ) {

          tasks.push({

            id:
              `${loan.id}-followup`,

            type: "followup",

            priority: "medium",

            task:
              `Follow up with ${loan.fullName}`,

            status:
              loan.status,

            createdAt:
              loan.createdAt,

          });

        }

      });


      /* ========================================
         RECHARGE TASKS
      ======================================== */

      recharges.forEach((recharge) => {

        if (

          recharge.status === "pending"

        ) {

          tasks.push({

            id:
              recharge.id,

            type: "recharge",

            priority: "medium",

            task:
              `Approve recharge request of ₹${recharge.amount}`,

            status:
              recharge.status,

            createdAt:
              recharge.createdAt,

          });

        }

      });


      /* ========================================
         SUPPORT TASKS
      ======================================== */

      supportTickets.forEach((ticket) => {

        if (

          ticket.status === "open"

        ) {

          tasks.push({

            id:
              ticket.id,

            type: "support",

            priority: "high",

            task:
              `Resolve support ticket: ${ticket.subject}`,

            status:
              ticket.status,

            createdAt:
              ticket.createdAt,

          });

        }

      });


      /* ========================================
         SORT TASKS
      ======================================== */

      tasks.sort(

        (a, b) =>

          new Date(b.createdAt).getTime() -

          new Date(a.createdAt).getTime()

      );


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        totalTasks:
          tasks.length,

        tasks,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch tasks",

      });

    }

  };