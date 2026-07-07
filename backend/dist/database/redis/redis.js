"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = global.redis ||
    new ioredis_1.default({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
        retryStrategy(times) {
            return Math.min(times * 100, 3000);
        },
    });
if (process.env.NODE_ENV !== "production") {
    global.redis = redis;
}
redis.on("connect", () => {
    console.log("✅ Redis Connected");
});
redis.on("error", (error) => {
    console.error("❌ Redis Error:", error);
});
redis.on("reconnecting", () => {
    console.log("🔄 Redis Reconnecting...");
});
exports.default = redis;
