import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET COMMISSION
======================================== */

export const getCommission =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* ========================================
         GET USER ID
      ======================================== */

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
         FETCH COMMISSIONS
      ======================================== */

      const commissions =
        await prisma.commission.findMany({

          where: {

            userId,

          },

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         TOTAL COMMISSION
      ======================================== */

      const totalCommission =
        commissions.reduce(

          (acc, item) =>

            acc + item.amount,

          0

        );


      /* ========================================
         MONTHLY COMMISSION
      ======================================== */

      const currentMonth =
        new Date().getMonth();

      const currentYear =
        new Date().getFullYear();


      const monthlyCommission =
        commissions

          .filter((item) => {

            const date =
              new Date(item.createdAt);

            return (

              date.getMonth() ===
                currentMonth &&

              date.getFullYear() ===
                currentYear

            );

          })

          .reduce(

            (acc, item) =>

              acc + item.amount,

            0

          );


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        totalCommission,

        monthlyCommission,

        totalRecords:
          commissions.length,

        commissions,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch commission",

      });

    }

  };