"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const email_1 = require("../../integrations/email/email");
const emailJob = () => {
    node_cron_1.default.schedule("0 10 * * *", async () => {
        console.log("Running Email Job...");
        const pendingLoans = await prisma_1.default.loanApplication.findMany({
            where: {
                status: "pending",
            },
        });
        for (const loan of pendingLoans) {
            if (!loan.email)
                continue;
            await (0, email_1.sendEmail)(loan.email, "Loan Application Update", `
        <h2>Hello ${loan.fullName}</h2>
        <p>Your loan application is under review.</p>
        `);
        }
        console.log("Email Job Completed");
    });
};
exports.emailJob = emailJob;
