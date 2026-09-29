import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  ZodError,
  ZodType,
} from "zod";

/* =========================================
   VALIDATION MIDDLEWARE
========================================= */

const validation =
  (schema: ZodType) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Failed",

          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        });
      }

      return next(error);
    }
  };

export default validation;