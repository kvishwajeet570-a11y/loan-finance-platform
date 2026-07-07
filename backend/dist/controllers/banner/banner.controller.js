"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannerAnalytics = exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getActiveBanners = exports.getAllBanners = void 0;
const banner_service_1 = __importDefault(require("../../services/banner/banner.service"));
const getAllBanners = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const result = await banner_service_1.default.getAllBanners({
            page,
            limit,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("[GET_BANNERS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
        });
    }
};
exports.getAllBanners = getAllBanners;
const getActiveBanners = async (req, res) => {
    try {
        const banners = await banner_service_1.default.getActiveBanners();
        res.status(200).json({
            success: true,
            data: banners,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch active banners",
        });
    }
};
exports.getActiveBanners = getActiveBanners;
const createBanner = async (req, res) => {
    try {
        const banner = await banner_service_1.default.createBanner(req.body);
        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner,
        });
    }
    catch (error) {
        console.error("[CREATE_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to create banner",
        });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        const banner = await banner_service_1.default.updateBanner(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update banner",
        });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        await banner_service_1.default.deleteBanner(req.params.id);
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
        });
    }
};
exports.deleteBanner = deleteBanner;
const getBannerAnalytics = async (req, res) => {
    try {
        const analytics = await banner_service_1.default.getBannerAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getBannerAnalytics = getBannerAnalytics;
