import { z } from "zod";

/* =========================================
   CONTACT TYPE
========================================= */

export const contactTypeEnum = z.enum([
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

export const contactStatusEnum = z.enum([
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "RESOLVED",
  "CLOSED",
]);

/* =========================================
   CREATE CONTACT
========================================= */

export const createContactSchema = z.object({
  fullName: z
    .string()
    .min(3)
    .max(100),

  email: z
    .email()
    .optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/),

  subject: z
    .string()
    .min(5)
    .max(200),

  message: z
    .string()
    .min(10)
    .max(2000),

  type: contactTypeEnum,

  city: z.string().optional(),

  state: z.string().optional(),

  loanAmount: z.number().optional(),
});

/* =========================================
   UPDATE CONTACT STATUS
========================================= */

export const updateContactStatusSchema =
  z.object({
    contactId: z.string().cuid(),

    status: contactStatusEnum,

    remarks: z
      .string()
      .max(500)
      .optional(),
  });

/* =========================================
   ASSIGN CONTACT
========================================= */

export const assignContactSchema =
  z.object({
    contactId: z.string().cuid(),

    assignedTo: z.string().cuid(),
  });

/* =========================================
   CONTACT FILTER
========================================= */

export const contactFilterSchema =
  z.object({
    search: z.string().optional(),

    type: contactTypeEnum.optional(),

    status: contactStatusEnum.optional(),

    assignedTo: z.string().cuid().optional(),

    startDate: z.string().optional(),

    endDate: z.string().optional(),

    page: z.coerce.number().default(1),

    limit: z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   CALLBACK REQUEST
========================================= */

export const callbackRequestSchema =
  z.object({
    name: z.string().min(3),

    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/),

    preferredTime: z.string().optional(),

    remarks: z.string().optional(),
  });

/* =========================================
   TYPES
========================================= */

export type CreateContactDto =
  z.infer<typeof createContactSchema>;

export type UpdateContactStatusDto =
  z.infer<typeof updateContactStatusSchema>;

export type AssignContactDto =
  z.infer<typeof assignContactSchema>;

export type ContactFilterDto =
  z.infer<typeof contactFilterSchema>;

export type CallbackRequestDto =
  z.infer<typeof callbackRequestSchema>;