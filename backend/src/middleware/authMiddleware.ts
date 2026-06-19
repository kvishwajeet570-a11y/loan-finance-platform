import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";


interface CustomRequest
  extends Request {

  userId?: string;

}


const authMiddleware = (

  req: CustomRequest,

  res: Response,

  next: NextFunction

) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (

      !authHeader ||

      !authHeader.startsWith("Bearer ")

    ) {

      return res.status(401).json({

        success: false,

        message:
          "Unauthorized Access",

      });

    }


    const token =
      authHeader.split(" ")[1];


    const decoded: any =
      jwt.verify(

        token,

        process.env.JWT_SECRET ||

          "secret"

      );


    req.userId =
      decoded.id;


    next();

  } catch (error) {

    console.log(error);

    return res.status(401).json({

      success: false,

      message:
        "Invalid Token",

    });

  }

};


export default authMiddleware;