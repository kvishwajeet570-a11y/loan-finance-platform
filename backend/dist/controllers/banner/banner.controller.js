"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannerAnalytics = exports.incrementClick = exports.incrementView = exports.deactivateBanner = exports.activateBanner = exports.deleteBanner = exports.updateBanner = exports.getAudienceBanners = exports.getBannerByType = exports.getBannerById = exports.createBanner = exports.getActiveBanners = exports.getAllBanners = void 0;
const banner_service_1 = __importDefault(require("../../services/banner/banner.service"));
// ========================================
// GET ALL BANNERS
// ========================================
const getAllBanners = async (req, res) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const result = await banner_service_1.default.getAllBanners(page, limit);
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
// ========================================
// GET ACTIVE BANNERS
// ========================================
const getActiveBanners = async (req, res) => {
    try {
        const banners = await banner_service_1.default.getActiveBanners();
        res.status(200).json({
            success: true,
            data: banners,
        });
    }
    catch (error) {
        console.error("[ACTIVE_BANNERS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active banners",
        });
    }
};
exports.getActiveBanners = getActiveBanners;
// ========================================
// CREATE BANNER
// ========================================
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
// ========================================
// GET BANNER BY ID
// ========================================
const getBannerById = async (req, res) => {
    try {
        const banner = await banner_service_1.default.getBannerById(req.params.id);
        if (!banner) {
            res.status(404).json({
                success: false,
                message: "Banner not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        console.error("[GET_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banner",
        });
    }
};
exports.getBannerById = getBannerById;
// ========================================
// GET BANNER BY TYPE
// ========================================
const getBannerByType = async (req, res) => {
    try {
        const banners = await banner_service_1.default.getBannerByType(req.params.type);
        res.status(200).json({
            success: true,
            data: banners,
        });
    }
    catch (error) {
        console.error("[GET_BANNER_TYPE_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
        });
    }
};
exports.getBannerByType = getBannerByType;
// ========================================
// GET AUDIENCE BANNERS
// ========================================
const getAudienceBanners = async (req, res) => {
    try {
        const banners = await banner_service_1.default.getAudienceBanners(req.params.audience);
        res.status(200).json({
            success: true,
            data: banners,
        });
    }
    catch (error) {
        console.error("[AUDIENCE_BANNERS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch banners",
        });
    }
};
exports.getAudienceBanners = getAudienceBanners;
// ========================================
// UPDATE BANNER
// ========================================
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
        console.error("[UPDATE_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to update banner",
        });
    }
};
exports.updateBanner = updateBanner;
// ========================================
// DELETE BANNER
// ========================================
const deleteBanner = async (req, res) => {
    try {
        await banner_service_1.default.deleteBanner(req.params.id);
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    }
    catch (error) {
        console.error("[DELETE_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
        });
    }
};
exports.deleteBanner = deleteBanner;
// ========================================
// ACTIVATE BANNER
// ========================================
const activateBanner = async (req, res) => {
    try {
        const banner = await banner_service_1.default.activateBanner(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        console.error("[ACTIVATE_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to activate banner",
        });
    }
};
exports.activateBanner = activateBanner;
// ========================================
// DEACTIVATE BANNER
// ========================================
const deactivateBanner = async (req, res) => {
    try {
        const banner = await banner_service_1.default.deactivateBanner(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        console.error("[DEACTIVATE_BANNER_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to deactivate banner",
        });
    }
};
exports.deactivateBanner = deactivateBanner;
// ========================================
// INCREMENT VIEW
// ========================================
const incrementView = async (req, res) => {
    try {
        const banner = await banner_service_1.default.incrementView(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        console.error("[VIEW_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to update view count",
        });
    }
};
exports.incrementView = incrementView;
// ========================================
// INCREMENT CLICK
// ========================================
const incrementClick = async (req, res) => {
    try {
        const banner = await banner_service_1.default.incrementClick(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        console.error("[CLICK_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to update click count",
        });
    }
};
exports.incrementClick = incrementClick;
// ========================================
// BANNER ANALYTICS
// ========================================
const getBannerAnalytics = async (req, res) => {
    try {
        const analytics = await banner_service_1.default.getBannerAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch (error) {
        console.error("[BANNER_ANALYTICS_ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getBannerAnalytics = getBannerAnalytics;
