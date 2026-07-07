"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AadhaarVerificationSchema = void 0;
const zod_1 = require("zod");
exports.AadhaarVerificationSchema = zod_1.z.object({
    aadhaarNo: zod_1.z
        .string()
        .trim()
        .regex(/^[2-9]{1}[0-9]{11}$/, "Invalid Aadhaar Number"),
    fullName: zod_1.z
        .string()
        .trim()
        .min(3, "Full Name is required")
        .max(100, "Name too long"),
    dob: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB format must be YYYY-MM-DD"),
    consent: zod_1.z
        .boolean()
        .refine((value) => value === true, {
        message: "User consent is required for Aadhaar verification",
    }),
});
