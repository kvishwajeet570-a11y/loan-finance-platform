import { Request, Response } from "express";

import prisma from "../prisma/prisma";


export const getNotifications =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const notifications =
        await prisma.notification.findMany({

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        notifications,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch notifications",

      });

    }

  };