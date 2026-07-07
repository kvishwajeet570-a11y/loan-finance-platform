import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   SEND CONTACT MESSAGE
======================================== */

export const sendMessage = async (

  req: Request,

  res: Response

) => {

  try {

    /* ========================================
       GET DATA
    ======================================== */

    const {

      name,
      email,
      phone,
      subject,
      message,

    } = req.body;


    /* ========================================
       VALIDATION
    ======================================== */

    if (

      !name ||

      !email ||

      !phone ||

      !message

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required",

      });

    }


    /* ========================================
       EMAIL VALIDATION
    ======================================== */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (

      !emailRegex.test(email)

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email address",

      });

    }


    /* ========================================
       PHONE VALIDATION
    ======================================== */

    if (

      phone.length < 10

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid phone number",

      });

    }


    /* ========================================
       SAVE MESSAGE
    ======================================== */

    const newMessage =
      await prisma.contactMessage.create({

        data: {

          name,

          email,

          phone,

          subject:
            subject || "General Inquiry",

          message,

        },

      });


    /* ========================================
       FIND ADMIN
    ======================================== */

    const admin =
      await prisma.user.findFirst({

        where: {

          role: "admin",

        },

      });


    /* ========================================
       CREATE NOTIFICATION
    ======================================== */

    if (admin) {

      await prisma.notification.create({

        data: {

          userId:
            admin.id,

          title:
            "New Contact Message",

          message:
            `${name} sent a message`,

          type:
            "contact",

        },

      });

    }


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(201).json({

      success: true,

      message:
        "Message sent successfully",

      contactMessage:
        newMessage,

    });

  } catch (error) {

    console.log(

      "CONTACT ERROR =>",

      error

    );

    return res.status(500).json({

      success: false,

      message:
        "Internal server error",

    });

  }

};