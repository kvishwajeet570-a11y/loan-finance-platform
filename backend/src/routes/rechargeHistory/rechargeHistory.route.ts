import { z } from "zod";
import { RechargeStatus, RechargeType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

// Schema for Creating Recharge
export const createRechargeSchema = z.object({
  body: z.object({
  userId: z.string().cuid({ message: "Invalid User ID format" }),
  mobileNumber: z.string().min(10).max(15),
  operator: z.string().min(2),
  rechargeType: z.nativeEnum(RechargeType),
  amount: z.number().positive(),
  planDetails: z.string().optional(),
  serviceType: z.string().optional(),
}),
});

// Schema for Success Status Callback/Webhook
export const markSuccessSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Recharge ID is required"),
  }),
  body: z.object({
    transactionId: z.string().min(1, "Transaction Ref ID is required"),
    operatorTxnId: z.string().optional(),
    commissionAmount: z.number().nonnegative().optional(),
    apiProvider: z.string().optional(),
    apiRequest: z.any().optional(),
    apiResponse: z.any().optional(),
    updatedBy: z.string().optional(),
  }),
});

// Schema for Failure Status Callback/Webhook
export const markFailedSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Recharge ID is required"),
  }),
  body: z.object({
    failureReason: z.string().min(1, "Failure reason is required"),
    remarks: z.string().optional(),
    apiResponse: z.any().optional(),
    updatedBy: z.string().optional(),
  }),
});

// Schema for History Filters Query
export const queryFilterSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
    status: z.nativeEnum(RechargeStatus).optional(),
    userId: z.string().optional(),
    operator: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

// Generic Validation Middleware Runner
export const validate = (schema: z.ZodType) => {  
    return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
  body: req.body,
  query: req.query,
  params: req.params,
}) as {
  body: any;
  query: any;
  params: any;
};
      // Assign parsed values back to request
      (req as any).body = parsed.body;
      (req as any).query = parsed.query;
      (req as any).params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
      return;
    }
  };
};