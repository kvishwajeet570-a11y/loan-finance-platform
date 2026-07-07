import { Request, Response, NextFunction } from "express";

export const permit =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as any;

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
          message: "Access Denied",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "Permission check failed",
      });
    }
  };