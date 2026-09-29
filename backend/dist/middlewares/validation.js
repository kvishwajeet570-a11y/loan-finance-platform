"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
/* =========================================
   VALIDATION MIDDLEWARE
========================================= */
const validation = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
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
exports.default = validation;
