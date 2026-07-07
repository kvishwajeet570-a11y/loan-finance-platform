import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const rbac =
  (...allowedRoles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !allowedRoles.includes(req.user.role)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default rbac;