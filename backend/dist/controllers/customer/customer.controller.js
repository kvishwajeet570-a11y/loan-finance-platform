"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerAnalytics = exports.unblockCustomer = exports.blockCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const customer_service_1 = __importDefault(require("../../services/customer/customer.service"));
const getCustomers = async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const search = String(req.query.search || "");
        const status = String(req.query.status || "");
        const result = await customer_service_1.default.getCustomers({
            page,
            limit,
            search,
            status,
        });
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    try {
        const customer = await customer_service_1.default.getCustomerById(req.params.id);
        if (!customer) {
            res.status(404).json({
                success: false,
                message: "Customer not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: customer,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
        });
    }
};
exports.getCustomerById = getCustomerById;
const createCustomer = async (req, res) => {
    try {
        const customer = await customer_service_1.default.createCustomer(req.body);
        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    try {
        const customer = await customer_service_1.default.updateCustomer(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateCustomer = updateCustomer;
const blockCustomer = async (req, res) => {
    try {
        const customer = await customer_service_1.default.blockCustomer(req.params.id);
        res.status(200).json({
            success: true,
            message: "Customer blocked successfully",
            data: customer,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to block customer",
        });
    }
};
exports.blockCustomer = blockCustomer;
const unblockCustomer = async (req, res) => {
    try {
        const customer = await customer_service_1.default.unblockCustomer(req.params.id);
        res.status(200).json({
            success: true,
            message: "Customer unblocked successfully",
            data: customer,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to unblock customer",
        });
    }
};
exports.unblockCustomer = unblockCustomer;
const getCustomerAnalytics = async (req, res) => {
    try {
        const analytics = await customer_service_1.default.getCustomerAnalytics();
        res.status(200).json({
            success: true,
            data: analytics,
        });
    }
    catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics",
        });
    }
};
exports.getCustomerAnalytics = getCustomerAnalytics;
