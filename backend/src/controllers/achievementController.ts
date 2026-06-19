import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   GET ACHIEVEMENTS
======================================== */

export const getAchievements =
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
         FETCH ACHIEVEMENTS
      ======================================== */

      const achievements =
        await prisma.achievement.findMany({

          where:

            userId

              ? {

                  userId,

                }

              : undefined,

          orderBy: {

            createdAt: "desc",

          },

        });


      /* ========================================
         TOTAL REWARDS
      ======================================== */

      const totalRewards =
        achievements.reduce(

          (acc, item) =>

            acc + item.reward,

          0

        );


      /* ========================================
         TOTAL ACHIEVEMENTS
      ======================================== */

      const totalAchievements =
        achievements.length;


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(200).json({

        success: true,

        totalAchievements,

        totalRewards,

        achievements,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch achievements",

      });

    }

  };