"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobAnalyticsSchema = exports.jobFilterSchema = exports.scheduleInterviewSchema = exports.updateApplicationStatusSchema = exports.applyJobSchema = exports.updateJobSchema = exports.createJobSchema = exports.applicationStatusEnum = exports.jobStatusEnum = exports.jobTypeEnum = void 0;
const zod_1 = require("zod");
/* =========================================
   JOB TYPE
========================================= */
exports.jobTypeEnum = zod_1.z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "INTERNSHIP",
    "FREELANCE",
]);
/* =========================================
   JOB STATUS
========================================= */
exports.jobStatusEnum = zod_1.z.enum([
    "DRAFT",
    "OPEN",
    "CLOSED",
    "ON_HOLD",
    "FILLED",
]);
/* =========================================
   APPLICATION STATUS
========================================= */
exports.applicationStatusEnum = zod_1.z.enum([
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
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(3)
        .max(200),
    department: zod_1.z.enum([
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
    jobType: exports.jobTypeEnum,
    location: zod_1.z.string()
        .min(2)
        .max(150),
    openings: zod_1.z.number()
        .int()
        .positive(),
    minExperience: zod_1.z.number().min(0),
    maxExperience: zod_1.z.number().min(0),
    minSalary: zod_1.z.number().optional(),
    maxSalary: zod_1.z.number().optional(),
    description: zod_1.z.string().min(20),
    skills: zod_1.z.array(zod_1.z.string())
        .min(1),
    status: exports.jobStatusEnum.default("OPEN"),
    lastDateToApply: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE JOB
========================================= */
exports.updateJobSchema = exports.createJobSchema.partial();
/* =========================================
   APPLY JOB
========================================= */
exports.applyJobSchema = zod_1.z.object({
    jobId: zod_1.z.string().cuid(),
    fullName: zod_1.z.string()
        .min(3)
        .max(100),
    email: zod_1.z.email(),
    mobileNumber: zod_1.z.string()
        .regex(/^[6-9]\d{9}$/),
    experience: zod_1.z.number().min(0),
    currentCompany: zod_1.z.string().optional(),
    currentCTC: zod_1.z.number().optional(),
    expectedCTC: zod_1.z.number().optional(),
    resumeUrl: zod_1.z.string().url(),
    coverLetter: zod_1.z.string().optional(),
});
/* =========================================
   UPDATE APPLICATION STATUS
========================================= */
exports.updateApplicationStatusSchema = zod_1.z.object({
    applicationId: zod_1.z.string().cuid(),
    status: exports.applicationStatusEnum,
    remarks: zod_1.z.string().optional(),
});
/* =========================================
   INTERVIEW SCHEDULE
========================================= */
exports.scheduleInterviewSchema = zod_1.z.object({
    applicationId: zod_1.z.string().cuid(),
    interviewDate: zod_1.z.string(),
    interviewMode: zod_1.z.enum([
        "ONLINE",
        "OFFLINE",
    ]),
    interviewer: zod_1.z.string(),
    meetingLink: zod_1.z.string().optional(),
});
/* =========================================
   JOB FILTER
========================================= */
exports.jobFilterSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    jobType: exports.jobTypeEnum.optional(),
    status: exports.jobStatusEnum.optional(),
    page: zod_1.z.coerce.number()
        .default(1),
    limit: zod_1.z.coerce.number()
        .min(1)
        .max(100)
        .default(10),
});
/* =========================================
   JOB ANALYTICS
========================================= */
exports.jobAnalyticsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
