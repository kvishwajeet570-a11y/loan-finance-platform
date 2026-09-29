"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoan = exports.rejectLoan = exports.approveLoan = exports.getSingleLoan = exports.getAllLoans = exports.applyLoan = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
/* ========================================
   APPLY LOAN
======================================== */
const applyLoan = async (req, res) => {
    try {
        console.log("REQ BODY =>", req.body);
        const { userId, fullName, email, phone, loanType, amount, dob, panNo, aadhaarNo, monthlyIncome, employmentType, address, city, state, pincode, purpose, } = req.body;
        if (!fullName ||
            !email ||
            !phone ||
            !loanType ||
            !amount ||
            !dob ||
            !panNo) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory",
            });
        }
        const normalizedEmail = String(email)
            .trim()
            .toLowerCase();
        const normalizedPhone = String(phone).trim();
        const normalizedPan = String(panNo)
            .trim()
            .toUpperCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address",
            });
        }
        if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number",
            });
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
            return res.status(400).json({
                success: false,
                message: "Invalid PAN number",
            });
        }
        const loanAmount = Number(amount);
        if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid loan amount",
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                email: normalizedEmail,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                isBlocked: true,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "No registered customer account found with this email. Please login/register first.",
            });
        }
        if (existingUser.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your customer account is blocked.",
            });
        }
        const finalUserId = existingUser.id;
        if (userId &&
            String(userId) !== existingUser.id) {
            return res.status(403).json({
                success: false,
                message: "Customer identity does not match the registered account.",
            });
        }
        const existingLoan = await prisma_1.default.loanApplication.findFirst({
            where: {
                userId: finalUserId,
                status: "PENDING",
            },
        });
        if (existingLoan) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending loan application.",
                data: {
                    loanId: existingLoan.id,
                },
            });
        }
        const loan = await prisma_1.default.loanApplication.create({
            data: {
                userId: finalUserId,
                fullName: String(fullName).trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
                loanType: String(loanType).trim(),
                amount: loanAmount,
                dob: String(dob).trim(),
                panNo: normalizedPan,
                aadhaarNo: aadhaarNo
                    ? String(aadhaarNo).trim()
                    : null,
                monthlyIncome: monthlyIncome !== undefined &&
                    monthlyIncome !== null &&
                    monthlyIncome !== ""
                    ? Number(monthlyIncome)
                    : null,
                employmentType: employmentType
                    ? String(employmentType).trim()
                    : null,
                purpose: purpose
                    ? String(purpose).trim()
                    : null,
                address: address
                    ? String(address).trim()
                    : null,
                city: city
                    ? String(city).trim()
                    : null,
                state: state
                    ? String(state).trim()
                    : null,
                zipCode: pincode
                    ? String(pincode).trim()
                    : null,
                status: "PENDING",
            },
        });
        console.log("REAL LOAN CREATED =>", loan.id, "USER =>", finalUserId);
        return res.status(201).json({
            success: true,
            message: "Loan application submitted successfully.",
            data: loan,
        });
    }
    catch (error) {
        console.error("APPLY LOAN ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit loan application.",
            error: process.env.NODE_ENV === "development"
                ? error
                : undefined,
        });
    }
};
exports.applyLoan = applyLoan;
/* ========================================
   GET ALL LOANS
======================================== */
const getAllLoans = async (req, res) => {
    try {
        const loans = await prisma_1.default.loanApplication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            count: loans.length,
            data: loans,
        });
    }
    catch (error) {
        console.error("GET ALL LOANS ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loans.",
        });
    }
};
exports.getAllLoans = getAllLoans;
/* ========================================
   GET SINGLE LOAN
======================================== */
const getSingleLoan = async (req, res) => {
    try {
        const loanId = String(req.params.id);
        const loan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan application not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: loan,
        });
    }
    catch (error) {
        console.error("GET SINGLE LOAN ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loan application.",
        });
    }
};
exports.getSingleLoan = getSingleLoan;
/* ========================================
   APPROVE LOAN
======================================== */
const approveLoan = async (req, res) => {
    try {
        const loanId = String(req.params.id);
        const existingLoan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: "Loan application not found.",
            });
        }
        const loan = await prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "APPROVED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan application approved successfully.",
            data: loan,
        });
    }
    catch (error) {
        console.error("APPROVE LOAN ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve loan application.",
        });
    }
};
exports.approveLoan = approveLoan;
/* ========================================
   REJECT LOAN
======================================== */
const rejectLoan = async (req, res) => {
    try {
        const loanId = String(req.params.id);
        const existingLoan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: "Loan application not found.",
            });
        }
        const loan = await prisma_1.default.loanApplication.update({
            where: {
                id: loanId,
            },
            data: {
                status: "REJECTED",
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan application rejected successfully.",
            data: loan,
        });
    }
    catch (error) {
        console.error("REJECT LOAN ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject loan application.",
        });
    }
};
exports.rejectLoan = rejectLoan;
/* ========================================
   DELETE LOAN
======================================== */
const deleteLoan = async (req, res) => {
    try {
        const loanId = String(req.params.id);
        const existingLoan = await prisma_1.default.loanApplication.findUnique({
            where: {
                id: loanId,
            },
        });
        if (!existingLoan) {
            return res.status(404).json({
                success: false,
                message: "Loan application not found.",
            });
        }
        await prisma_1.default.loanApplication.delete({
            where: {
                id: loanId,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Loan application deleted successfully.",
        });
    }
    catch (error) {
        console.error("DELETE LOAN ERROR =>", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete loan application.",
        });
    }
};
exports.deleteLoan = deleteLoan;
