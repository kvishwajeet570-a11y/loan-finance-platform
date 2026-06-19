import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET LEADERBOARD
======================================== */

export const getLeaderboard =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      /* ========================================
         FETCH APPROVED LOANS
      ======================================== */

      const loans =
        await prisma.loanApplication.findMany({

          where: {

            status: "approved",

          },

          include: {

            user: true,

          },

        });


      /* ========================================
         GROUP USERS
      ======================================== */

      const groupedUsers: any = {};


      loans.forEach((loan) => {

        const userName =

          loan.user?.name ||

          loan.fullName ||

          "Unknown User";


        if (

          groupedUsers[userName]

        ) {

          groupedUsers[userName]

            .totalAmount +=
              loan.amount;

          groupedUsers[userName]

            .totalLoans += 1;

        } else {

          groupedUsers[userName] = {

            name:
              userName,

            totalAmount:
              loan.amount,

            totalLoans: 1,

          };

        }

      });


      /* ========================================
         CREATE LEADERBOARD
      ======================================== */

      const leaderboard =
        Object.values(groupedUsers)

          .map((user: any) => ({

            ...user,

            commission:

              Math.round(

                user.totalAmount * 0.02

              ),

          }))

          .sort(

            (a: any, b: any) =>

              b.totalAmount -

              a.totalAmount

          );


      /* ========================================
         TOP 10 USERS
      ======================================== */

      const topLeaderboard =
        leaderboard.slice(0, 10);


      /* ========================================
         TOTAL BUSINESS
      ======================================== */

      const totalBusiness =
        leaderboard.reduce(

          (

            acc: number,

            item: any

          ) =>

            acc + item.totalAmount,

          0

        );


      /* ========================================
         TOTAL COMMISSION
      ======================================== */

      const totalCommission =
        leaderboard.reduce(

          (

            acc: number,

            item: any

          ) =>

            acc + item.commission,

          0

        );


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        totalUsers:
          leaderboard.length,

        totalBusiness,

        totalCommission,

        leaderboard:
          topLeaderboard,

      });

    } catch (error) {

      console.log(

        "LEADERBOARD ERROR =>",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch leaderboard",

      });

    }

  };