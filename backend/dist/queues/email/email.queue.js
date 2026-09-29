"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmailJob = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
};
exports.emailQueue = new bullmq_1.Queue("email-queue", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
const addEmailJob = async (data) => {
    return exports.emailQueue.add("send-email", data);
};
exports.addEmailJob = addEmailJob;
