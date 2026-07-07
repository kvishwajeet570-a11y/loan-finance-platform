"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = void 0;
const email_job_1 = require("./email/email.job");
const report_job_1 = require("./report/report.job");
const initializeCronJobs = () => {
    (0, email_job_1.emailJob)();
    (0, report_job_1.reportJob)();
    console.log("Cron Jobs Initialized");
};
exports.initializeCronJobs = initializeCronJobs;
