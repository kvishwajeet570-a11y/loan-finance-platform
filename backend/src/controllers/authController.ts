import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import prisma from "../prisma/prisma";

import { sendEmail } from "../utils/sendEmail";

import rateLimit from "express-rate-limit";

const otpGenerator =
  require("otp-generator");

/* ========================================
   OTP RATE LIMITER
======================================== */

export const otpLimiter =
  rateLimit({

    windowMs:
      1 * 60 * 1000,

    max: 5,

    message: {

      success: false,

      message:
        "Too many OTP requests. Try again after 1 minute.",

    },

  });

/* ========================================
   EMAIL VALIDATION
======================================== */

const validateEmail = (
  email: string
) => {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(
    email
  );

};

/* ========================================
   GENERATE OTP
======================================== */

const generateOTP =
  () => {

    return otpGenerator.generate(

      6,

      {

        upperCaseAlphabets:
          false,

        lowerCaseAlphabets:
          false,

        specialChars:
          false,

      }

    );

  };

/* ========================================
   SEND REGISTER OTP
======================================== */

export const sendRegisterOtp =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const { email } =
        req.body;

      /* VALIDATION */

      if (!email) {

        return res.status(400).json({

          success: false,

          message:
            "Email is required",

        });

      }

      if (

        !validateEmail(email)

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid email address",

        });

      }

      /* CHECK EXISTING USER */

      const existingUser =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      /* USER ALREADY REGISTERED */

      if (

        existingUser &&

        existingUser.password

      ) {

        return res.status(200).json({

          success: true,

          alreadyRegistered:
            true,

          message:
            "Account already exists. Please login.",

        });

      }

      /* OTP COOLDOWN */
      /*

      if (

        existingUser?.otpExpiry &&

        existingUser.otpExpiry >
          new Date()

      ) {

        return res.status(429).json({

          success: false,

          message:
            "OTP already sent. Please wait 5 minutes.",

        });

      }

      /*
      /* GENERATE OTP */

      const otp =
        generateOTP();

      const otpExpiry =
        new Date(

          Date.now() +

          5 * 60 * 1000

        );

      /* SAVE USER */

const existingUserRecord =
  await prisma.user.findUnique({

    where: {

      email,

    },

  });

if (existingUserRecord) {

  await prisma.user.update({

    where: {

      email,

    },

    data: {

      otp,

      otpExpiry,

      isVerified:
        false,

    },

  });

} else {

  await prisma.user.create({

    data: {

      name:
        "Pending User",

      email,

      phoneNo:
        `TEMP_${Date.now()}`,

      password:
        "",

      otp,

      otpExpiry,

      isVerified:
        false,

    },

  });

}
      /* SEND EMAIL */

      await sendEmail(

        email,

        "Register OTP",

        `Your OTP is ${otp}`

      );

      return res.status(200).json({

        success: true,

        message:
          "OTP sent successfully",

      });

    } catch (error) {

      console.log(

        "SEND OTP ERROR =>",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to send OTP",

      });

    }

  };

/* ========================================
   VERIFY REGISTER OTP
======================================== */

export const verifyRegisterOtp =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        email,
        otp,

      } = req.body;

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      /* INVALID OTP */

      if (

        user.otp !== otp

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",

        });

      }

      /* OTP EXPIRED */

      if (

        !user.otpExpiry ||

        user.otpExpiry <
          new Date()

      ) {

        return res.status(400).json({

          success: false,

          message:
            "OTP expired",

        });

      }

      /* VERIFY */

      await prisma.user.update({

        where: {

          email,

        },

        data: {

          isVerified:
            true,

          otp: null,

          otpExpiry:
            null,

        },

      });

      return res.status(200).json({

        success: true,

        message:
          "OTP verified successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "OTP verification failed",

      });

    }

  };

/* ========================================
   REGISTER USER
======================================== */

export const registerUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        name,
        email,
        phoneNo,
        password,

      } = req.body;

      /* VALIDATION */

      if (

        !name ||

        !email ||

        !phoneNo ||

        !password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "Please verify OTP first",

        });

      }

      /* ALREADY REGISTERED */

      if (

        user.password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "User already registered",

        });

      }

      /* EMAIL NOT VERIFIED */

      if (

        !user.isVerified

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email not verified",

        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );

      /* UPDATE USER */

      const updatedUser =
        await prisma.user.update({

          where: {

            email,

          },

          data: {

            name,

            phoneNo,

            password:
              hashedPassword,

          },

        });

      return res.status(201).json({

        success: true,

        message:
          "User registered successfully",

        user:
          updatedUser,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Registration failed",

      });

    }

  };

/* ========================================
   LOGIN USER
======================================== */

export const loginUser =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        email,
        password,

      } = req.body;

      /* VALIDATION */

      if (

        !email ||

        !password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password are required",

        });

      }

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      /* BLOCK CHECK */

      if (user.isBlocked) {

        return res.status(403).json({

          success: false,

          message:
            "Your account is blocked",

        });

      }

      /* EMPTY PASSWORD */

      if (!user.password) {

        return res.status(400).json({

          success: false,

          message:
            "Please complete registration first",

        });

      }

      /* PASSWORD CHECK */

      const isPasswordCorrect =
        await bcrypt.compare(

          password,

          user.password

        );

      if (

        !isPasswordCorrect

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid password",

        });

      }

      /* JWT */

      const token =
        jwt.sign(

          {

            id: user.id,

            email:
              user.email,

            role:
              user.role,

          },

          process.env.JWT_SECRET!,

          {

            expiresIn:
              "7d",

          }

        );

      return res.status(200).json({

        success: true,

        message:
          "Login successful",

        token,

        user,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Login failed",

      });

    }

  };

/* ========================================
   FORGOT PASSWORD
======================================== */

export const forgotPassword =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const { email } =
        req.body;

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      /* GENERATE OTP */

      const otp =
        generateOTP();

      const otpExpiry =
        new Date(

          Date.now() +

          5 * 60 * 1000

        );

      /* SAVE OTP */

      await prisma.user.update({

        where: {

          email,

        },

        data: {

          otp,

          otpExpiry,

        },

      });

      /* SEND EMAIL */

      await sendEmail(

        email,

        "Reset Password OTP",

        `Your OTP is ${otp}`

      );

      return res.status(200).json({

        success: true,

        message:
          "OTP sent successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to send OTP",

      });

    }

  };

/* ========================================
   RESET PASSWORD
======================================== */

export const resetPassword =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        email,
        otp,
        password,

      } = req.body;

      /* FIND USER */

      const user =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }

      /* OTP CHECK */

      if (

        user.otp !== otp

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",

        });

      }

      /* OTP EXPIRED */

      if (

        !user.otpExpiry ||

        user.otpExpiry <
          new Date()

      ) {

        return res.status(400).json({

          success: false,

          message:
            "OTP expired",

        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(

          password,

          10

        );

      /* UPDATE PASSWORD */

      await prisma.user.update({

        where: {

          email,

        },

        data: {

          password:
            hashedPassword,

          otp: null,

          otpExpiry:
            null,

        },

      });

      return res.status(200).json({

        success: true,

        message:
          "Password reset successful",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Reset password failed",

      });

    }

  };

/* ========================================
   DELETE ACCOUNT
======================================== */

export const deleteAccount =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;

      await prisma.user.delete({

        where: {

          id,

        },

      });

      return res.status(200).json({

        success: true,

        message:
          "Account deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Delete account failed",

      });

    }

  };