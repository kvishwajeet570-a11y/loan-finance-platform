import { z } from "zod";

/* =========================================
   JOB TYPE
========================================= */

export const jobTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
]);

/* =========================================
   JOB STATUS
========================================= */

export const jobStatusEnum = z.enum([
  "DRAFT",
  "OPEN",
  "CLOSED",
  "ON_HOLD",
  "FILLED",
]);

/* =========================================
   APPLICATION STATUS
========================================= */

export const applicationStatusEnum =
  z.enum([
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "SELECTED",
    "REJECTED",
    "HIRED",
  ]);

/* =========================================
   CREATE JOB
========================================= */

export const createJobSchema =
  z.object({
    title: z.string()
      .min(3)
      .max(200),

    department: z.enum([
      "SALES",
      "OPERATIONS",
      "CREDIT",
      "COLLECTION",
      "HR",
      "MARKETING",
      "IT",
      "SUPPORT",
      "MANAGEMENT",
    ]),

    jobType: jobTypeEnum,

    location: z.string()
      .min(2)
      .max(150),

    openings: z.number()
      .int()
      .positive(),

    minExperience:
      z.number().min(0),

    maxExperience:
      z.number().min(0),

    minSalary:
      z.number().optional(),

    maxSalary:
      z.number().optional(),

    description:
      z.string().min(20),

    skills:
      z.array(z.string())
      .min(1),

    status:
      jobStatusEnum.default("OPEN"),

    lastDateToApply:
      z.string().optional(),
  });

/* =========================================
   UPDATE JOB
========================================= */

export const updateJobSchema =
  createJobSchema.partial();

/* =========================================
   APPLY JOB
========================================= */

export const applyJobSchema =
  z.object({
    jobId: z.string().cuid(),

    fullName: z.string()
      .min(3)
      .max(100),

    email: z.email(),

    mobileNumber: z.string()
      .regex(/^[6-9]\d{9}$/),

    experience:
      z.number().min(0),

    currentCompany:
      z.string().optional(),

    currentCTC:
      z.number().optional(),

    expectedCTC:
      z.number().optional(),

    resumeUrl:
      z.string().url(),

    coverLetter:
      z.string().optional(),
  });

/* =========================================
   UPDATE APPLICATION STATUS
========================================= */

export const updateApplicationStatusSchema =
  z.object({
    applicationId:
      z.string().cuid(),

    status:
      applicationStatusEnum,

    remarks:
      z.string().optional(),
  });

/* =========================================
   INTERVIEW SCHEDULE
========================================= */

export const scheduleInterviewSchema =
  z.object({
    applicationId:
      z.string().cuid(),

    interviewDate:
      z.string(),

    interviewMode:
      z.enum([
        "ONLINE",
        "OFFLINE",
      ]),

    interviewer:
      z.string(),

    meetingLink:
      z.string().optional(),
  });

/* =========================================
   JOB FILTER
========================================= */

export const jobFilterSchema =
  z.object({
    search: z.string().optional(),

    department:
      z.string().optional(),

    jobType:
      jobTypeEnum.optional(),

    status:
      jobStatusEnum.optional(),

    page:
      z.coerce.number()
      .default(1),

    limit:
      z.coerce.number()
      .min(1)
      .max(100)
      .default(10),
  });

/* =========================================
   JOB ANALYTICS
========================================= */

export const jobAnalyticsSchema =
  z.object({
    startDate:
      z.string().optional(),

    endDate:
      z.string().optional(),
  });

/* =========================================
   EXPORT TYPES
========================================= */

export type CreateJobDto =
  z.infer<typeof createJobSchema>;

export type UpdateJobDto =
  z.infer<typeof updateJobSchema>;

export type ApplyJobDto =
  z.infer<typeof applyJobSchema>;

export type UpdateApplicationStatusDto =
  z.infer<
    typeof updateApplicationStatusSchema
  >;

export type ScheduleInterviewDto =
  z.infer<
    typeof scheduleInterviewSchema
  >;

export type JobFilterDto =
  z.infer<typeof jobFilterSchema>;

export type JobAnalyticsDto =
  z.infer<
    typeof jobAnalyticsSchema
  >;