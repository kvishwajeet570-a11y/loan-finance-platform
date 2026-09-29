"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.queryFilterSchema = exports.markFailedSchema = exports.markSuccessSchema = exports.createRechargeSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Schema for Creating Recharge
exports.createRechargeSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().cuid({ message: "Invalid User ID format" }),
        mobileNumber: zod_1.z.string().min(10).max(15),
        operator: zod_1.z.string().min(2),
        rechargeType: zod_1.z.nativeEnum(client_1.RechargeType),
        amount: zod_1.z.number().positive(),
        planDetails: zod_1.z.string().optional(),
        serviceType: zod_1.z.string().optional(),
    }),
});
// Schema for Success Status Callback/Webhook
exports.markSuccessSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Recharge ID is required"),
    }),
    body: zod_1.z.object({
        transactionId: zod_1.z.string().min(1, "Transaction Ref ID is required"),
        operatorTxnId: zod_1.z.string().optional(),
        commissionAmount: zod_1.z.number().nonnegative().optional(),
        apiProvider: zod_1.z.string().optional(),
        apiRequest: zod_1.z.any().optional(),
        apiResponse: zod_1.z.any().optional(),
        updatedBy: zod_1.z.string().optional(),
    }),
});
// Schema for Failure Status Callback/Webhook
exports.markFailedSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Recharge ID is required"),
    }),
    body: zod_1.z.object({
        failureReason: zod_1.z.string().min(1, "Failure reason is required"),
        remarks: zod_1.z.string().optional(),
        apiResponse: zod_1.z.any().optional(),
        updatedBy: zod_1.z.string().optional(),
    }),
});
// Schema for History Filters Query
exports.queryFilterSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().default(20),
        status: zod_1.z.nativeEnum(client_1.RechargeStatus).optional(),
        userId: zod_1.z.string().optional(),
        operator: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
// Generic Validation Middleware Runner
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Assign parsed values back to request
            req.body = parsed.body;
            req.query = parsed.query;
            req.params = parsed.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
exports.validate = validate;
