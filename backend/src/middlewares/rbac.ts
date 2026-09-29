import { Request, Response, NextFunction } from "express";

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

const normalizeRole = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

export const rbac =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const currentRole = normalizeRole(req.user.role);
      const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

      if (!normalizedAllowedRoles.includes(currentRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        });
      }

      next();
    } catch (error) {
      console.error("RBAC Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

export default rbac;
