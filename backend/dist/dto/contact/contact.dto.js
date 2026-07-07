"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackRequestSchema = exports.contactFilterSchema = exports.assignContactSchema = exports.updateContactStatusSchema = exports.createContactSchema = exports.contactStatusEnum = exports.contactTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   CONTACT TYPE
========================================= */
exports.contactTypeEnum = zod_1.z.enum([
    "GENERAL",
    "LOAN_ENQUIRY",
    "INSURANCE_ENQUIRY",
    "CREDIT_CARD",
    "BUSINESS_LOAN",
    "HOME_LOAN",
    "SUPPORT",
    "COMPLAINT",
    "CALLBACK_REQUEST",
]);
/* =========================================
   CONTACT STATUS
========================================= */
exports.contactStatusEnum = zod_1.z.enum([
    "NEW",
    "IN_PROGRESS",
    "CONTACTED",
    "RESOLVED",
    "CLOSED",
]);
/* =========================================
   CREATE CONTACT
========================================= */
exports.createContactSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .min(3)
        .max(100),
    email: zod_1.z
        .email()
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    subject: zod_1.z
        .string()
        .min(5)
        .max(200),
    message: zod_1.z
        .string()
        .min(10)
        .max(2000),
    type: exports.contactTypeEnum,
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    loanAmount: zod_1.z.number().optional(),
});
/* =========================================
   UPDATE CONTACT STATUS
========================================= */
exports.updateContactStatusSchema = zod_1.z.object({
    contactId: zod_1.z.string().cuid(),
    status: exports.contactStatusEnum,
    remarks: zod_1.z
        .string()
        .max(500)
        .optional(),
});
/* =========================================
   ASSIGN CONTACT
========================================= */
exports.assignContactSchema = zod_1.z.object({
    contactId: zod_1.z.string().cuid(),
    assignedTo: zod_1.z.string().cuid(),
});
/* =========================================
   CONTACT FILTER
========================================= */
exports.contactFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    type: exports.contactTypeEnum.optional(),
    status: exports.contactStatusEnum.optional(),
    assignedTo: zod_1.z.string().cuid().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   CALLBACK REQUEST
========================================= */
exports.callbackRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/),
    preferredTime: zod_1.z.string().optional(),
    remarks: zod_1.z.string().optional(),
});
