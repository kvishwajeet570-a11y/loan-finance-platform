"use strict";
// src/metrics/metrics.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.activeUsersGauge = exports.loanApplicationCounter = exports.httpRequestCounter = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const register = new prom_client_1.default.Registry();
exports.register = register;
prom_client_1.default.collectDefaultMetrics({
    register,
});
exports.httpRequestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total HTTP Requests",
    labelNames: ["method", "route", "statusCode"],
});
exports.loanApplicationCounter = new prom_client_1.default.Counter({
    name: "loan_applications_total",
    help: "Total Loan Applications",
    labelNames: ["loanType"],
});
exports.activeUsersGauge = new prom_client_1.default.Gauge({
    name: "active_users",
    help: "Current Active Users",
});
register.registerMetric(exports.httpRequestCounter);
register.registerMetric(exports.loanApplicationCounter);
register.registerMetric(exports.activeUsersGauge);
