"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNotificationJob = exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
exports.notificationQueue = new bullmq_1.Queue("notification-queue", {
    connection: {
        host: process.env.REDIS_HOST ||
            "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});
const addNotificationJob = async (data) => {
    return exports.notificationQueue.add("create-notification", data);
};
exports.addNotificationJob = addNotificationJob;
