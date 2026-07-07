"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
exports.redisConnection = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
const createQueue = (queueName) => {
    const queue = new bullmq_1.Queue(queueName, {
        connection: exports.redisConnection,
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
        connection: exports.redisConnection,
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
