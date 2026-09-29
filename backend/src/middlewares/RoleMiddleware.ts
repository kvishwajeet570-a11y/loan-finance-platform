import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        permissions: string[];
      };
    }
  }
}

const roleMiddleware =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          requiredRoles: allowedRoles,
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

export default roleMiddleware;
