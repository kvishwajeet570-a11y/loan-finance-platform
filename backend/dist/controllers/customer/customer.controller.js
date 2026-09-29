"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCustomersPdf = exports.exportCustomersExcel = exports.getCustomerAnalytics = exports.getCustomerProfile = exports.getCustomerDashboard = exports.getMonthlyCustomers = exports.getTopCustomers = exports.getInactiveCustomers = exports.getActiveCustomers = exports.verifyCustomer = exports.getCustomerKyc = exports.getCustomerDocuments = exports.getCustomerTransactions = exports.getCustomerLoans = exports.searchCustomers = exports.unblockCustomer = exports.blockCustomer = exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerByUserId = exports.getCustomerById = exports.getAllCustomers = void 0;
const customer_service_1 = require("../../services/customer/customer.service");
const getAllCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomers(req.query);
    res.json(data);
};
exports.getAllCustomers = getAllCustomers;
const getCustomerById = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerById(String(req.params.id));
    res.json(data);
};
exports.getCustomerById = getCustomerById;
const getCustomerByUserId = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerByUserId(String(req.params.userId));
    res.json(data);
};
exports.getCustomerByUserId = getCustomerByUserId;
const createCustomer = async (req, res) => {
    const data = await customer_service_1.customerService.createCustomer(req.body);
    res.status(201).json(data);
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    const data = await customer_service_1.customerService.updateCustomer(String(req.params.id), req.body);
    res.json(data);
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    await customer_service_1.customerService.deleteCustomer(String(req.params.id));
    res.json({
        success: true,
        message: "Customer deleted successfully",
    });
};
exports.deleteCustomer = deleteCustomer;
const blockCustomer = async (req, res) => {
    const data = await customer_service_1.customerService.blockCustomer(String(req.params.id));
    res.json(data);
};
exports.blockCustomer = blockCustomer;
const unblockCustomer = async (req, res) => {
    const data = await customer_service_1.customerService.unblockCustomer(String(req.params.id));
    res.json(data);
};
exports.unblockCustomer = unblockCustomer;
const searchCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.searchCustomers(String(req.query.search || ""));
    res.json(data);
};
exports.searchCustomers = searchCustomers;
const getCustomerLoans = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerLoans(String(req.params.id));
    res.json(data);
};
exports.getCustomerLoans = getCustomerLoans;
const getCustomerTransactions = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerTransactions(String(req.params.id));
    res.json(data);
};
exports.getCustomerTransactions = getCustomerTransactions;
const getCustomerDocuments = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerDocuments(String(req.params.id));
    res.json(data);
};
exports.getCustomerDocuments = getCustomerDocuments;
const getCustomerKyc = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerKyc(String(req.params.id));
    res.json(data);
};
exports.getCustomerKyc = getCustomerKyc;
const verifyCustomer = async (req, res) => {
    const data = await customer_service_1.customerService.verifyCustomer(String(req.params.id));
    res.json(data);
};
exports.verifyCustomer = verifyCustomer;
const getActiveCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.getActiveCustomers();
    res.json(data);
};
exports.getActiveCustomers = getActiveCustomers;
const getInactiveCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.getInactiveCustomers();
    res.json(data);
};
exports.getInactiveCustomers = getInactiveCustomers;
const getTopCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.getTopCustomers();
    res.json(data);
};
exports.getTopCustomers = getTopCustomers;
const getMonthlyCustomers = async (req, res) => {
    const data = await customer_service_1.customerService.getMonthlyCustomers();
    res.json(data);
};
exports.getMonthlyCustomers = getMonthlyCustomers;
const getCustomerDashboard = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerDashboard(String(req.params.id));
    res.json(data);
};
exports.getCustomerDashboard = getCustomerDashboard;
const getCustomerProfile = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerProfile(String(req.params.id));
    res.json(data);
};
exports.getCustomerProfile = getCustomerProfile;
const getCustomerAnalytics = async (req, res) => {
    const data = await customer_service_1.customerService.getCustomerAnalytics();
    res.json(data);
};
exports.getCustomerAnalytics = getCustomerAnalytics;
const exportCustomersExcel = async (req, res) => {
    const data = await customer_service_1.customerService.exportCustomersExcel();
    res.json(data);
};
exports.exportCustomersExcel = exportCustomersExcel;
const exportCustomersPdf = async (req, res) => {
    const data = await customer_service_1.customerService.exportCustomersPdf();
    res.json(data);
};
exports.exportCustomersPdf = exportCustomersPdf;
