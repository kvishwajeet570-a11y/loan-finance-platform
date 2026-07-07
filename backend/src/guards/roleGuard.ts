import {
  Response,
  NextFunction,
} from "express";
import { AuthRequest } from "./auth.guard";

export const roleGuard =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !roles.includes(user.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Role authorization failed",
      });
    }
  };