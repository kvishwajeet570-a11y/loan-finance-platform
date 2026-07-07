"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.applyCoupon = exports.getCoupons = exports.createCoupon = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
/* ========================================
   CREATE COUPON
======================================== */
const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate, maxUsage, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!code ||
            !discount ||
            !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        /* ========================================
           CHECK EXISTING COUPON
        ======================================== */
        const existingCoupon = await prisma_1.default.coupon.findUnique({
            where: {
                code,
            },
        });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists",
            });
        }
        /* ========================================
           CREATE COUPON
        ======================================== */
        const coupon = await prisma_1.default.coupon.create({
            data: {
                code: code.toUpperCase(),
                discount: Number(discount),
                expiryDate: new Date(expiryDate),
                maxUsage: maxUsage || 100,
                usedCount: 0,
                isActive: true,
            },
        });
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create coupon",
        });
    }
};
exports.createCoupon = createCoupon;
/* ========================================
   GET ALL COUPONS
======================================== */
const getCoupons = async (req, res) => {
    try {
        const coupons = await prisma_1.default.coupon.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json({
            success: true,
            totalCoupons: coupons.length,
            coupons,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
        });
    }
};
exports.getCoupons = getCoupons;
/* ========================================
   APPLY COUPON
======================================== */
const applyCoupon = async (req, res) => {
    try {
        const { code, userId, } = req.body;
        /* ========================================
           VALIDATION
        ======================================== */
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }
        /* ========================================
           FIND COUPON
        ======================================== */
        const coupon = await prisma_1.default.coupon.findUnique({
            where: {
                code: code.toUpperCase(),
            },
        });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code",
            });
        }
        /* ========================================
           CHECK ACTIVE
        ======================================== */
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Coupon is inactive",
            });
        }
        /* ========================================
           CHECK EXPIRY
        ======================================== */
        if (new Date() >
            coupon.expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Coupon expired",
            });
        }
        /* ========================================
           CHECK USAGE LIMIT
        ======================================== */
        if (coupon.usedCount >=
            coupon.maxUsage) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached",
            });
        }
        /* ========================================
           UPDATE USAGE COUNT
        ======================================== */
        await prisma_1.default.coupon.update({
            where: {
                id: coupon.id,
            },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
        /* ========================================
           CREATE NOTIFICATION
        ======================================== */
        if (userId) {
            await prisma_1.default.notification.create({
                data: {
                    userId,
                    title: "Coupon Applied",
                    message: `${coupon.code} coupon applied successfully`,
                    type: "coupon",
                },
            });
        }
        /* ========================================
           RESPONSE
        ======================================== */
        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            discount: coupon.discount,
            coupon,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to apply coupon",
        });
    }
};
exports.applyCoupon = applyCoupon;
/* ========================================
   DELETE COUPON
======================================== */
const deleteCoupon = async (req, res) => {
    try {
        const id = req.params.id;
        const coupon = await prisma_1.default.coupon.findUnique({
            where: {
                id,
            },
        });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }
        await prisma_1.default.coupon.delete({
            where: {
                id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete coupon",
        });
    }
};
exports.deleteCoupon = deleteCoupon;
