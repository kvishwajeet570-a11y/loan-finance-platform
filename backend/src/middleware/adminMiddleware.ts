import { Request, Response, NextFunction } from "express";

import prisma from "../prisma/prisma";


interface CustomRequest
  extends Request {

  userId?: string;

}


const adminMiddleware =
  async (

    req: CustomRequest,

    res: Response,

    next: NextFunction

  ) => {

    try {

      const user =
        await prisma.user.findUnique({

          where: {

            id: req.userId,

          },

        });


      if (

        !user ||

        user.role !== "admin"

      ) {

        return res.status(403).json({

          success: false,

          message:
            "Admin Access Only",

        });

      }


      next();

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Middleware Error",

        });

    }

  };


export default adminMiddleware;