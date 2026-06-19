import { Request, Response } from "express";

import prisma from "../prisma/prisma";


/* ========================================
   CREATE COUPON
======================================== */

export const createCoupon = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      code,
      discount,
      expiryDate,
      maxUsage,

    } = req.body;


    /* ========================================
       VALIDATION
    ======================================== */

    if (

      !code ||

      !discount ||

      !expiryDate

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required",

      });

    }


    /* ========================================
       CHECK EXISTING COUPON
    ======================================== */

    const existingCoupon =
      await prisma.coupon.findUnique({

        where: {

          code,

        },

      });


    if (existingCoupon) {

      return res.status(400).json({

        success: false,

        message:
          "Coupon already exists",

      });

    }


    /* ========================================
       CREATE COUPON
    ======================================== */

    const coupon =
      await prisma.coupon.create({

        data: {

          code:

            code.toUpperCase(),

          discount:
            Number(discount),

          expiryDate:
            new Date(expiryDate),

          maxUsage:
            maxUsage || 100,

          usedCount: 0,

          isActive: true,

        },

      });


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(201).json({

      success: true,

      message:
        "Coupon created successfully",

      coupon,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to create coupon",

    });

  }

};


/* ========================================
   GET ALL COUPONS
======================================== */

export const getCoupons = async (

  req: Request,

  res: Response

) => {

  try {

    const coupons =
      await prisma.coupon.findMany({

        orderBy: {

          createdAt: "desc",

        },

      });


    return res.status(200).json({

      success: true,

      totalCoupons:
        coupons.length,

      coupons,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch coupons",

    });

  }

};


/* ========================================
   APPLY COUPON
======================================== */

export const applyCoupon = async (

  req: Request,

  res: Response

) => {

  try {

    const {

      code,
      userId,

    } = req.body;


    /* ========================================
       VALIDATION
    ======================================== */

    if (!code) {

      return res.status(400).json({

        success: false,

        message:
          "Coupon code is required",

      });

    }


    /* ========================================
       FIND COUPON
    ======================================== */

    const coupon =
      await prisma.coupon.findUnique({

        where: {

          code:
            code.toUpperCase(),

        },

      });


    if (!coupon) {

      return res.status(404).json({

        success: false,

        message:
          "Invalid coupon code",

      });

    }


    /* ========================================
       CHECK ACTIVE
    ======================================== */

    if (!coupon.isActive) {

      return res.status(400).json({

        success: false,

        message:
          "Coupon is inactive",

      });

    }


    /* ========================================
       CHECK EXPIRY
    ======================================== */

    if (

      new Date() >

      coupon.expiryDate

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Coupon expired",

      });

    }


    /* ========================================
       CHECK USAGE LIMIT
    ======================================== */

    if (

      coupon.usedCount >=

      coupon.maxUsage

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Coupon usage limit reached",

      });

    }


    /* ========================================
       UPDATE USAGE COUNT
    ======================================== */

    await prisma.coupon.update({

      where: {

        id: coupon.id,

      },

      data: {

        usedCount: {

          increment: 1,

        },

      },

    });


    /* ========================================
       CREATE NOTIFICATION
    ======================================== */

    if (userId) {

      await prisma.notification.create({

        data: {

          userId,

          title:
            "Coupon Applied",

          message:
            `${coupon.code} coupon applied successfully`,

          type:
            "coupon",

        },

      });

    }


    /* ========================================
       RESPONSE
    ======================================== */

    return res.status(200).json({

      success: true,

      message:
        "Coupon applied successfully",

      discount:
        coupon.discount,

      coupon,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to apply coupon",

    });

  }

};


/* ========================================
   DELETE COUPON
======================================== */

export const deleteCoupon = async (

  req: Request,

  res: Response

) => {

  try {

    const id =
      req.params.id as string;


    const coupon =
      await prisma.coupon.findUnique({

        where: {

          id,

        },

      });


    if (!coupon) {

      return res.status(404).json({

        success: false,

        message:
          "Coupon not found",

      });

    }


    await prisma.coupon.delete({

      where: {

        id,

      },

    });


    return res.status(200).json({

      success: true,

      message:
        "Coupon deleted successfully",

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete coupon",

    });

  }

};