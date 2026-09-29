"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = void 0;
const bullmq_1 = require("bullmq");
const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
};
const createQueue = (queueName) => {
    const queue = new bullmq_1.Queue(queueName, {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 3000,
            },
            removeOnComplete: 1000,
            removeOnFail: 500,
        },
    });
    const events = new bullmq_1.QueueEvents(queueName, {
        connection: redisConnection,
    });
    events.on("completed", ({ jobId }) => {
        console.log(`✅ ${queueName} Job Completed: ${jobId}`);
    });
    events.on("failed", ({ jobId, failedReason }) => {
        console.error(`❌ ${queueName} Job Failed: ${jobId}`, failedReason);
    });
    return queue;
};
exports.createQueue = createQueue;
