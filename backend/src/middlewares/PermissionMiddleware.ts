import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        permissions?: string[];
      };
    }
  }
}

const permissionMiddleware =
  (...requiredPermissions: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userPermissions = req.user.permissions || [];

      const hasPermission = requiredPermissions.every(
        permission => userPermissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
          requiredPermissions,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default permissionMiddleware;