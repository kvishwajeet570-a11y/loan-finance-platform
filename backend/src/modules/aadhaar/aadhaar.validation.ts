import { z } from "zod";

export const AadhaarVerificationSchema = z.object({
  aadhaarNo: z
    .string()
    .trim()
    .regex(
      /^[2-9]{1}[0-9]{11}$/,
      "Invalid Aadhaar Number"
    ),

  fullName: z
    .string()
    .trim()
    .min(3, "Full Name is required")
    .max(100, "Name too long"),

  dob: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "DOB format must be YYYY-MM-DD"
    ),

  consent: z
    .boolean()
    .refine(
      (value) => value === true,
      {
        message:
          "User consent is required for Aadhaar verification",
      }
    ),
});

export type AadhaarVerificationDto =
  z.infer<typeof AadhaarVerificationSchema>;