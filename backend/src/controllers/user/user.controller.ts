import { Request, Response } from "express";
import prisma from "../../config/prisma";
import bcrypt from "bcryptjs";

/**
 * GET ALL USERS
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const search =
      String(req.query.search || "");

    const users =
      await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phoneNo: {
                contains: search,
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNo: true,
          role: true,
          isVerified: true,
          isBlocked: true,
          createdAt: true,
        },
      });

    const total =
      await prisma.user.count();

    res.status(200).json({
      success: true,
      page,
      total,
      data: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error,
    });

  }
};

/**
 * GET USER BY ID
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          loans: true,
        },
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * CREATE USER
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      name,
      email,
      phoneNo,
      password,
      role,
    } = req.body;

    const exists =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { phoneNo },
          ],
        },
      });

    if (exists) {

      res.status(400).json({
        success: false,
        message:
          "User already exists",
      });

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          phoneNo,
          password:
            hashedPassword,
          role,
        },
      });

    res.status(201).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UPDATE USER
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * BLOCK USER
 */
export const blockUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isBlocked: true,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * UNBLOCK USER
 */
export const unblockUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isBlocked: false,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * VERIFY USER
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const user =
      await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isVerified: true,
        },
      });

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};

/**
 * USER ANALYTICS
 */
export const userAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const [
      totalUsers,
      verifiedUsers,
      blockedUsers,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.user.count({
        where: {
          isVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          isBlocked: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        blockedUsers,
      },
    });

  } catch {

    res.status(500).json({
      success: false,
    });

  }
};