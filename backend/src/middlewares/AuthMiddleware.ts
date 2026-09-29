import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        isVerified: true,

        roleRef: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            isActive: true,
            permissions: {
              where: {
                permission: {
                  status: "ACTIVE",
                },
              },
              select: {
                permission: {
                  select: {
                    code: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },

        userPermissions: {
          where: {
            permission: {
              status: "ACTIVE",
            },
          },
          select: {
            permission: {
              select: {
                code: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }

    const roleValue = String(
      user.role || user.roleRef?.code || ""
    ).toLowerCase();

    /*
     * Super Admin is the highest authority.
     * PermissionMiddleware should not accidentally block
     * Super Admin because of a missing permission record.
     */
    if (
      roleValue === "superadmin" ||
      roleValue === "super_admin" ||
      roleValue === "super-admin" ||
      user.roleRef?.code?.toLowerCase() === "superadmin" ||
      user.roleRef?.slug?.toLowerCase() === "superadmin"
    ) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: ["*"],
      };

      return next();
    }

    const rolePermissions =
      user.roleRef?.permissions?.flatMap((item) => [
        item.permission.code,
        ...(item.permission.slug ? [item.permission.slug] : []),
      ]) || [];

    const userPermissions =
      user.userPermissions.flatMap((item) => [
        item.permission.code,
        ...(item.permission.slug ? [item.permission.slug] : []),
      ]) || [];

    const permissions = Array.from(
      new Set([...rolePermissions, ...userPermissions])
    );

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
