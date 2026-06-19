"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobApplication = exports.updateJobStatus = exports.getSingleApplication = exports.getJobApplications = exports.createJobApplication = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE JOB APPLICATION
======================================== */
const createJobApplication = async (req, res) => {
    try {
        const { fullName, email, phone, resumeUrl, position, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!fullName ||
            !email ||
            !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           CHECK EXISTING
        ======================================== */
        const existingApplication = await prisma_1.default.jobApplication.findFirst({
            where: {
                email,
            },
        });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "Application already submitted",
            });
        }
        /* ========================================
           CREATE APPLICATION
        ======================================== */
        const application = await prisma_1.default.jobApplication.create({
            data: {
                fullName,
                email,
                phone,
                resumeUrl,
                position: position || "Sales Executive",
                status: "pending",
            },
        });
        /* ========================================
           FIND ADMIN
        ======================================== */
        const admin = await prisma_1.default.user.findFirst({
            where: {
                role: "admin",
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        if (admin) {
            await prisma_1.default.notification.create({
                data: {
                    userId: admin.id,
                    title: "New Job Application",
                    message: `${fullName} applied for ${position || "Sales Executive"}`,
                    type: "career",
                },
            });
        }
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit application",
        });
    }
};
exports.createJobApplication = createJobApplication;
/* ========================================
   GET ALL APPLICATIONS
======================================== */
const getJobApplications = async (req, res) => {
    try {
        const applications = await prisma_1.default.jobApplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
        });
    }
};
exports.getJobApplications = getJobApplications;
/* ========================================
   GET SINGLE APPLICATION
======================================== */
const getSingleApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await prisma_1.default.jobApplication.findUnique({
            where: {
                id,
            },
        });
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        return res.status(200).json({
            success: true,
            application,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch application",
        });
    }
};
exports.getSingleApplication = getSingleApplication;
/* ========================================
   UPDATE APPLICATION STATUS
======================================== */
const updateJobStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, } = req.body;
        const application = await prisma_1.default.jobApplication.findUnique({
            where: {
                id,
            },
        });
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        const updatedApplication = await prisma_1.default.jobApplication.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application: updatedApplication,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update status",
        });
    }
};
exports.updateJobStatus = updateJobStatus;
/* ========================================
   DELETE APPLICATION
======================================== */
const deleteJobApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const application = await prisma_1.default.jobApplication.findUnique({
            where: {
                id,
            },
        });
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }
        await prisma_1.default.jobApplication.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete application",
        });
    }
};
exports.deleteJobApplication = deleteJobApplication;
